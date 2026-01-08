"use client"

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { WeightState } from '@/types/allostasis'
import { getMetricDisplayName } from '@/lib/allostasis/weights'

interface WeightBreakdownChartProps {
  weights: WeightState
}

/**
 * Weight Breakdown Chart
 * Shows normalized weights for each metric
 */
export function WeightBreakdownChart({ weights }: WeightBreakdownChartProps) {
  const chartData = useMemo(() => {
    return [
      {
        metric: 'Sleep',
        weight: weights.normalizedWeights.sleepRecovery,
        fullName: 'Sleep Recovery',
        color: '#A855F7',
      },
      {
        metric: 'Load',
        weight: weights.normalizedWeights.physicalLoad,
        fullName: 'Physical Load',
        color: '#10B981',
      },
      {
        metric: 'Recovery',
        weight: weights.normalizedWeights.recoveryFromLoad,
        fullName: 'Recovery from Load',
        color: '#06B6D4',
      },
      {
        metric: 'Stress',
        weight: weights.normalizedWeights.psychologicalStress,
        fullName: 'Psychological Stress',
        color: '#F97316',
      },
      {
        metric: 'Energy',
        weight: weights.normalizedWeights.energyLevel,
        fullName: 'Energy Level',
        color: '#3B82F6',
      },
    ]
  }, [weights])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          type="category"
          dataKey="metric"
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
        />
        <YAxis
          type="number"
          domain={[0, 'auto']}
          label={{ value: 'Weight', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6B7280' } }}
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
          tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
        />
        <Tooltip content={<CustomTooltip weights={weights} />} />
        <Bar dataKey="weight" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/**
 * Custom tooltip showing weight breakdown
 */
function CustomTooltip({ active, payload, weights }: any) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const data = payload[0].payload
  const metricKey = data.fullName.toLowerCase().replace(/ /g, '')
    .replace('sleeprecovery', 'sleepRecovery')
    .replace('physicalload', 'physicalLoad')
    .replace('recoveryfromload', 'recoveryFromLoad')
    .replace('psychologicalstress', 'psychologicalStress')
    .replace('energylevel', 'energyLevel')

  const metricWeights = weights.weights[metricKey as keyof typeof weights.weights]

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 min-w-[250px]">
      <p className="font-semibold text-gray-900 mb-3" style={{ color: data.color }}>
        {data.fullName}
      </p>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Weight:</span>
          <span className="font-bold" style={{ color: data.color }}>
            {(data.weight * 100).toFixed(1)}%
          </span>
        </div>

        <div className="border-t border-gray-200 pt-2 space-y-1">
          <p className="text-xs font-semibold text-gray-700 mb-1">Components:</p>

          <div className="flex justify-between">
            <span className="text-gray-600 text-xs">Impact (ρ):</span>
            <span className="font-semibold text-xs">
              {metricWeights.impactWeight.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 text-xs">Volatility (σ):</span>
            <span className="font-semibold text-xs">
              {metricWeights.volatilityWeight.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 text-xs">Imbalance:</span>
            <span className="font-semibold text-xs">
              {metricWeights.imbalanceWeight.toFixed(2)}
            </span>
          </div>
        </div>

        {metricWeights.spearmanRho !== undefined && (
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between">
              <span className="text-gray-600 text-xs">Correlation w/ Energy:</span>
              <span className="font-semibold text-xs">
                {metricWeights.spearmanRho.toFixed(3)}
              </span>
            </div>
          </div>
        )}

        {metricWeights.activeConflicts.length > 0 && (
          <div className="border-t border-gray-200 pt-2">
            <p className="text-xs text-orange-600 font-semibold">
              ⚠️ {metricWeights.activeConflicts.length} active conflict(s)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
