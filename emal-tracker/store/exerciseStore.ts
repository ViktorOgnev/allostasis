import { create } from 'zustand';
import { db } from '@/lib/db';
import type { ExerciseEntry } from '@/types/exercise';

interface ExerciseStore {
  entries: ExerciseEntry[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadEntries: () => Promise<void>;
  addEntry: (entry: Omit<ExerciseEntry, 'id'>) => Promise<void>;
  updateEntry: (id: string, updates: Partial<ExerciseEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getEntriesByDateRange: (start: Date, end: Date) => ExerciseEntry[];
  getWeeklyMinutes: () => number;
  getTotalMinutes: (days: number) => number;
}

export const useExerciseStore = create<ExerciseStore>((set, get) => ({
  entries: [],
  isLoading: false,
  error: null,

  loadEntries: async () => {
    set({ isLoading: true, error: null });
    try {
      const entries = await db.exerciseEntries.toArray();
      set({ entries, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addEntry: async (entry) => {
    set({ isLoading: true, error: null });
    try {
      const newEntry: ExerciseEntry = {
        ...entry,
        id: crypto.randomUUID(),
      };
      await db.exerciseEntries.add(newEntry);
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
      await db.exerciseEntries.update(id, updates);
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
      await db.exerciseEntries.delete(id);
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

  getWeeklyMinutes: () => {
    return get().getTotalMinutes(7);
  },

  getTotalMinutes: (days) => {
    const entries = get().entries;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentEntries = entries.filter(
      (entry) => new Date(entry.date) >= cutoffDate
    );

    return recentEntries.reduce((sum, entry) => sum + entry.duration, 0);
  },
}));
