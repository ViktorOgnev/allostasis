import { create } from 'zustand';
import { db } from '@/lib/db';
import type { EnergyEntry } from '@/types/energy';

interface EnergyStore {
  entries: EnergyEntry[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadEntries: () => Promise<void>;
  addEntry: (entry: Omit<EnergyEntry, 'id'>) => Promise<void>;
  updateEntry: (id: string, updates: Partial<EnergyEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getEntriesByDateRange: (start: Date, end: Date) => EnergyEntry[];
  getTodayEntries: () => EnergyEntry[];
  getLatestEntry: () => EnergyEntry | null;
}

export const useEnergyStore = create<EnergyStore>((set, get) => ({
  entries: [],
  isLoading: false,
  error: null,

  loadEntries: async () => {
    set({ isLoading: true, error: null });
    try {
      const entries = await db.energyEntries.toArray();
      set({ entries, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addEntry: async (entry) => {
    set({ isLoading: true, error: null });
    try {
      const newEntry: EnergyEntry = {
        ...entry,
        id: crypto.randomUUID(),
      };
      await db.energyEntries.add(newEntry);
      set((state) => ({
        entries: [...state.entries, newEntry],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateEntry: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      await db.energyEntries.update(id, updates);
      set((state) => ({
        entries: state.entries.map((entry) =>
          entry.id === id ? { ...entry, ...updates } : entry
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteEntry: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await db.energyEntries.delete(id);
      set((state) => ({
        entries: state.entries.filter((entry) => entry.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  getEntriesByDateRange: (start, end) => {
    const entries = get().entries;
    return entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= start && entryDate <= end;
    });
  },

  getTodayEntries: () => {
    const entries = get().entries;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= today && entryDate < tomorrow;
    });
  },

  getLatestEntry: () => {
    const entries = get().entries;
    if (entries.length === 0) return null;
    return entries.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
  },
}));
