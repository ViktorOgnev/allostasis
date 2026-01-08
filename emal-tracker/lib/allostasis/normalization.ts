/**
 * Normalization and Data Transformation Utilities
 *
 * Helpers for data preprocessing and normalization used across the allostasis system.
 */

/**
 * Normalize value to 0-1 range
 *
 * @param value - Value to normalize
 * @param min - Minimum value in range
 * @param max - Maximum value in range
 * @returns Normalized value (0-1)
 */
export function normalizeToRange(value: number, min: number, max: number): number {
  if (max === min) {
    return 0.5; // Avoid division by zero
  }

  const normalized = (value - min) / (max - min);

  // Clamp to 0-1
  return Math.max(0, Math.min(1, normalized));
}

/**
 * Denormalize value from 0-1 range back to original scale
 *
 * @param normalized - Normalized value (0-1)
 * @param min - Minimum value in original range
 * @param max - Maximum value in original range
 * @returns Original scale value
 */
export function denormalizeFromRange(normalized: number, min: number, max: number): number {
  return normalized * (max - min) + min;
}

/**
 * Z-score normalization (standardization)
 *
 * @param value - Value to normalize
 * @param mean - Mean of distribution
 * @param stdDev - Standard deviation of distribution
 * @returns Z-score
 */
export function zScore(value: number, mean: number, stdDev: number): number {
  if (stdDev === 0) {
    return 0;
  }

  return (value - mean) / stdDev;
}

/**
 * Clamp value to range
 *
 * @param value - Value to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between two values
 *
 * @param start - Start value
 * @param end - End value
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated value
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * clamp(t, 0, 1);
}

/**
 * Inverse linear interpolation
 * Find where value sits between start and end
 *
 * @param value - Value to find position of
 * @param start - Start value
 * @param end - End value
 * @returns Position (0-1)
 */
export function inverseLerp(value: number, start: number, end: number): number {
  if (start === end) {
    return 0.5;
  }

  return clamp((value - start) / (end - start), 0, 1);
}

/**
 * Remap value from one range to another
 *
 * @param value - Value to remap
 * @param inMin - Input range minimum
 * @param inMax - Input range maximum
 * @param outMin - Output range minimum
 * @param outMax - Output range maximum
 * @returns Remapped value
 */
export function remap(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  const t = inverseLerp(value, inMin, inMax);
  return lerp(outMin, outMax, t);
}

/**
 * Round to specified decimal places
 *
 * @param value - Value to round
 * @param decimals - Number of decimal places
 * @returns Rounded value
 */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Calculate percentile rank of value in dataset
 *
 * @param value - Value to find percentile for
 * @param dataset - Array of values
 * @returns Percentile (0-100)
 */
export function percentileRank(value: number, dataset: number[]): number {
  if (dataset.length === 0) {
    return 50;
  }

  const belowCount = dataset.filter(v => v < value).length;
  const equalCount = dataset.filter(v => v === value).length;

  // Average rank method for ties
  const rank = belowCount + equalCount / 2;

  return (rank / dataset.length) * 100;
}

/**
 * Find value at given percentile
 *
 * @param dataset - Array of values (will be sorted)
 * @param percentile - Percentile to find (0-100)
 * @returns Value at percentile
 */
export function valueAtPercentile(dataset: number[], percentile: number): number {
  if (dataset.length === 0) {
    return 0;
  }

  const sorted = [...dataset].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);

  // Linear interpolation between adjacent values
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const fraction = index - lower;

  if (lower === upper) {
    return sorted[lower];
  }

  return lerp(sorted[lower], sorted[upper], fraction);
}

/**
 * Smooth outliers using median absolute deviation (MAD)
 *
 * @param values - Array of values
 * @param threshold - MAD threshold (default 3)
 * @returns Array with outliers clamped to threshold
 */
export function smoothOutliers(values: number[], threshold: number = 3): number[] {
  if (values.length === 0) {
    return [];
  }

  // Calculate median
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  // Calculate MAD
  const deviations = values.map(v => Math.abs(v - median));
  const mad = deviations.sort((a, b) => a - b)[Math.floor(deviations.length / 2)];

  if (mad === 0) {
    return values; // No variation
  }

  // Clamp outliers
  return values.map(v => {
    const zScore = Math.abs(v - median) / mad;
    if (zScore > threshold) {
      // Clamp to threshold
      return v > median
        ? median + threshold * mad
        : median - threshold * mad;
    }
    return v;
  });
}

