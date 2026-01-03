export interface StressEntry {
  id: string;
  date: Date;
  timestamp: Date;
  type: 'breathing' | 'gratitude' | 'mindfulness' | 'journaling';
  duration?: number; // Minutes

  // For breathing exercises
  breathingPattern?: {
    name: string; // e.g., "4-7-8", "Box Breathing"
    cycles: number;
  };

  // For gratitude journal
  gratitudeItems?: string[]; // List of things grateful for

  // For mindfulness
  mindfulnessType?: string; // e.g., "body scan", "emotion observation"

  stressLevelBefore?: number; // 1-10 scale
  stressLevelAfter?: number; // 1-10 scale
  notes?: string;
}

export type StressActivityType = StressEntry['type'];

export interface BreathingPattern {
  name: string;
  inhale: number; // seconds
  hold: number; // seconds
  exhale: number; // seconds
  pause: number; // seconds
}
