/**
 * Spearman Rank Correlation Coefficient
 *
 * Measures the strength and direction of monotonic relationship between two variables.
 * Returns a value between -1 and 1:
 *   1 = perfect positive correlation
 *   0 = no correlation
 *  -1 = perfect negative correlation
 *
 * Used to calculate Impact Weight (w_i) in the adaptive weight algorithm.
 */

/**
 * Calculate ranks for an array of values
 * Handles tied values by assigning average ranks
 *
 * @param values - Array of numeric values to rank
 * @returns Array of ranks (1-indexed)
 */
function rankArray(values: number[]): number[] {
  // Create array of [value, originalIndex] pairs
  const indexed = values.map((value, index) => ({ value, index }));

  // Sort by value
  indexed.sort((a, b) => a.value - b.value);

  // Assign ranks, handling ties
  const ranks = new Array(values.length);
  let i = 0;

  while (i < indexed.length) {
    // Find all values equal to current value (ties)
    let j = i;
    while (j < indexed.length && indexed[j].value === indexed[i].value) {
      j++;
    }

    // Calculate average rank for tied values
    // Ranks are 1-indexed: (i+1) to j
    const averageRank = ((i + 1) + j) / 2;

    // Assign average rank to all tied values
    for (let k = i; k < j; k++) {
      ranks[indexed[k].index] = averageRank;
    }

    i = j;
  }

  return ranks;
}

/**
 * Calculate Spearman's Rank Correlation Coefficient
 *
 * Formula: ρ = 1 - (6 * Σd²) / (n * (n² - 1))
 * where d = difference between ranks
 *
 * @param x - First variable (e.g., metric values)
 * @param y - Second variable (e.g., energy values)
 * @returns Spearman's rho coefficient (-1 to 1)
 *
 * @throws Error if arrays are empty or have different lengths
 */
export function calculateSpearmanCorrelation(
  x: number[],
  y: number[]
): number {
  // Validation
  if (x.length === 0 || y.length === 0) {
    throw new Error('Cannot calculate Spearman correlation on empty arrays');
  }

  if (x.length !== y.length) {
    throw new Error('Arrays must have the same length for correlation calculation');
  }

  const n = x.length;

  // Edge case: single data point (correlation undefined)
  if (n === 1) {
    return 0;
  }

  // Edge case: all values identical in either array (no variation)
  const xUnique = new Set(x).size;
  const yUnique = new Set(y).size;

  if (xUnique === 1 || yUnique === 1) {
    return 0; // No correlation possible without variation
  }

  // Convert values to ranks
  const xRanks = rankArray(x);
  const yRanks = rankArray(y);

  // Calculate sum of squared differences
  let sumDSquared = 0;
  for (let i = 0; i < n; i++) {
    const d = xRanks[i] - yRanks[i];
    sumDSquared += d * d;
  }

  // Spearman's formula
  const rho = 1 - (6 * sumDSquared) / (n * (n * n - 1));

  return rho;
}

/**
 * Calculate Pearson correlation coefficient (product-moment correlation)
 * Alternative to Spearman for linear relationships
 *
 * @param x - First variable
 * @param y - Second variable
 * @returns Pearson's r coefficient (-1 to 1)
 */
export function calculatePearsonCorrelation(
  x: number[],
  y: number[]
): number {
  if (x.length === 0 || y.length === 0) {
    throw new Error('Cannot calculate Pearson correlation on empty arrays');
  }

  if (x.length !== y.length) {
    throw new Error('Arrays must have the same length for correlation calculation');
  }

  const n = x.length;

  if (n === 1) {
    return 0;
  }

  // Calculate means
  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;

  // Calculate covariance and standard deviations
  let covariance = 0;
  let varianceX = 0;
  let varianceY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;

    covariance += dx * dy;
    varianceX += dx * dx;
    varianceY += dy * dy;
  }

  // Avoid division by zero
  if (varianceX === 0 || varianceY === 0) {
    return 0;
  }

  const r = covariance / Math.sqrt(varianceX * varianceY);

  return r;
}

/**
 * Calculate correlation with statistical significance (p-value)
 * Uses t-distribution approximation
 *
 * @param rho - Correlation coefficient
 * @param n - Sample size
 * @returns Approximate p-value
 */
export function calculatePValue(rho: number, n: number): number {
  if (n < 3) {
    return 1; // Not enough data for significance testing
  }

  // t-statistic for correlation
  const t = rho * Math.sqrt((n - 2) / (1 - rho * rho));

  // Approximate p-value using normal distribution (conservative)
  // For more accuracy, use a proper t-distribution library
  const z = Math.abs(t);
  const pValue = 2 * (1 - normalCDF(z));

  return pValue;
}

/**
 * Standard normal cumulative distribution function
 * Approximation using error function
 */
function normalCDF(z: number): number {
  return 0.5 * (1 + erf(z / Math.sqrt(2)));
}

/**
 * Error function approximation
 * Abramowitz and Stegun formula
 */
function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

/**
 * Helper to calculate standard deviation
 * Used in volatility weight calculation
 *
 * @param values - Array of numeric values
 * @returns Standard deviation
 */
export function calculateStdDev(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  if (values.length === 1) {
    return 0;
  }

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => {
    const diff = val - mean;
    return sum + diff * diff;
  }, 0) / values.length;

  return Math.sqrt(variance);
}

/**
 * Helper to calculate mean
 *
 * @param values - Array of numeric values
 * @returns Arithmetic mean
 */
export function calculateMean(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, val) => sum + val, 0) / values.length;
}
