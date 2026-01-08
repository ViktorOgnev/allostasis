/**
 * Conflict Pattern Detection
 *
 * Detects 8 patterns of allostatic imbalance:
 *
 * ACUTE (4 patterns - detected from latest entry):
 * 1. high_load_low_recovery - High physical load without adequate recovery
 * 2. poor_sleep_high_stress - High stress combined with poor sleep
 * 3. overwork - High physical and psychological demands simultaneously
 * 4. fatigue_with_load - Continuing high load despite low energy
 *
 * CHRONIC (4 patterns - detected from time series):
 * 5. prolonged_stress - Sustained elevated stress (14+ days)
 * 6. chronic_sleep_deficit - Sustained poor sleep quality (14+ days)
 * 7. prolonged_fatigue - Sustained low energy (14+ days)
 * 8. brain_fog - Sustained low energy + high stress (60+ days)
 */

import type {
  AllostaticEntry,
  ConflictPattern,
  ConflictSeverity,
  AcuteConflictPattern,
  ChronicConflictPattern,
} from '@/types/allostasis';
import { CONFLICT_THRESHOLDS } from '@/types/allostasis';
import { calculateMean } from './spearman';

/**
 * Detect all conflict patterns in the dataset
 *
 * @param entries - Array of allostatic entries (sorted by date)
 * @returns Array of detected conflict patterns
 */
export function detectConflictPatterns(entries: AllostaticEntry[]): ConflictPattern[] {
  if (entries.length === 0) {
    return [];
  }

  const patterns: ConflictPattern[] = [];

  // Detect acute patterns (from latest entry)
  const acutePatterns = detectAcutePatterns(entries);
  patterns.push(...acutePatterns);

  // Detect chronic patterns (from time series, need minimum 14 days for most)
  if (entries.length >= 14) {
    const chronicPatterns = detectChronicPatterns(entries);
    patterns.push(...chronicPatterns);
  }

  return patterns;
}

/**
 * Detect acute conflict patterns from the latest entry
 */
function detectAcutePatterns(entries: AllostaticEntry[]): ConflictPattern[] {
  const latest = entries[entries.length - 1];
  const patterns: ConflictPattern[] = [];

  // Pattern 1: High Load + Low Recovery
  if (
    latest.physicalLoad > CONFLICT_THRESHOLDS.HIGH_LOAD &&
    latest.recoveryFromLoad < CONFLICT_THRESHOLDS.LOW_RECOVERY
  ) {
    patterns.push({
      id: crypto.randomUUID(),
      type: 'acute',
      pattern: 'high_load_low_recovery',
      severity: calculateSeverity(
        latest.physicalLoad,
        10 - latest.recoveryFromLoad
      ),
      detectedAt: latest.date,
      affectedMetrics: ['physicalLoad', 'recoveryFromLoad'],
      description: 'High physical load without adequate recovery - risk of overtraining',
    });
  }

  // Pattern 2: Poor Sleep + High Stress
  if (
    latest.psychologicalStress > CONFLICT_THRESHOLDS.HIGH_STRESS &&
    latest.sleepRecovery < CONFLICT_THRESHOLDS.LOW_SLEEP
  ) {
    patterns.push({
      id: crypto.randomUUID(),
      type: 'acute',
      pattern: 'poor_sleep_high_stress',
      severity: calculateSeverity(
        latest.psychologicalStress,
        10 - latest.sleepRecovery
      ),
      detectedAt: latest.date,
      affectedMetrics: ['psychologicalStress', 'sleepRecovery'],
      description: 'High stress combined with poor sleep quality - compounding strain',
    });
  }

  // Pattern 3: Overwork (High Physical Load + High Stress)
  if (
    latest.physicalLoad > CONFLICT_THRESHOLDS.HIGH_LOAD &&
    latest.psychologicalStress > CONFLICT_THRESHOLDS.HIGH_STRESS
  ) {
    patterns.push({
      id: crypto.randomUUID(),
      type: 'acute',
      pattern: 'overwork',
      severity: calculateSeverity(
        latest.physicalLoad,
        latest.psychologicalStress
      ),
      detectedAt: latest.date,
      affectedMetrics: ['physicalLoad', 'psychologicalStress'],
      description: 'Overwork pattern: high physical and psychological demands simultaneously',
    });
  }

  // Pattern 4: Fatigue with Load (Low Energy + High Load)
  if (
    latest.energyLevel < CONFLICT_THRESHOLDS.LOW_ENERGY &&
    latest.physicalLoad > CONFLICT_THRESHOLDS.HIGH_LOAD
  ) {
    patterns.push({
      id: crypto.randomUUID(),
      type: 'acute',
      pattern: 'fatigue_with_load',
      severity: calculateSeverity(
        10 - latest.energyLevel,
        latest.physicalLoad
      ),
      detectedAt: latest.date,
      affectedMetrics: ['energyLevel', 'physicalLoad'],
      description: 'Continuing high physical load despite low energy - burnout risk',
    });
  }

  return patterns;
}

