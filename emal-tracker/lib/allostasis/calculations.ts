/**
 * Allostasis Calculation Orchestrator
 *
 * Main entry point for all allostasis calculations.
 * Coordinates weight calculation, sALI computation, and conflict detection.
 */

import type { AllostaticEntry, WeightState, sALIEntry, ConflictPattern } from '@/types/allostasis';
import { MINIMUM_ENTRIES_FOR_SALI, WEIGHT_CALCULATION_WINDOW_DAYS } from '@/types/allostasis';
import { calculateMetricWeights } from './weights';
import { calculatesALI } from './sali';
import { detectConflictPatterns } from './conflicts';

/**
 * Complete calculation pipeline result
 */
export interface CalculationResult {
  weights: WeightState;
  sALI: sALIEntry;
  conflicts: ConflictPattern[];
  metadata: {
    totalEntries: number;
    windowEntries: number;
    calculatedAt: Date;
    hasMinimumData: boolean;
  };
}

/**
 * Run complete calculation pipeline for new entry
 *
 * @param newEntry - New allostatic entry
 * @param allEntries - All historical entries (sorted by date)
 * @param previoussALI - Previous sALI entry (for EMA calculation)
 * @returns Complete calculation results
 */
export async function runCalculationPipeline(
  newEntry: AllostaticEntry,
  allEntries: AllostaticEntry[],
  previoussALI?: sALIEntry
): Promise<CalculationResult | null> {
  // Check minimum data requirement
  if (allEntries.length < MINIMUM_ENTRIES_FOR_SALI) {
    return null; // Not enough data
  }

  // Get calculation window (last 28 days)
  const windowStart = new Date(
    Date.now() - WEIGHT_CALCULATION_WINDOW_DAYS * 24 * 60 * 60 * 1000
  );
  const windowEntries = allEntries.filter(e => e.date >= windowStart);

  if (windowEntries.length < MINIMUM_ENTRIES_FOR_SALI) {
    return null; // Not enough data in window
  }

  // Step 1: Calculate adaptive weights
  const weights = calculateMetricWeights(windowEntries);

  // Step 2: Calculate sALI for new entry
  const sALI = calculatesALI(newEntry, weights.normalizedWeights, previoussALI);

  // Step 3: Detect conflict patterns
  const conflicts = detectConflictPatterns(allEntries);

  return {
    weights,
    sALI,
    conflicts,
    metadata: {
      totalEntries: allEntries.length,
      windowEntries: windowEntries.length,
      calculatedAt: new Date(),
      hasMinimumData: true,
    },
  };
}

/**
 * Batch recalculate all sALI entries
 * Useful for migration or recalculation after algorithm changes
 *
 * @param entries - All allostatic entries (sorted by date)
 * @returns Array of sALI entries
 */
export async function recalculateAllsALI(
  entries: AllostaticEntry[]
): Promise<sALIEntry[]> {
  if (entries.length < MINIMUM_ENTRIES_FOR_SALI) {
    return [];
  }

  const sALIEntries: sALIEntry[] = [];

  for (let i = MINIMUM_ENTRIES_FOR_SALI - 1; i < entries.length; i++) {
    const windowStart = Math.max(0, i - WEIGHT_CALCULATION_WINDOW_DAYS + 1);
    const windowEntries = entries.slice(windowStart, i + 1);

    if (windowEntries.length >= MINIMUM_ENTRIES_FOR_SALI) {
      const weights = calculateMetricWeights(windowEntries);
      const previoussALI = sALIEntries[sALIEntries.length - 1];
      const sALI = calculatesALI(entries[i], weights.normalizedWeights, previoussALI);
      sALIEntries.push(sALI);
    }
  }

  return sALIEntries;
}

/**
 * Validate entry data
 *
 * @param entry - Entry to validate
 * @returns Validation result
 */
export function validateEntry(entry: Omit<AllostaticEntry, 'id'>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check all metrics are in valid range (0-10)
  const metrics = [
    'sleepRecovery',
    'physicalLoad',
    'recoveryFromLoad',
    'psychologicalStress',
    'energyLevel',
  ] as const;

  for (const metric of metrics) {
    const value = entry[metric];
    if (typeof value !== 'number' || value < 0 || value > 10) {
      errors.push(`${metric} must be between 0 and 10`);
    }
  }

  // Check dates are valid
  if (!(entry.date instanceof Date) || isNaN(entry.date.getTime())) {
    errors.push('Invalid date');
  }

  if (!(entry.timestamp instanceof Date) || isNaN(entry.timestamp.getTime())) {
    errors.push('Invalid timestamp');
  }

  // Check date is not in future
  if (entry.date > new Date()) {
    errors.push('Date cannot be in the future');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get calculation status for UI
 *
 * @param entryCount - Number of entries
 * @returns Status information
 */
export function getCalculationStatus(entryCount: number): {
  canCalculate: boolean;
  entriesNeeded: number;
  progressPercentage: number;
  message: string;
} {
  const needed = Math.max(0, MINIMUM_ENTRIES_FOR_SALI - entryCount);
  const canCalculate = entryCount >= MINIMUM_ENTRIES_FOR_SALI;
  const progress = Math.min(100, (entryCount / MINIMUM_ENTRIES_FOR_SALI) * 100);

  let message: string;
  if (canCalculate) {
    message = 'Allostasis calculations active';
  } else if (needed === 1) {
    message = '1 more entry needed for calculations';
  } else {
    message = `${needed} more entries needed for calculations`;
  }

  return {
    canCalculate,
    entriesNeeded: needed,
    progressPercentage: progress,
    message,
  };
}

/**
 * Export all calculation functions for direct use
 */
export {
  calculateMetricWeights,
  calculatesALI,
  detectConflictPatterns,
} from './';

// Re-export utilities
export * from './weights';
export * from './sali';
export * from './conflicts';
export * from './spearman';
export * from './ema';
export * from './normalization';
