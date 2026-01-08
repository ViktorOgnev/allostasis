/**
 * Adaptive Weight Calculation
 *
 * Calculates metric weights using three components:
 * 1. Impact Weight (w_i): Spearman correlation with energy
 * 2. Volatility Weight (w_v): Standard deviation (instability)
 * 3. Imbalance Weight (w_b): Conflict pattern detection
 *
 * Combined weight: W = w_i × w_v × w_b
 * Normalized so sum of all weights = 1.0
 */

import type { AllostaticEntry, WeightState, MetricName, MetricWeight } from '@/types/allostasis';
import { calculateSpearmanCorrelation, calculateStdDev } from './spearman';
import { detectConflictPatterns } from './conflicts';

/**
 * Calculate adaptive weights for all metrics
 *
 * @param entries - Array of allostatic entries (minimum 7 days)
 * @returns Complete weight state with normalized weights
 */
export function calculateMetricWeights(entries: AllostaticEntry[]): WeightState {
  if (entries.length < 7) {
    throw new Error('Need at least 7 entries to calculate weights');
  }

  // Metrics to calculate weights for (excluding energy, which is the anchor)
  const metrics: MetricName[] = [
    'sleepRecovery',
    'physicalLoad',
    'recoveryFromLoad',
    'psychologicalStress',
  ];

  // Extract energy values (anchor metric)
  const energyValues = entries.map(e => e.energyLevel);

  // Detect conflict patterns for imbalance weight
  const conflicts = detectConflictPatterns(entries);

  // Calculate weights for each metric
  const weights: Record<string, MetricWeight> = {};

  for (const metric of metrics) {
    const metricValues = entries.map(e => e[metric]);

    // Component A: Impact Weight (Spearman correlation with energy)
    const rho = calculateSpearmanCorrelation(metricValues, energyValues);
    // Normalize to 0-1 range (|rho| is 0-1, +1 shifts to 1-2, /2 gives 0.5-1)
    const w_i = (Math.abs(rho) + 1) / 2;

    // Component B: Volatility Weight (standard deviation)
    const stdDev = calculateStdDev(metricValues);
    // Normalize: divide by scale (10 is max for 0-10 scale), cap at 1.0
    const w_v = Math.min(1.0, stdDev / 3); // Using 3 as divisor makes std>3 get full weight

    // Component C: Imbalance Weight (conflict patterns)
    const metricConflicts = conflicts.filter(c =>
      c.affectedMetrics.includes(metric)
    );
    // Base weight 1.0, add 0.5 for each conflict affecting this metric
    const w_b = 1.0 + (metricConflicts.length * 0.5);

    // Combined weight
    const combinedWeight = w_i * w_v * w_b;

    weights[metric] = {
      impactWeight: w_i,
      volatilityWeight: w_v,
      imbalanceWeight: w_b,
      combinedWeight,
      spearmanRho: rho,
      stdDev,
      activeConflicts: metricConflicts.map(c => c.pattern),
    };
  }

  // Energy always has weight 1.0 (it's the anchor metric)
  weights.energyLevel = {
    impactWeight: 1.0,
    volatilityWeight: 1.0,
    imbalanceWeight: 1.0,
    combinedWeight: 1.0,
    spearmanRho: 1.0,
    stdDev: calculateStdDev(energyValues),
    activeConflicts: [],
  };

  // Normalize weights so they sum to 1.0
  const totalWeight = Object.values(weights).reduce(
    (sum, w) => sum + w.combinedWeight,
    0
  );

  const normalizedWeights = {
    sleepRecovery: weights.sleepRecovery.combinedWeight / totalWeight,
    physicalLoad: weights.physicalLoad.combinedWeight / totalWeight,
    recoveryFromLoad: weights.recoveryFromLoad.combinedWeight / totalWeight,
    psychologicalStress: weights.psychologicalStress.combinedWeight / totalWeight,
    energyLevel: weights.energyLevel.combinedWeight / totalWeight,
  };

  // Create weight state
  const weightState: WeightState = {
    id: 'current-weights',
    calculatedAt: new Date(),
    dataWindow: {
      startDate: entries[0].date,
      endDate: entries[entries.length - 1].date,
      entryCount: entries.length,
    },
    weights: {
      sleepRecovery: weights.sleepRecovery,
      physicalLoad: weights.physicalLoad,
      recoveryFromLoad: weights.recoveryFromLoad,
      psychologicalStress: weights.psychologicalStress,
      energyLevel: weights.energyLevel,
    },
    normalizedWeights,
  };

  return weightState;
}

/**
 * Get the metric with the highest weight
 *
 * @param weights - Weight state
 * @returns Metric name with highest weight
 */
export function getTopMetric(weights: WeightState): {
  metric: MetricName;
  weight: number;
  percentage: number;
} {
  const entries = Object.entries(weights.normalizedWeights) as [MetricName, number][];

  const top = entries.reduce((max, [metric, weight]) =>
    weight > max.weight ? { metric, weight } : max
  , { metric: 'energyLevel' as MetricName, weight: 0 });

  return {
    ...top,
    percentage: top.weight * 100,
  };
}

/**
 * Get metrics sorted by weight (descending)
 *
 * @param weights - Weight state
 * @returns Array of [metric, weight] tuples sorted by weight
 */
export function getMetricsByWeight(weights: WeightState): Array<{
  metric: MetricName;
  weight: number;
  percentage: number;
  rank: number;
}> {
  const entries = Object.entries(weights.normalizedWeights) as [MetricName, number][];

  return entries
    .map(([metric, weight]) => ({
      metric,
      weight,
      percentage: weight * 100,
      rank: 0, // Will be filled below
    }))
    .sort((a, b) => b.weight - a.weight)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

/**
 * Calculate weight change compared to previous state
 *
 * @param current - Current weight state
 * @param previous - Previous weight state
 * @returns Object with weight changes for each metric
 */
export function calculateWeightChanges(
  current: WeightState,
  previous: WeightState
): Record<MetricName, { change: number; percentChange: number }> {
  const metrics: MetricName[] = [
    'sleepRecovery',
    'physicalLoad',
    'recoveryFromLoad',
    'psychologicalStress',
    'energyLevel',
  ];

  const changes: any = {};

  for (const metric of metrics) {
    const currentWeight = current.normalizedWeights[metric];
    const previousWeight = previous.normalizedWeights[metric];

    const change = currentWeight - previousWeight;
    const percentChange = previousWeight > 0
      ? (change / previousWeight) * 100
      : 0;

    changes[metric] = {
      change,
      percentChange,
    };
  }

  return changes;
}

/**
 * Get human-readable metric name
 */
export function getMetricDisplayName(metric: MetricName): string {
  const names: Record<MetricName, string> = {
    sleepRecovery: 'Sleep Recovery',
    physicalLoad: 'Physical Load',
    recoveryFromLoad: 'Recovery from Load',
    psychologicalStress: 'Psychological Stress',
    energyLevel: 'Energy Level',
  };

  return names[metric];
}

/**
 * Get metric description
 */
export function getMetricDescription(metric: MetricName): string {
  const descriptions: Record<MetricName, string> = {
    sleepRecovery: 'How well you slept last night',
    physicalLoad: 'Physical activity and demands today',
    recoveryFromLoad: 'How recovered you feel from physical demands',
    psychologicalStress: 'Mental and emotional stress level',
    energyLevel: 'Current energy and vitality (anchor metric)',
  };

  return descriptions[metric];
}
