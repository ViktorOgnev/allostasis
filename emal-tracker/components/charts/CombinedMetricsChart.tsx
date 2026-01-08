"use client"

import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import type { AllostaticEntry } from '@/types/allostasis'

interface CombinedMetricsChartProps {
  data: AllostaticEntry[]
}

/**
 * Combined Metrics Chart
 * Shows all 5 metrics on one chart for pattern identification
 */
export function CombinedMetricsChart({ data }: CombinedMetricsChartProps) {
  const chartData = useMemo(() => {
    return data.map(entry => ({
      date: format(entry.date, 'MMM dd'),
      sleep: entry.sleepRecovery,
      load: entry.physicalLoad,
      recovery: entry.recoveryFromLoad,
      stress: entry.psychologicalStress,
      energy: entry.energyLevel,
      fullDate: entry.date,
    }))
  }, [data])

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available yet. Add more check-ins to see metrics.</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
        />
        <YAxis
          domain={[0, 10]}
          label={{ value: 'Level (0-10)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6B7280' } }}
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 14 }}
          iconType="line"
        />
        <Line
          type="monotone"
          dataKey="sleep"
          stroke="#A855F7"
          strokeWidth={2}
          name="Sleep Recovery"
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="load"
          stroke="#10B981"
          strokeWidth={2}
          name="Physical Load"
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="recovery"
          stroke="#06B6D4"
          strokeWidth={2}
          name="Recovery from Load"
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="stress"
          stroke="#F97316"
          strokeWidth={2}
          name="Psychological Stress"
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="energy"
          stroke="#3B82F6"
          strokeWidth={3}
          name="Energy (Anchor)"
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

/**
 * Custom tooltip for combined metrics
 */
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const data = payload[0].payload

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <p className="font-semibold text-gray-900 mb-3">{data.date}</p>

      <div className="space-y-2 text-sm">
        <MetricRow
          label="Sleep Recovery"
          value={data.sleep}
          color="#A855F7"
          emoji="💤"
        />
        <MetricRow
          label="Physical Load"
          value={data.load}
          color="#10B981"
          emoji="🏃"
        />
        <MetricRow
          label="Recovery from Load"
          value={data.recovery}
          color="#06B6D4"
          emoji="💪"
        />
        <MetricRow
          label="Psychological Stress"
          value={data.stress}
          color="#F97316"
          emoji="😰"
        />
        <div className="pt-2 border-t border-gray-200">
          <MetricRow
            label="Energy (Anchor)"
            value={data.energy}
            color="#3B82F6"
            emoji="⚡"
            bold
          />
        </div>
      </div>
    </div>
  )
}

function MetricRow({
  label,
  value,
  color,
  emoji,
  bold = false
}: {
  label: string
  value: number
  color: string
  emoji: string
  bold?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span>{emoji}</span>
        <span className={`text-gray-600 ${bold ? 'font-semibold' : ''}`}>
          {label}:
        </span>
      </div>
      <span
        className={`${bold ? 'font-bold text-base' : 'font-semibold'}`}
        style={{ color }}
      >
        {value}/10
      </span>
    </div>
  )
}
