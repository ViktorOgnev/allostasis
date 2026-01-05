export interface EnergyEntry {
  id: string;
  /** The date this entry is for (user-selected, can be retroactive) - used for grouping by day */
  date: Date;
  /** The exact timestamp when this energy level was recorded - used for intraday tracking and sorting */
  timestamp: Date;
  energyLevel: number; // 1-10 scale
  mood: 'excellent' | 'good' | 'neutral' | 'low' | 'exhausted';
  notes?: string;
  factors?: {
    sleep?: 'poor' | 'fair' | 'good' | 'excellent';
    stress?: 'none' | 'low' | 'medium' | 'high';
    exercise?: boolean;
    meals?: 'regular' | 'irregular' | 'skipped';
  };
  tags?: string[];
}

export type EnergyMood = EnergyEntry['mood'];
export type EnergySleepFactor = NonNullable<EnergyEntry['factors']>['sleep'];
export type EnergyStressFactor = NonNullable<EnergyEntry['factors']>['stress'];