/**
 * Detect chronic conflict patterns from time series
 */
function detectChronicPatterns(entries: AllostaticEntry[]): ConflictPattern[] {
  const patterns: ConflictPattern[] = [];
  const latest = entries[entries.length - 1];

  // Pattern 5: Prolonged Stress (14+ days)
  const last14 = entries.slice(-14);
  const avgStress14 = calculateMean(last14.map(e => e.psychologicalStress));

  if (avgStress14 > CONFLICT_THRESHOLDS.CHRONIC_STRESS_THRESHOLD) {
    patterns.push({
      id: crypto.randomUUID(),
      type: 'chronic',
      pattern: 'prolonged_stress',
      severity: avgStress14 > 8 ? 'high' : 'medium',
      detectedAt: latest.date,
      duration: 14,
      affectedMetrics: ['psychologicalStress'],
      description: 'Sustained elevated stress for 2+ weeks - chronic activation',
    });
  }

  // Pattern 6: Chronic Sleep Deficit (14+ days)
  const avgSleep14 = calculateMean(last14.map(e => e.sleepRecovery));

  if (avgSleep14 < CONFLICT_THRESHOLDS.CHRONIC_SLEEP_THRESHOLD) {
    patterns.push({
      id: crypto.randomUUID(),
      type: 'chronic',
      pattern: 'chronic_sleep_deficit',
      severity: avgSleep14 < 4 ? 'high' : 'medium',
      detectedAt: latest.date,
      duration: 14,
      affectedMetrics: ['sleepRecovery'],
      description: 'Sustained poor sleep quality for 2+ weeks - recovery impaired',
    });
  }

  // Pattern 7: Prolonged Fatigue (14+ days)
  const avgEnergy14 = calculateMean(last14.map(e => e.energyLevel));

  if (avgEnergy14 < CONFLICT_THRESHOLDS.CHRONIC_FATIGUE_THRESHOLD) {
    patterns.push({
      id: crypto.randomUUID(),
      type: 'chronic',
      pattern: 'prolonged_fatigue',
      severity: avgEnergy14 < 3 ? 'high' : 'medium',
      detectedAt: latest.date,
      duration: 14,
      affectedMetrics: ['energyLevel'],
      description: 'Sustained low energy for 2+ weeks - chronic fatigue pattern',
    });
  }

  // Pattern 8: Brain Fog (60+ days of low energy + high stress)
  if (entries.length >= 60) {
    const last60 = entries.slice(-60);
    const avgEnergy60 = calculateMean(last60.map(e => e.energyLevel));
    const avgStress60 = calculateMean(last60.map(e => e.psychologicalStress));

    if (
      avgEnergy60 < CONFLICT_THRESHOLDS.BRAIN_FOG_ENERGY_THRESHOLD &&
      avgStress60 > CONFLICT_THRESHOLDS.BRAIN_FOG_STRESS_THRESHOLD
    ) {
      patterns.push({
        id: crypto.randomUUID(),
        type: 'chronic',
        pattern: 'brain_fog',
        severity: 'high',
        detectedAt: latest.date,
        duration: 60,
        affectedMetrics: ['energyLevel', 'psychologicalStress'],
        description: 'Persistent brain fog: 60+ days of low energy with high stress',
      });
    }
  }

  return patterns;
}

/**
 * Calculate severity based on two contributing factors
 *
 * @param factor1 - First contributing factor (0-10)
 * @param factor2 - Second contributing factor (0-10)
 * @returns Severity level
 */
