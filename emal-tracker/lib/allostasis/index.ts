/**
 * Allostasis Module - Main Export
 *
 * Central export point for all allostasis calculation functionality
 */

// Core calculation functions
export { calculateMetricWeights, getTopMetric, getMetricsByWeight } from './weights';
export { calculatesALI, getsALILevel, getsALIColor, getsALIDescription } from './sali';
export { detectConflictPatterns, getPatternDisplayName, getPatternRecommendations } from './conflicts';

// Statistical functions
export { calculateSpearmanCorrelation, calculateStdDev, calculateMean } from './spearman';

// EMA utilities
export { calculateEMA, calculateEMASeries, calculateDualEMA } from './ema';

// Normalization utilities
export { normalizeToRange, clamp, remap, roundTo } from './normalization';

// Main orchestrator
export { runCalculationPipeline, recalculateAllsALI, validateEntry, getCalculationStatus } from './calculations';

// Re-export types for convenience
export type {
  AllostaticEntry,
  WeightState,
  sALIEntry,
  ConflictPattern,
  MetricName,
} from '@/types/allostasis';
