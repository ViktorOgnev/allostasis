import { create } from 'zustand';
import { db } from '@/lib/db';
import type {
  AllostaticEntry,
  WeightState,
  sALIEntry,
  ConflictPattern,
  CalculationCache
} from '@/types/allostasis';
import { MINIMUM_ENTRIES_FOR_SALI, WEIGHT_CALCULATION_WINDOW_DAYS } from '@/types/allostasis';

interface AllostaticStore {
  // Data
  entries: AllostaticEntry[];
  currentWeights: WeightState | null;
  sALIHistory: sALIEntry[];
  conflicts: ConflictPattern[];

  // UI state
  isLoading: boolean;
  error: string | null;

  // Cache for performance
  calculationCache: CalculationCache | null;

  // Actions - Entry management
  loadEntries: () => Promise<void>;
  addEntry: (entry: Omit<AllostaticEntry, 'id'>) => Promise<void>;
  updateEntry: (id: string, updates: Partial<AllostaticEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;

  // Actions - Calculation management
  updateWeights: () => Promise<void>;
  calculateSALIForEntry: (entry: AllostaticEntry) => Promise<void>;
  detectConflicts: () => Promise<void>;

  // Helpers
  hasMinimumData: () => boolean;
  getEntriesByDateRange: (start: Date, end: Date) => AllostaticEntry[];
  getLatestEntry: () => AllostaticEntry | null;
  shouldRecalculateWeights: () => boolean;
}

export const useAllostaticStore = create<AllostaticStore>((set, get) => ({
  entries: [],
  currentWeights: null,
  sALIHistory: [],
  conflicts: [],
  isLoading: false,
  error: null,
  calculationCache: null,

  // Load all data from IndexedDB
  loadEntries: async () => {
    set({ isLoading: true, error: null });
    try {
      const [entries, weights, sALIEntries, conflicts] = await Promise.all([
        db.allostaticEntries.orderBy('timestamp').toArray(),
        db.weightStates.toArray(),
        db.sALIEntries.orderBy('date').toArray(),
        db.conflictPatterns.orderBy('detectedAt').toArray(),
      ]);

      set({
        entries,
        currentWeights: weights[0] || null, // Get the singleton weight state
        sALIHistory: sALIEntries,
        conflicts,
        isLoading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // Add a new entry and trigger recalculation pipeline
  addEntry: async (entry) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Create and save the new entry
      const newEntry: AllostaticEntry = {
        ...entry,
        id: crypto.randomUUID(),
      };
      await db.allostaticEntries.add(newEntry);

      // Update state with new entry
      set((state) => ({
        entries: [...state.entries, newEntry].sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        ),
      }));

      // 2. Check if we have minimum data for calculations
      const state = get();
      if (state.entries.length >= MINIMUM_ENTRIES_FOR_SALI) {
        // 3. Recalculate weights (online update)
        await state.updateWeights();

        // 4. Calculate sALI for this entry
        await state.calculateSALIForEntry(newEntry);

        // 5. Detect conflict patterns
        await state.detectConflicts();
      }

      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error; // Re-throw so UI can handle it
    }
  },

  // Update an existing entry
  updateEntry: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      await db.allostaticEntries.update(id, updates);

      set((state) => ({
        entries: state.entries.map((entry) =>
          entry.id === id ? { ...entry, ...updates } : entry
        ),
        isLoading: false,
      }));

      // Trigger recalculation if we have minimum data
      const state = get();
      if (state.entries.length >= MINIMUM_ENTRIES_FOR_SALI) {
        await state.updateWeights();
        await state.detectConflicts();
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // Delete an entry
  deleteEntry: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await db.allostaticEntries.delete(id);

      set((state) => ({
        entries: state.entries.filter((entry) => entry.id !== id),
        isLoading: false,
      }));

      // Trigger recalculation if we still have minimum data
      const state = get();
      if (state.entries.length >= MINIMUM_ENTRIES_FOR_SALI) {
        await state.updateWeights();
        await state.detectConflicts();
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // Recalculate weights based on current data
  updateWeights: async () => {
    try {
      const state = get();

      // Check if recalculation is needed (using cache)
      if (!state.shouldRecalculateWeights()) {
        return; // Use cached weights
      }

      // Import calculation module (lazy loaded)
      const { calculateMetricWeights } = await import('@/lib/allostasis/weights');

      // Get last 28 days of data
      const now = new Date();
      const windowStart = new Date(now.getTime() - WEIGHT_CALCULATION_WINDOW_DAYS * 24 * 60 * 60 * 1000);
      const windowEntries = state.entries.filter(e => e.date >= windowStart);

      if (windowEntries.length < MINIMUM_ENTRIES_FOR_SALI) {
        return; // Not enough data
      }

      // Calculate new weights
      const newWeights = calculateMetricWeights(windowEntries);

      // Save to database (upsert)
      await db.weightStates.put(newWeights);

      // Update cache
      const windowHash = windowEntries.map(e => e.id).join(',');

      set({
        currentWeights: newWeights,
        calculationCache: {
          lastCalculated: new Date(),
          windowHash,
          cachedWeights: newWeights,
        },
      });
    } catch (error) {
      console.error('Failed to update weights:', error);
      set({ error: (error as Error).message });
    }
  },

  // Calculate sALI for a specific entry
  calculateSALIForEntry: async (entry: AllostaticEntry) => {
    try {
      const state = get();

      if (!state.currentWeights) {
        console.warn('No weights available for sALI calculation');
        return;
      }

      // Import calculation module
      const { calculatesALI } = await import('@/lib/allostasis/sali');

      // Get previous sALI for EMA calculation
      const previoussALI = state.sALIHistory[state.sALIHistory.length - 1];

      // Calculate new sALI
      const newsALI = calculatesALI(entry, state.currentWeights.normalizedWeights, previoussALI);

      // Save to database
      await db.sALIEntries.add(newsALI);

      // Update state
      set((state) => ({
        sALIHistory: [...state.sALIHistory, newsALI].sort(
          (a, b) => a.date.getTime() - b.date.getTime()
        ),
      }));
    } catch (error) {
      console.error('Failed to calculate sALI:', error);
      set({ error: (error as Error).message });
    }
  },

  // Detect conflict patterns
  detectConflicts: async () => {
    try {
      const state = get();

      if (state.entries.length < MINIMUM_ENTRIES_FOR_SALI) {
        return;
      }

      // Import conflict detection module
      const { detectConflictPatterns } = await import('@/lib/allostasis/conflicts');

      // Detect patterns
      const detectedConflicts = detectConflictPatterns(state.entries);

      // Clear old conflicts and save new ones
      await db.conflictPatterns.clear();
      await db.conflictPatterns.bulkAdd(detectedConflicts);

      set({ conflicts: detectedConflicts });
    } catch (error) {
      console.error('Failed to detect conflicts:', error);
      set({ error: (error as Error).message });
    }
  },

  // Check if we have minimum data for calculations
  hasMinimumData: () => {
    const state = get();
    return state.entries.length >= MINIMUM_ENTRIES_FOR_SALI;
  },

  // Get entries within a date range
  getEntriesByDateRange: (start, end) => {
    const state = get();
    return state.entries.filter(
      (entry) => entry.date >= start && entry.date <= end
    );
  },

  // Get the most recent entry
  getLatestEntry: () => {
    const state = get();
    if (state.entries.length === 0) return null;
    return state.entries[state.entries.length - 1];
  },

  // Check if weights need recalculation
  shouldRecalculateWeights: () => {
    const state = get();

    if (!state.calculationCache) {
      return true; // No cache, need to calculate
    }

    // Get current calculation window
    const now = new Date();
    const windowStart = new Date(now.getTime() - WEIGHT_CALCULATION_WINDOW_DAYS * 24 * 60 * 60 * 1000);
    const windowEntries = state.entries.filter(e => e.date >= windowStart);

    // Create hash of current window
    const currentHash = windowEntries.map(e => e.id).join(',');

    // Compare with cached hash
    return currentHash !== state.calculationCache.windowHash;
  },
}));
