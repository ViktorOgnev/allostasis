// Allostasis Type Definitions
// Version 2: Adaptive Allostatic Load Algorithm

// ============================================================================
// Core Entry Types
// ============================================================================

/**
 * Main allostatic entry - simplified 5-question daily check-in
 * All metrics on 0-10 scale for consistency
 */
export interface AllostaticEntry {
  id: string
  date: Date              // Midnight of selected date (for grouping by day)
  timestamp: Date         // Exact moment (for sorting and intraday tracking)

  // The 5 core questions (all 0-10 scale)
  sleepRecovery: number       // 0=terrible, 10=excellent
  physicalLoad: number        // 0=sedentary, 10=extreme
  recoveryFromLoad: number    // 0=exhausted, 10=fully recovered
  psychologicalStress: number // 0=calm, 10=overwhelmed
  energyLevel: number         // 0=exhausted, 10=energized [ANCHOR METRIC]

  notes?: string
}

// ============================================================================
// Weight Calculation Types
// ============================================================================

/**
 * Individual metric weight components
 */
export interface MetricWeight {
  impactWeight: number      // w_i: Spearman correlation with energy (0-1)
  volatilityWeight: number  // w_v: Standard deviation normalized (0-1)
  imbalanceWeight: number   // w_b: Conflict pattern multiplier (≥1.0)
  combinedWeight: number    // w_i × w_v × w_b

  // Diagnostic data
  spearmanRho?: number      // Raw Spearman correlation coefficient (-1 to 1)
  stdDev?: number           // Raw standard deviation
  activeConflicts: string[] // List of conflict pattern IDs affecting this metric
}

/**
 * Complete weight state for all metrics
 */
export interface WeightState {
  id: 'current-weights'     // Singleton identifier
  calculatedAt: Date        // When weights were last computed

  // Data window used for calculation
  dataWindow: {
    startDate: Date
    endDate: Date
    entryCount: number
  }

  // Individual metric weights
  weights: {
    sleepRecovery: MetricWeight
    physicalLoad: MetricWeight
    recoveryFromLoad: MetricWeight
    psychologicalStress: MetricWeight
    energyLevel: MetricWeight
  }

  // Normalized weights (sum = 1.0) for sALI calculation
  normalizedWeights: {
    sleepRecovery: number
    physicalLoad: number
    recoveryFromLoad: number
    psychologicalStress: number
    energyLevel: number
  }
}

// ============================================================================
// sALI (Simplified Allostatic Load Index) Types
// ============================================================================

/**
 * sALI entry with smoothed trend lines
 */
export interface sALIEntry {
  id: string
  date: Date

  rawSALI: number      // Raw sALI score (0-1, lower is better)
  sALI_EMA7: number    // 7-day Exponential Moving Average
  sALI_EMA28: number   // 28-day Exponential Moving Average

  // Component breakdown (each metric's contribution to total sALI)
  components: {
    sleepRecovery: number
    physicalLoad: number
    recoveryFromLoad: number
    psychologicalStress: number
    energyLevel: number
  }

  // Snapshot of weights used for this calculation
  weightsSnapshot: WeightState['normalizedWeights']
}

// ============================================================================
// Conflict Pattern Types
// ============================================================================

/**
 * Conflict pattern type
 */
export type ConflictType = 'acute' | 'chronic'

/**
 * Conflict severity level
 */
export type ConflictSeverity = 'low' | 'medium' | 'high'

/**
 * Acute conflict pattern IDs
 */
export type AcuteConflictPattern =
  | 'high_load_low_recovery'  // High physical load without adequate recovery
  | 'poor_sleep_high_stress'  // High stress combined with poor sleep
  | 'overwork'                // High physical and psychological demands
  | 'fatigue_with_load'       // Continuing high load despite low energy

/**
 * Chronic conflict pattern IDs
 */
export type ChronicConflictPattern =
  | 'prolonged_stress'        // Sustained elevated stress (14+ days)
  | 'chronic_sleep_deficit'   // Sustained poor sleep quality (14+ days)
  | 'prolonged_fatigue'       // Sustained low energy (14+ days)
  | 'brain_fog'               // Sustained low energy + high stress (60+ days)

/**
 * All conflict pattern IDs
 */
export type ConflictPatternId = AcuteConflictPattern | ChronicConflictPattern

/**
 * Detected conflict pattern
 */
export interface ConflictPattern {
  id: string                      // Unique instance ID
  type: ConflictType              // 'acute' or 'chronic'
  pattern: ConflictPatternId      // Pattern identifier
  severity: ConflictSeverity      // 'low', 'medium', or 'high'
  detectedAt: Date                // When pattern was first detected
  duration?: number               // Duration in days (for chronic patterns)
  affectedMetrics: string[]       // Metrics involved in this conflict
  description: string             // Human-readable description
}

// ============================================================================
// Helper Types
// ============================================================================

/**
 * Metric names for type safety
 */
export type MetricName =
  | 'sleepRecovery'
  | 'physicalLoad'
  | 'recoveryFromLoad'
  | 'psychologicalStress'
  | 'energyLevel'

/**
 * Calculation cache for performance optimization
 */
export interface CalculationCache {
  lastCalculated: Date
  windowHash: string          // Hash of entry IDs in the calculation window
  cachedWeights: WeightState
}

/**
 * Time series data point for a single metric
 */
export interface MetricTimeSeries {
  date: Date
  value: number
}

/**
 * Correlation analysis result
 */
export interface CorrelationResult {
  metric: MetricName
  spearmanRho: number         // Spearman correlation coefficient
  pValue?: number             // Statistical significance (optional)
  sampleSize: number          // Number of data points used
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Conflict pattern detection thresholds
 */
export const CONFLICT_THRESHOLDS = {
  // Acute patterns
  HIGH_LOAD: 7,
  LOW_RECOVERY: 4,
  HIGH_STRESS: 7,
  LOW_ENERGY: 4,
  LOW_SLEEP: 4,

  // Chronic patterns
  CHRONIC_STRESS_THRESHOLD: 6,
  CHRONIC_STRESS_DAYS: 14,
  CHRONIC_SLEEP_THRESHOLD: 6,
  CHRONIC_SLEEP_DAYS: 14,
  CHRONIC_FATIGUE_THRESHOLD: 5,
  CHRONIC_FATIGUE_DAYS: 14,
  BRAIN_FOG_ENERGY_THRESHOLD: 5,
  BRAIN_FOG_STRESS_THRESHOLD: 7,
  BRAIN_FOG_DAYS: 60,
} as const

/**
 * EMA smoothing factors
 */
export const EMA_ALPHAS = {
  SHORT_TERM: 2 / (7 + 1),   // 0.25 for 7-day EMA
  LONG_TERM: 2 / (28 + 1),   // ~0.069 for 28-day EMA
} as const

/**
 * Weight calculation window
 */
export const WEIGHT_CALCULATION_WINDOW_DAYS = 28

/**
 * Minimum entries required before showing sALI
 */
export const MINIMUM_ENTRIES_FOR_SALI = 7
