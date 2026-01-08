/**
 * sALI (Simplified Allostatic Load Index) Calculation
 *
 * Calculates a 0-1 score representing allostatic load (system strain).
 * Lower values = better (less strain)
 * Higher values = worse (more strain)
 *
 * Formula: sALI = Σ(weight_i × normalized_metric_i)
 *
 * Metrics are normalized and inverted so that:
 * - "Good when high" metrics (sleep, recovery, energy) are inverted: (10 - value) / 10
 * - "Bad when high" metrics (load, stress) are used directly: value / 10
 *
 * Includes EMA smoothing for trend analysis:
 * - EMA(7): Short-term trend (recent changes)
 * - EMA(28): Long-term trend (sustained patterns)
 */

import type { AllostaticEntry, sALIEntry, WeightState } from '@/types/allostasis';
import { EMA_ALPHAS } from '@/types/allostasis';
import { calculateEMA } from './ema';

/**
 * Calculate sALI for a single entry
 *
 * @param entry - Allostatic entry to calculate sALI for
 * @param normalizedWeights - Weights for each metric (must sum to 1.0)
 * @param previoussALI - Previous sALI entry for EMA calculation (optional)
 * @returns sALI entry with raw score and smoothed trends
 */
export function calculatesALI(
  entry: AllostaticEntry,
  normalizedWeights: WeightState['normalizedWeights'],
  previoussALI?: sALIEntry
): sALIEntry {
  // Normalize and invert metrics (all to 0-1 scale where higher = more strain)
  const components = {
    sleepRecovery: normalizeMetric(entry.sleepRecovery, true),       // Invert: good when high
    physicalLoad: normalizeMetric(entry.physicalLoad, false),        // Direct: bad when high
    recoveryFromLoad: normalizeMetric(entry.recoveryFromLoad, true), // Invert: good when high
    psychologicalStress: normalizeMetric(entry.psychologicalStress, false), // Direct: bad when high
    energyLevel: normalizeMetric(entry.energyLevel, true),           // Invert: good when high
  };

  // Calculate weighted sum (raw sALI)
  const rawSALI =
    normalizedWeights.sleepRecovery * components.sleepRecovery +
    normalizedWeights.physicalLoad * components.physicalLoad +
    normalizedWeights.recoveryFromLoad * components.recoveryFromLoad +
    normalizedWeights.psychologicalStress * components.psychologicalStress +
    normalizedWeights.energyLevel * components.energyLevel;

  // Calculate EMA smoothing
  let sALI_EMA7: number;
  let sALI_EMA28: number;

  if (previoussALI) {
    // Update existing EMAs
    sALI_EMA7 = calculateEMA(rawSALI, previoussALI.sALI_EMA7, EMA_ALPHAS.SHORT_TERM);
    sALI_EMA28 = calculateEMA(rawSALI, previoussALI.sALI_EMA28, EMA_ALPHAS.LONG_TERM);
  } else {
    // First entry: initialize EMAs with raw value
    sALI_EMA7 = rawSALI;
    sALI_EMA28 = rawSALI;
  }

  return {
    id: crypto.randomUUID(),
    date: entry.date,
    rawSALI,
    sALI_EMA7,
    sALI_EMA28,
    components,
    weightsSnapshot: normalizedWeights,
  };
}

/**
 * Normalize a metric to 0-1 scale
 *
 * @param value - Metric value (0-10)
 * @param invert - If true, invert so high values become low (for "good when high" metrics)
 * @returns Normalized value (0-1, where 1 = more strain)
 */
function normalizeMetric(value: number, invert: boolean): number {
  if (invert) {
    // "Good when high" metrics: invert so low values = high strain
    return (10 - value) / 10;
  } else {
    // "Bad when high" metrics: direct mapping
    return value / 10;
  }
}

/**
 * Get sALI interpretation level
 *
 * @param sALI - sALI score (0-1)
 * @returns Interpretation level
 */
export function getsALILevel(
  sALI: number
): 'optimal' | 'good' | 'moderate' | 'high' | 'critical' {
  if (sALI <= 0.2) return 'optimal';
  if (sALI <= 0.4) return 'good';
  if (sALI <= 0.6) return 'moderate';
  if (sALI <= 0.8) return 'high';
  return 'critical';
}

/**
 * Get sALI color for visualization
 *
 * @param sALI - sALI score (0-1)
 * @returns Hex color code
 */
export function getsALIColor(sALI: number): string {
  if (sALI <= 0.2) return '#10B981';  // emerald-500 (optimal)
  if (sALI <= 0.4) return '#84CC16';  // lime-500 (good)
  if (sALI <= 0.6) return '#F59E0B';  // amber-500 (moderate)
  if (sALI <= 0.8) return '#EA580C';  // orange-600 (high)
  return '#DC2626';                   // red-600 (critical)
}

/**
 * Get sALI description
 *
 * @param sALI - sALI score (0-1)
 * @returns Human-readable description
 */
