// Stress LEVEL tracking (new - addresses user feedback)
export type TimeOfDay = 'morning' | 'afternoon' | 'evening'

export interface StressLevelEntry {
  id: string
  date: Date
  stressLevel: number // 1-10
  timeOfDay: TimeOfDay
  stressors: string[]
  physicalSymptoms?: string[]
  copingStrategies: {
    strategy: string
    duration?: number // minutes
  }[]
  notes?: string
}

// Predefined options for stressors
export const STRESSOR_OPTIONS = [
  { value: 'work', label: 'Work', emoji: '💼' },
  { value: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { value: 'health', label: 'Health', emoji: '🏥' },
  { value: 'finance', label: 'Finance', emoji: '💰' },
  { value: 'social', label: 'Social', emoji: '👥' },
  { value: 'other', label: 'Other', emoji: '🔄' },
] as const

// Predefined options for physical symptoms
export const SYMPTOM_OPTIONS = [
  { value: 'tension', label: 'Muscle Tension', emoji: '😣' },
  { value: 'headache', label: 'Headache', emoji: '🤕' },
  { value: 'fatigue', label: 'Fatigue', emoji: '😴' },
  { value: 'racing_heart', label: 'Racing Heart', emoji: '💓' },
  { value: 'difficulty_breathing', label: 'Difficulty Breathing', emoji: '😮‍💨' },
  { value: 'stomach_issues', label: 'Stomach Issues', emoji: '🤢' },
] as const

// Predefined options for coping strategies
export const COPING_STRATEGY_OPTIONS = [
  { value: 'breathing', label: 'Breathing Exercise', emoji: '🫁', hasDuration: true },
  { value: 'gratitude', label: 'Gratitude Practice', emoji: '🙏', hasDuration: true },
  { value: 'exercise', label: 'Physical Exercise', emoji: '🏃', hasDuration: true },
  { value: 'meditation', label: 'Meditation', emoji: '🧘', hasDuration: true },
  { value: 'social_support', label: 'Social Support', emoji: '🤝', hasDuration: false },
  { value: 'nature', label: 'Time in Nature', emoji: '🌳', hasDuration: true },
  { value: 'creative', label: 'Creative Activity', emoji: '🎨', hasDuration: true },
  { value: 'rest', label: 'Rest/Nap', emoji: '😌', hasDuration: true },
] as const

// ---

// Stress ACTIVITY tracking (existing - for breathing exercises, gratitude journal, etc.)
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
