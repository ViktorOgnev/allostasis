// Health-Specific Color System for EMAL Fitness Tracker

export const colors = {
  // Energy Levels (semantic)
  energy: {
    veryLow: '#EF4444',    // red-500
    low: '#F97316',        // orange-500
    medium: '#EAB308',     // yellow-500
    good: '#84CC16',       // lime-500
    high: '#22C55E',       // green-500
    veryHigh: '#10B981',   // emerald-500
  },

  // Sleep Quality
  sleep: {
    poor: '#F87171',       // red-400
    fair: '#FCD34D',       // yellow-300
    good: '#86EFAC',       // green-300
    excellent: '#34D399',  // emerald-400
  },

  // Stress Levels
  stress: {
    none: '#DBEAFE',       // blue-100
    low: '#93C5FD',        // blue-300
    medium: '#FBBF24',     // yellow-400
    high: '#FB923C',       // orange-400
    veryHigh: '#EF4444',   // red-500
  },

  // Exercise Intensity
  exercise: {
    low: '#A5F3FC',        // cyan-200
    moderate: '#60A5FA',   // blue-400
    high: '#8B5CF6',       // violet-500
    vigorous: '#A855F7',   // purple-500
  },

  // UI Colors
  primary: '#3B82F6',      // blue-500
  secondary: '#8B5CF6',    // violet-500
  success: '#10B981',      // emerald-500
  warning: '#F59E0B',      // amber-500
  error: '#EF4444',        // red-500

  // Neutral
  background: '#FFFFFF',
  surface: '#F9FAFB',      // gray-50
  border: '#E5E7EB',       // gray-200
  text: {
    primary: '#111827',    // gray-900
    secondary: '#6B7280',  // gray-500
    tertiary: '#9CA3AF',   // gray-400
  },
} as const

// Helper function to get energy color by level (1-10)
export function getEnergyColor(level: number): string {
  if (level <= 2) return colors.energy.veryLow
  if (level <= 4) return colors.energy.low
  if (level <= 6) return colors.energy.medium
  if (level <= 7) return colors.energy.good
  if (level <= 9) return colors.energy.high
  return colors.energy.veryHigh
}

// Helper function to get sleep quality color (1-5)
export function getSleepQualityColor(quality: 1 | 2 | 3 | 4 | 5): string {
  if (quality === 1) return colors.sleep.poor
  if (quality === 2) return colors.sleep.poor
  if (quality === 3) return colors.sleep.fair
  if (quality === 4) return colors.sleep.good
  return colors.sleep.excellent
}

// Helper function to get stress level color (1-10)
export function getStressColor(level: number): string {
  if (level <= 2) return colors.stress.none
  if (level <= 4) return colors.stress.low
  if (level <= 6) return colors.stress.medium
  if (level <= 8) return colors.stress.high
  return colors.stress.veryHigh
}

// Helper function to get exercise intensity color
export function getExerciseColor(intensity: 'low' | 'moderate' | 'high' | 'vigorous'): string {
  return colors.exercise[intensity]
}