/**
 * Calculate moving average
 *
 * @param values - Array of values
 * @param windowSize - Size of moving window
 * @returns Array of moving averages
 */
export function movingAverage(values: number[], windowSize: number): number[] {
  if (values.length < windowSize) {
    return values.map(_ => values.reduce((a, b) => a + b, 0) / values.length);
  }

  const result: number[] = [];

  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const window = values.slice(start, i + 1);
    const avg = window.reduce((sum, v) => sum + v, 0) / window.length;
    result.push(avg);
  }

  return result;
}

/**
 * Detect and handle missing values in time series
 *
 * @param values - Array with potential null/undefined values
 * @param method - Interpolation method ('forward', 'backward', 'linear', 'mean')
 * @returns Array with filled values
 */
export function fillMissingValues(
  values: Array<number | null | undefined>,
  method: 'forward' | 'backward' | 'linear' | 'mean' = 'linear'
): number[] {
  if (values.length === 0) {
    return [];
  }

  const result: number[] = [];

  if (method === 'mean') {
    const validValues = values.filter((v): v is number => v != null);
    const mean = validValues.reduce((sum, v) => sum + v, 0) / validValues.length;

    return values.map(v => v ?? mean);
  }

  if (method === 'forward') {
    let lastValid = values.find((v): v is number => v != null) ?? 0;

    for (const value of values) {
      if (value != null) {
        lastValid = value;
      }
      result.push(lastValid);
    }

    return result;
  }

  if (method === 'backward') {
    let nextValid = [...values].reverse().find((v): v is number => v != null) ?? 0;

    for (let i = values.length - 1; i >= 0; i--) {
      if (values[i] != null) {
        nextValid = values[i] as number;
      }
      result.unshift(nextValid);
    }

    return result;
  }

  // Linear interpolation
  for (let i = 0; i < values.length; i++) {
    if (values[i] != null) {
      result.push(values[i] as number);
    } else {
      // Find previous and next valid values
      let prevIndex = i - 1;
      while (prevIndex >= 0 && values[prevIndex] == null) {
        prevIndex--;
      }

      let nextIndex = i + 1;
      while (nextIndex < values.length && values[nextIndex] == null) {
        nextIndex++;
      }

      if (prevIndex >= 0 && nextIndex < values.length) {
        // Interpolate
        const prevValue = values[prevIndex] as number;
        const nextValue = values[nextIndex] as number;
        const steps = nextIndex - prevIndex;
        const position = i - prevIndex;
        const interpolated = lerp(prevValue, nextValue, position / steps);
        result.push(interpolated);
      } else if (prevIndex >= 0) {
        // Use forward fill
        result.push(values[prevIndex] as number);
      } else if (nextIndex < values.length) {
        // Use backward fill
        result.push(values[nextIndex] as number);
      } else {
        // No valid values at all
        result.push(0);
      }
    }
  }

  return result;
}

/**
 * Logarithmic scaling (useful for skewed distributions)
 *
 * @param value - Value to scale
 * @param base - Logarithm base (default e)
 * @returns Logarithmically scaled value
 */
export function logScale(value: number, base: number = Math.E): number {
  if (value <= 0) {
    return 0;
  }

  return Math.log(value) / Math.log(base);
}

/**
 * Inverse logarithmic scaling
 *
 * @param scaled - Scaled value
 * @param base - Logarithm base
 * @returns Original value
 */
export function invLogScale(scaled: number, base: number = Math.E): number {
  return Math.pow(base, scaled);
}

/**
 * Sigmoid function (S-curve) for normalization
 * Maps any value to 0-1 range with smooth transition
 *
 * @param value - Value to transform
 * @param midpoint - Midpoint of sigmoid (value that maps to 0.5)
 * @param steepness - Steepness of curve (higher = sharper transition)
 * @returns Sigmoid-transformed value (0-1)
 */
export function sigmoid(value: number, midpoint: number = 0, steepness: number = 1): number {
  return 1 / (1 + Math.exp(-steepness * (value - midpoint)));
}
