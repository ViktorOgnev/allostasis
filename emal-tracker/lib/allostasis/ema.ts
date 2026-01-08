/**
 * Exponential Moving Average (EMA) Utilities
 *
 * EMA gives more weight to recent values while smoothing out noise.
 *
 * Formula: EMA_t = α × Value_t + (1 - α) × EMA_(t-1)
 *
 * Where α (alpha) = smoothing factor = 2 / (N + 1)
 * - N = period (e.g., 7 for 7-day EMA, 28 for 28-day EMA)
 * - Higher α = more reactive to recent changes
 * - Lower α = smoother, slower to respond
 *
 * Common periods:
 * - EMA(7): Short-term trend, α ≈ 0.25
 * - EMA(28): Long-term trend, α ≈ 0.069
 */

/**
 * Calculate EMA for a new value
 *
 * @param currentValue - New value to incorporate
 * @param previousEMA - Previous EMA value
 * @param alpha - Smoothing factor (0-1)
 * @returns Updated EMA value
 */
export function calculateEMA(
  currentValue: number,
  previousEMA: number,
  alpha: number
): number {
  if (alpha < 0 || alpha > 1) {
    throw new Error('Alpha must be between 0 and 1');
  }

  return alpha * currentValue + (1 - alpha) * previousEMA;
}

/**
 * Calculate alpha (smoothing factor) from period
 *
 * @param period - Number of periods (e.g., 7, 28)
 * @returns Alpha smoothing factor
 */
export function calculateAlpha(period: number): number {
  if (period <= 0) {
    throw new Error('Period must be positive');
  }

  return 2 / (period + 1);
}

/**
 * Initialize EMA from a series of values
 *
 * First value becomes initial EMA, then subsequent values are incorporated
 *
 * @param values - Array of values
 * @param alpha - Smoothing factor
 * @returns Final EMA value
 */
export function initializeEMA(values: number[], alpha: number): number {
  if (values.length === 0) {
    throw new Error('Cannot initialize EMA with empty array');
  }

  // Start with first value
  let ema = values[0];

  // Incorporate subsequent values
  for (let i = 1; i < values.length; i++) {
    ema = calculateEMA(values[i], ema, alpha);
  }

  return ema;
}

/**
 * Calculate EMA series for an array of values
 *
 * @param values - Array of values
 * @param alpha - Smoothing factor
 * @returns Array of EMA values (same length as input)
 */
export function calculateEMASeries(values: number[], alpha: number): number[] {
  if (values.length === 0) {
    return [];
  }

  const emas: number[] = [];
  emas[0] = values[0]; // First value = initial EMA

  for (let i = 1; i < values.length; i++) {
    emas[i] = calculateEMA(values[i], emas[i - 1], alpha);
  }

  return emas;
}

/**
 * Calculate multiple EMAs (short and long term) for a series
 *
 * @param values - Array of values
 * @param shortPeriod - Short-term period (e.g., 7)
 * @param longPeriod - Long-term period (e.g., 28)
 * @returns Object with short and long EMA series
 */
export function calculateDualEMA(
  values: number[],
  shortPeriod: number = 7,
  longPeriod: number = 28
): {
  short: number[];
  long: number[];
  crossovers: Array<{ index: number; type: 'bullish' | 'bearish' }>;
} {
  const alphaShort = calculateAlpha(shortPeriod);
  const alphaLong = calculateAlpha(longPeriod);

  const shortEMA = calculateEMASeries(values, alphaShort);
  const longEMA = calculateEMASeries(values, alphaLong);

  // Detect crossovers (where short crosses long)
  const crossovers: Array<{ index: number; type: 'bullish' | 'bearish' }> = [];

  for (let i = 1; i < values.length; i++) {
    const prevShort = shortEMA[i - 1];
    const prevLong = longEMA[i - 1];
    const currShort = shortEMA[i];
    const currLong = longEMA[i];

    // Bullish crossover: short crosses above long (improving trend)
    if (prevShort <= prevLong && currShort > currLong) {
      crossovers.push({ index: i, type: 'bullish' });
    }

    // Bearish crossover: short crosses below long (worsening trend)
    if (prevShort >= prevLong && currShort < currLong) {
      crossovers.push({ index: i, type: 'bearish' });
    }
  }

  return {
    short: shortEMA,
    long: longEMA,
    crossovers,
  };
}

