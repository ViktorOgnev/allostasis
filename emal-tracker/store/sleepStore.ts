import { create } from 'zustand';
import { db } from '@/lib/db';
import type { SleepEntry } from '@/types/sleep';
import { calculateSleepDuration } from '@/lib/utils';

interface SleepStore {
  entries: SleepEntry[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadEntries: () => Promise<void>;
  addEntry: (entry: Omit<SleepEntry, 'id' | 'duration'>) => Promise<void>;
  updateEntry: (id: string, updates: Partial<SleepEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getEntriesByDateRange: (start: Date, end: Date) => SleepEntry[];
  getLatestEntry: () => SleepEntry | null;
  getAverageSleepDuration: (days: number) => number;
}

export const useSleepStore = create<SleepStore>((set, get) => ({
  entries: [],
  isLoading: false,
  error: null,

  loadEntries: async () => {
    set({ isLoading: true, error: null });
    try {
      const entries = await db.sleepEntries.toArray();
      set({ entries, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addEntry: async (entry) => {
    set({ isLoading: true, error: null });
    try {
      const duration = calculateSleepDuration(entry.bedtime, entry.wakeTime);
      const newEntry: SleepEntry = {
        ...entry,
        id: crypto.randomUUID(),
        duration,
      };
      await db.sleepEntries.add(newEntry);
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
      await db.sleepEntries.update(id, updates);
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
      await db.sleepEntries.delete(id);
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

  getLatestEntry: () => {
    const entries = get().entries;
    if (entries.length === 0) return null;
    return entries.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  },

  getAverageSleepDuration: (days) => {
    const entries = get().entries;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentEntries = entries.filter(
      (entry) => new Date(entry.date) >= cutoffDate
    );

    if (recentEntries.length === 0) return 0;

    const totalDuration = recentEntries.reduce(
      (sum, entry) => sum + entry.duration,
      0
    );
    return Math.round((totalDuration / recentEntries.length) * 10) / 10;
  },
}));
