// Common types used across the application

export interface DateRange {
  start: Date;
  end: Date;
}

export interface TimeRange {
  startTime: Date;
  endTime: Date;
}

export type TimeFrame = 'week' | 'month' | 'quarter' | 'year';

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface UserSettings {
  id: 'user-settings'; // Single record
  profile: {
    name?: string;
    age?: number;
    targetSleepHours: number; // Default: 8
  };
  goals: {
    dailyEnergyTarget?: number; // Target average energy level
    weeklyExerciseMinutes?: number;
    sleepConsistency?: boolean; // Aim for consistent schedule
  };
  notifications: {
    sleepReminder?: {
      enabled: boolean;
      time: string; // HH:mm format
    };
    energyCheckIn?: {
      enabled: boolean;
      times: string[]; // Multiple check-in times
    };
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    firstDayOfWeek: 0 | 1; // 0=Sunday, 1=Monday
    chartPreferences: {
      showTrends: boolean;
      timeRange: TimeFrame;
    };
  };
}
