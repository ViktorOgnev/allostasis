"use client"

import { useMemo } from 'react'
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import type { sALIEntry } from '@/types/allostasis'
import { getsALIColor, getsALILevel } from '@/lib/allostasis/sali'

interface sALITrendChartProps {
  data: sALIEntry[]
}

/**
 * sALI Trend Chart
 * Shows raw sALI with EMA(7) and EMA(28) smoothing
 * Lower values = better (less allostatic load)
 */
export function sALITrendChart({ data }: sALITrendChartProps) {
  const chartData = useMemo(() => {
    return data.map(entry => ({
      date: format(entry.date, 'MMM dd'),
      rawSALI: entry.rawSALI,
      ema7: entry.sALI_EMA7,
      ema28: entry.sALI_EMA28,
      fullDate: entry.date,
    }))
  }, [data])

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available yet. Add more check-ins to see trends.</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="saliGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8} />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#10B981" stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
        />
        <YAxis
          domain={[0, 1]}
          label={{ value: 'sALI Score (lower = better)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6B7280' } }}
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 14 }}
          iconType="line"
        />
        <Area
          type="monotone"
          dataKey="rawSALI"
          stroke="#94A3B8"
          fill="url(#saliGradient)"
          name="Raw sALI"
          strokeWidth={1}
          fillOpacity={0.6}
        />
        <Line
          type="monotone"
          dataKey="ema7"
          stroke="#3B82F6"
          strokeWidth={3}
          name="7-day trend"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="ema28"
          stroke="#8B5CF6"
          strokeWidth={3}
          name="28-day trend"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

/**
 * Custom tooltip for sALI chart
 */
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const data = payload[0].payload
  const rawSALI = data.rawSALI
  const level = getsALILevel(rawSALI)
  const color = getsALIColor(rawSALI)

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <p className="font-semibold text-gray-900 mb-2">{data.date}</p>

      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          <span className="text-gray-600">Raw sALI:</span>
          <span className="font-semibold" style={{ color }}>
            {data.rawSALI.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-gray-600">7-day trend:</span>
          <span className="font-semibold text-blue-600">
            {data.ema7.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-gray-600">28-day trend:</span>
          <span className="font-semibold text-purple-600">
            {data.ema28.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-200">
        <p className="text-xs" style={{ color }}>
          <strong>Level:</strong> {level.charAt(0).toUpperCase() + level.slice(1)}
        </p>
      </div>
    </div>
  )
}
