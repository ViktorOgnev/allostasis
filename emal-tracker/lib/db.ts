import Dexie, { Table } from 'dexie';
import type { EnergyEntry } from '@/types/energy';
import type { SleepEntry } from '@/types/sleep';
import type { ExerciseEntry } from '@/types/exercise';
import type { StressEntry, StressLevelEntry } from '@/types/stress';
import type { UserSettings } from '@/types/common';

/**
 * EMAL Fitness Tracker Database
 * Uses IndexedDB via Dexie.js for client-side data persistence
 */
export class EMALDatabase extends Dexie {
  energyEntries!: Table<EnergyEntry, string>;
  sleepEntries!: Table<SleepEntry, string>;
  exerciseEntries!: Table<ExerciseEntry, string>;
  stressEntries!: Table<StressEntry, string>;
  stressLevelEntries!: Table<StressLevelEntry, string>;
  settings!: Table<UserSettings, string>;

  constructor() {
    super('EMALFitnessTracker');

    // Define database schema
    this.version(1).stores({
      energyEntries: 'id, date, timestamp, energyLevel, mood',
      sleepEntries: 'id, date, quality, duration, mood',
      exerciseEntries: 'id, date, type, intensity, duration',
      stressEntries: 'id, date, timestamp, type',
      stressLevelEntries: 'id, date, stressLevel, timeOfDay',
      settings: 'id',
    });
  }
}

// Create and export database instance
export const db = new EMALDatabase();

/**
 * Helper function to initialize default settings if they don't exist
 */
export async function initializeSettings(): Promise<UserSettings> {
  const existing = await db.settings.get('user-settings');

  if (existing) {
    return existing;
  }

  const defaultSettings: UserSettings = {
    id: 'user-settings',
    profile: {
      targetSleepHours: 8,
    },
    goals: {
      weeklyExerciseMinutes: 300,
      sleepConsistency: true,
    },
    notifications: {
      sleepReminder: {
        enabled: false,
        time: '22:00',
      },
      energyCheckIn: {
        enabled: false,
        times: ['09:00', '15:00', '21:00'],
      },
    },
    preferences: {
      theme: 'system',
      firstDayOfWeek: 1, // Monday
      chartPreferences: {
        showTrends: true,
        timeRange: 'week',
      },
    },
  };

  await db.settings.add(defaultSettings);
  return defaultSettings;
}
