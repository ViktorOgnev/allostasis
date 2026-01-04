import { create } from 'zustand';
import { db } from '@/lib/db';
import type { StressLevelEntry } from '@/types/stress';

interface StressLevelStore {
  entries: StressLevelEntry[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadEntries: () => Promise<void>;
  addEntry: (entry: Omit<StressLevelEntry, 'id'>) => Promise<void>;
  updateEntry: (id: string, updates: Partial<StressLevelEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getEntriesByDateRange: (start: Date, end: Date) => StressLevelEntry[];
  getTodayEntries: () => StressLevelEntry[];
  getLatestEntry: () => StressLevelEntry | null;
  getAverageStressLevel: (days?: number) => number;
}

export const useStressLevelStore = create<StressLevelStore>((set, get) => ({
  entries: [],
  isLoading: false,
  error: null,

  loadEntries: async () => {
    set({ isLoading: true, error: null });
    try {
      const entries = await db.stressLevelEntries.toArray();
      set({ entries, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addEntry: async (entry) => {
    set({ isLoading: true, error: null });
    try {
      const newEntry: StressLevelEntry = {
        ...entry,
        id: crypto.randomUUID(),
      };
      await db.stressLevelEntries.add(newEntry);
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
      await db.stressLevelEntries.update(id, updates);
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
      await db.stressLevelEntries.delete(id);
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

    return [...entries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  },

  getAverageStressLevel: (days = 7) => {
    const entries = get().entries;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentEntries = entries.filter(
      (entry) => new Date(entry.date) >= cutoffDate
    );

    if (recentEntries.length === 0) return 0;

    const sum = recentEntries.reduce((acc, entry) => acc + entry.stressLevel, 0);
    return Math.round((sum / recentEntries.length) * 10) / 10;
  },
}));