/**
 * Calculate EMA convergence/divergence
 *
 * @param shortEMA - Short-term EMA
 * @param longEMA - Long-term EMA
 * @returns Convergence value (positive = diverging upward, negative = diverging downward)
 */
export function calculateEMAConvergence(shortEMA: number, longEMA: number): number {
  return shortEMA - longEMA;
}

/**
 * Determine trend direction from EMAs
 *
 * @param currentEMA - Current EMA value
 * @param previousEMA - Previous EMA value
 * @param threshold - Minimum change to consider significant (default 0.02)
 * @returns Trend direction
 */
export function determineTrend(
  currentEMA: number,
  previousEMA: number,
  threshold: number = 0.02
): 'up' | 'down' | 'flat' {
  const change = currentEMA - previousEMA;

  if (Math.abs(change) < threshold) {
    return 'flat';
  }

  return change > 0 ? 'up' : 'down';
}

/**
 * Calculate rate of change in EMA
 *
 * @param currentEMA - Current EMA value
 * @param previousEMA - Previous EMA value
 * @returns Rate of change (percentage)
 */
export function calculateEMARate(currentEMA: number, previousEMA: number): number {
  if (previousEMA === 0) {
    return 0;
  }

  return ((currentEMA - previousEMA) / previousEMA) * 100;
}

/**
 * Smooth a time series using EMA
 * Useful for noisy data
 *
 * @param timeSeries - Array of [timestamp, value] pairs
 * @param period - EMA period
 * @returns Smoothed time series
 */
export function smoothTimeSeries(
  timeSeries: Array<{ date: Date; value: number }>,
  period: number = 7
): Array<{ date: Date; value: number; ema: number }> {
  if (timeSeries.length === 0) {
    return [];
  }

  const alpha = calculateAlpha(period);
  const values = timeSeries.map(d => d.value);
  const emas = calculateEMASeries(values, alpha);

  return timeSeries.map((d, i) => ({
    date: d.date,
    value: d.value,
    ema: emas[i],
  }));
}

/**
 * Predict next EMA value based on trend
 * Simple extrapolation - use with caution!
 *
 * @param recentEMAs - Array of recent EMA values (at least 2)
 * @returns Predicted next EMA value
 */
export function predictNextEMA(recentEMAs: number[]): number | null {
  if (recentEMAs.length < 2) {
    return null;
  }

  // Use linear extrapolation from last two values
  const last = recentEMAs[recentEMAs.length - 1];
  const secondLast = recentEMAs[recentEMAs.length - 2];

  const change = last - secondLast;

  return last + change;
}

/**
 * Calculate weighted moving average (alternative to EMA)
 *
 * @param values - Array of values
 * @param weights - Array of weights (must sum to 1.0)
 * @returns Weighted average
 */
export function calculateWeightedMA(values: number[], weights: number[]): number {
  if (values.length !== weights.length) {
    throw new Error('Values and weights must have same length');
  }

  const sum = weights.reduce((s, w) => s + w, 0);
  if (Math.abs(sum - 1.0) > 0.001) {
    throw new Error('Weights must sum to 1.0');
  }

  return values.reduce((acc, val, i) => acc + val * weights[i], 0);
}

/**
 * Calculate simple moving average (SMA) for comparison
 *
 * @param values - Array of values
 * @param period - Period for average
 * @returns SMA value
 */
export function calculateSMA(values: number[], period?: number): number {
  if (values.length === 0) {
    return 0;
  }

  const n = period && period < values.length ? period : values.length;
  const slice = values.slice(-n);

  return slice.reduce((sum, v) => sum + v, 0) / n;
}
