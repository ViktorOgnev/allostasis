export interface SleepEntry {
  id: string;
  date: Date; // Sleep date (night of)
  bedtime: Date; // When went to bed
  wakeTime: Date; // When woke up
  duration: number; // Hours slept (calculated)
  quality: 1 | 2 | 3 | 4 | 5; // 1=poor, 5=excellent
  fellAsleepTime?: number; // Minutes to fall asleep
  interruptions?: number; // Number of wake-ups
  mood: 'refreshed' | 'okay' | 'groggy' | 'exhausted';
  notes?: string;
  factors?: {
    caffeine?: boolean; // Caffeine after 2pm
    alcohol?: boolean;
    lateExercise?: boolean; // Exercise within 2h of bed
    screenTime?: boolean; // Screen within 1h of bed
    stress?: boolean;
  };
}

export type SleepQuality = SleepEntry['quality'];
export type SleepMood = SleepEntry['mood'];