function calculateSeverity(factor1: number, factor2: number): ConflictSeverity {
  const combined = factor1 + factor2;

  if (combined >= 16) return 'high';      // Both >8, or one very high
  if (combined >= 13) return 'medium';    // Both >6.5
  return 'low';
}

/**
 * Get human-readable pattern name
 */
export function getPatternDisplayName(pattern: string): string {
  const names: Record<string, string> = {
    high_load_low_recovery: 'High Load, Low Recovery',
    poor_sleep_high_stress: 'Poor Sleep + High Stress',
    overwork: 'Overwork Pattern',
    fatigue_with_load: 'Fatigue with Load',
    prolonged_stress: 'Prolonged Stress',
    chronic_sleep_deficit: 'Chronic Sleep Deficit',
    prolonged_fatigue: 'Prolonged Fatigue',
    brain_fog: 'Brain Fog Pattern',
  };

  return names[pattern] || pattern;
}

/**
 * Get severity icon/emoji
 */
export function getSeverityIcon(severity: ConflictSeverity): string {
  const icons: Record<ConflictSeverity, string> = {
    low: '⚠️',
    medium: '⚠️⚠️',
    high: '🔥',
  };

  return icons[severity];
}

/**
 * Get severity color
 */
export function getSeverityColor(severity: ConflictSeverity): string {
  const colors: Record<ConflictSeverity, string> = {
    low: '#F59E0B',     // amber-500
    medium: '#EA580C',  // orange-600
    high: '#DC2626',    // red-600
  };

  return colors[severity];
}

/**
 * Get actionable recommendations for a conflict pattern
 */
export function getPatternRecommendations(pattern: string): string[] {
  const recommendations: Record<string, string[]> = {
    high_load_low_recovery: [
      'Schedule a rest day or active recovery session',
      'Ensure adequate sleep tonight (7-9 hours)',
      'Consider reducing workout intensity tomorrow',
      'Focus on nutrition and hydration',
    ],
    poor_sleep_high_stress: [
      'Practice relaxation techniques before bed',
      'Limit screen time 1 hour before sleep',
      'Try meditation or breathing exercises',
      'Consider journaling to process stress',
    ],
    overwork: [
      'Review your schedule and identify non-essential tasks',
      'Delegate or postpone lower-priority items',
      'Schedule breaks throughout the day',
      'Consider discussing workload with supervisor',
    ],
    fatigue_with_load: [
      'Reduce physical demands today if possible',
      'Take short breaks to prevent further depletion',
      'Prioritize sleep and recovery tonight',
      'Re-evaluate your energy management strategy',
    ],
    prolonged_stress: [
      'Consult with a healthcare provider or therapist',
      'Implement stress management techniques daily',
      'Identify and address chronic stressors',
      'Consider lifestyle changes to reduce ongoing stress',
    ],
    chronic_sleep_deficit: [
      'Establish consistent sleep schedule',
      'Create a relaxing bedtime routine',
      'Evaluate sleep environment (temperature, light, noise)',
      'Consult sleep specialist if problems persist',
    ],
    prolonged_fatigue: [
      'Consult healthcare provider to rule out medical causes',
      'Review nutrition and ensure balanced diet',
      'Gradually increase physical activity',
      'Address any underlying sleep or stress issues',
    ],
    brain_fog: [
      'Consult healthcare provider - this is a serious pattern',
      'Comprehensive health evaluation recommended',
      'Review medication side effects',
      'Consider cognitive behavioral therapy',
    ],
  };

  return recommendations[pattern] || ['Monitor the situation and track trends'];
}

/**
 * Filter conflicts by type
 */
export function filterConflictsByType(
  conflicts: ConflictPattern[],
  type: 'acute' | 'chronic'
): ConflictPattern[] {
  return conflicts.filter(c => c.type === type);
}

/**
 * Filter conflicts by severity
 */
export function filterConflictsBySeverity(
  conflicts: ConflictPattern[],
  severity: ConflictSeverity
): ConflictPattern[] {
  return conflicts.filter(c => c.severity === severity);
}

/**
 * Get the most severe active conflict
 */
export function getMostSevereConflict(
  conflicts: ConflictPattern[]
): ConflictPattern | null {
  if (conflicts.length === 0) return null;

  const severityOrder: Record<ConflictSeverity, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };

  return conflicts.reduce((most, current) =>
    severityOrder[current.severity] > severityOrder[most.severity]
      ? current
      : most
  );
}
