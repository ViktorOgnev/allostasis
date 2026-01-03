export interface ExerciseEntry {
  id: string;
  date: Date;
  startTime: Date;
  duration: number; // Minutes
  type: 'cardio' | 'strength' | 'flexibility' | 'walking' | 'sports' | 'other';
  intensity: 'low' | 'moderate' | 'high' | 'vigorous';
  description?: string;
  caloriesBurned?: number; // Optional
  heartRate?: {
    average?: number;
    max?: number;
  };
  energyBefore?: number; // 1-10 scale
  energyAfter?: number; // 1-10 scale
  notes?: string;
}

export type ExerciseType = ExerciseEntry['type'];
export type ExerciseIntensity = ExerciseEntry['intensity'];