export function getsALIDescription(sALI: number): string {
  const level = getsALILevel(sALI);

  const descriptions = {
    optimal: 'Your system is well-balanced with minimal strain. Excellent recovery and adaptation.',
    good: 'Low allostatic load. Your system is handling demands well with adequate recovery.',
    moderate: 'Moderate strain on your system. Some areas may need attention to prevent accumulation.',
    high: 'High allostatic load. Your system is under significant strain. Recovery strategies needed.',
    critical: 'Critical strain level. Immediate attention to recovery and stress reduction recommended.',
  };

  return descriptions[level];
}

/**
 * Get sALI emoji
 *
 * @param sALI - sALI score (0-1)
 * @returns Emoji representing the level
 */
export function getsALIEmoji(sALI: number): string {
  const level = getsALILevel(sALI);

  const emojis = {
    optimal: '✨',
    good: '😊',
    moderate: '😐',
    high: '😰',
    critical: '🚨',
  };

  return emojis[level];
}

/**
 * Analyze sALI trend direction
 *
 * @param current - Current sALI entry
 * @param previous - Previous sALI entry (optional)
 * @returns Trend analysis
 */
export function analyzesALITrend(
  current: sALIEntry,
  previous?: sALIEntry
): {
  direction: 'improving' | 'worsening' | 'stable';
  magnitude: number;
  shortTermTrend: 'up' | 'down' | 'flat';
  longTermTrend: 'up' | 'down' | 'flat';
} {
  if (!previous) {
    return {
      direction: 'stable',
      magnitude: 0,
      shortTermTrend: 'flat',
      longTermTrend: 'flat',
    };
  }

  // Compare raw sALI
  const rawChange = current.rawSALI - previous.rawSALI;
  const magnitude = Math.abs(rawChange);

  // Determine direction (remember: lower sALI = better)
  let direction: 'improving' | 'worsening' | 'stable';
  if (magnitude < 0.05) {
    direction = 'stable';
  } else if (rawChange < 0) {
    direction = 'improving'; // Decreasing sALI = improving
  } else {
    direction = 'worsening'; // Increasing sALI = worsening
  }

  // Analyze EMA trends
  const shortTermChange = current.sALI_EMA7 - previous.sALI_EMA7;
  const longTermChange = current.sALI_EMA28 - previous.sALI_EMA28;

  const shortTermTrend = Math.abs(shortTermChange) < 0.02
    ? 'flat'
    : shortTermChange > 0
      ? 'up'
      : 'down';

  const longTermTrend = Math.abs(longTermChange) < 0.02
    ? 'flat'
    : longTermChange > 0
      ? 'up'
      : 'down';

  return {
    direction,
    magnitude,
    shortTermTrend,
    longTermTrend,
  };
}

/**
 * Get the largest contributor to sALI
 *
 * @param sALI - sALI entry
 * @returns Top contributing metric
 */
export function getTopContributor(sALI: sALIEntry): {
  metric: string;
  contribution: number;
  percentage: number;
} {
  const contributions = Object.entries(sALI.components).map(([metric, value]) => ({
    metric,
    contribution: value * sALI.weightsSnapshot[metric as keyof typeof sALI.weightsSnapshot],
    value,
  }));

  const top = contributions.reduce((max, curr) =>
    curr.contribution > max.contribution ? curr : max
  );

  return {
    metric: top.metric,
    contribution: top.contribution,
    percentage: (top.contribution / sALI.rawSALI) * 100,
  };
}

/**
 * Get all contributors sorted by impact
 *
 * @param sALI - sALI entry
 * @returns Array of contributors sorted by contribution (descending)
 */
export function getContributorBreakdown(sALI: sALIEntry): Array<{
  metric: string;
  contribution: number;
  percentage: number;
  normalizedValue: number;
  weight: number;
}> {
  const entries = Object.entries(sALI.components);

  return entries
    .map(([metric, normalizedValue]) => {
      const weight = sALI.weightsSnapshot[metric as keyof typeof sALI.weightsSnapshot];
      const contribution = normalizedValue * weight;

      return {
        metric,
        contribution,
        percentage: (contribution / sALI.rawSALI) * 100,
        normalizedValue,
        weight,
      };
    })
    .sort((a, b) => b.contribution - a.contribution);
}

/**
 * Calculate average sALI over a period
 *
 * @param sALIEntries - Array of sALI entries
 * @returns Average raw sALI, EMA7, and EMA28
 */
export function calculateAveragesALI(sALIEntries: sALIEntry[]): {
  avgRaw: number;
  avgEMA7: number;
  avgEMA28: number;
  min: number;
  max: number;
} {
  if (sALIEntries.length === 0) {
    return { avgRaw: 0, avgEMA7: 0, avgEMA28: 0, min: 0, max: 0 };
  }

  const rawValues = sALIEntries.map(e => e.rawSALI);
  const ema7Values = sALIEntries.map(e => e.sALI_EMA7);
  const ema28Values = sALIEntries.map(e => e.sALI_EMA28);

  return {
    avgRaw: rawValues.reduce((sum, v) => sum + v, 0) / rawValues.length,
    avgEMA7: ema7Values.reduce((sum, v) => sum + v, 0) / ema7Values.length,
    avgEMA28: ema28Values.reduce((sum, v) => sum + v, 0) / ema28Values.length,
    min: Math.min(...rawValues),
    max: Math.max(...rawValues),
  };
}
