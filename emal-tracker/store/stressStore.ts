import { create } from 'zustand';
import { db } from '@/lib/db';
import type { StressEntry } from '@/types/stress';

interface StressStore {
  entries: StressEntry[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadEntries: () => Promise<void>;
  addEntry: (entry: Omit<StressEntry, 'id'>) => Promise<void>;
  updateEntry: (id: string, updates: Partial<StressEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getEntriesByDateRange: (start: Date, end: Date) => StressEntry[];
  getTodayEntries: () => StressEntry[];
  getEntriesByType: (type: StressEntry['type']) => StressEntry[];
  getStreak: (type?: StressEntry['type']) => number;
}

export const useStressStore = create<StressStore>((set, get) => ({
  entries: [],
  isLoading: false,
  error: null,

  loadEntries: async () => {
    set({ isLoading: true, error: null });
    try {
      const entries = await db.stressEntries.toArray();
      set({ entries, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addEntry: async (entry) => {
    set({ isLoading: true, error: null });
    try {
      const newEntry: StressEntry = {
        ...entry,
        id: crypto.randomUUID(),
      };
      await db.stressEntries.add(newEntry);
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
      await db.stressEntries.update(id, updates);
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
      await db.stressEntries.delete(id);
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

  getEntriesByType: (type) => {
    const entries = get().entries;
    return entries.filter((entry) => entry.type === type);
  },

  getStreak: (type) => {
    const entries = get().entries;
    const filteredEntries = type
      ? entries.filter((entry) => entry.type === type)
      : entries;

    if (filteredEntries.length === 0) return 0;

    // Sort by date descending
    const sorted = [...filteredEntries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const entry of sorted) {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);

      if (entryDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  },
}));
