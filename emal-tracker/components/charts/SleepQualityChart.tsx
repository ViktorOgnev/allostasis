'use client'

import { useMemo } from 'react'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts'
import { format } from 'date-fns'
import type { SleepEntry } from '@/types/sleep'
import { ChartSkeleton } from './ChartSkeleton'

interface SleepQualityChartProps {
  entries: SleepEntry[]
  type?: 'duration' | 'quality' | 'combined'
  isLoading?: boolean
}

export function SleepQualityChart({ entries, type = 'combined', isLoading = false }: SleepQualityChartProps) {
  if (isLoading) {
    return <ChartSkeleton showHeader={false} height={300} />
  }
  const chartData = useMemo(() => {
    // Sort entries by date
    const sortedEntries = [...entries].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    // Take last 14 days
    const recentEntries = sortedEntries.slice(-14)

    return recentEntries.map(entry => ({
      date: format(new Date(entry.date), 'MMM dd'),
      fullDate: new Date(entry.date).toLocaleDateString(),
      duration: Number(entry.duration.toFixed(1)),
      quality: entry.quality,
      mood: entry.mood,
    }))
  }, [entries])

  const averageDuration = useMemo(() => {
    if (chartData.length === 0) return 0
    const total = chartData.reduce((sum, entry) => sum + entry.duration, 0)
    return Number((total / chartData.length).toFixed(1))
  }, [chartData])

  const averageQuality = useMemo(() => {
    if (chartData.length === 0) return 0
    const total = chartData.reduce((sum, entry) => sum + entry.quality, 0)
    return Number((total / chartData.length).toFixed(1))
  }, [chartData])

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-400">
        No sleep data yet. Start logging your sleep to see trends!
      </div>
    )
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-sm mb-1">{data.fullDate}</p>
          <p className="text-sm text-blue-600">
            Duration: {data.duration} hours
          </p>
          <p className="text-sm text-purple-600">
            Quality: {data.quality}/5 ⭐
          </p>
          <p className="text-sm text-gray-600 capitalize">
            Mood: {data.mood}
          </p>
        </div>
      )
    }
    return null
  }

  const getDurationColor = (duration: number) => {
    if (duration < 6) return '#EF4444' // red-500
    if (duration < 7) return '#F59E0B' // amber-500
    if (duration <= 9) return '#10B981' // green-500
    return '#3B82F6' // blue-500
  }

  if (type === 'duration') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center px-4">
          <div>
            <p className="text-sm text-gray-600">Average Duration</p>
            <p className={`text-2xl font-bold ${averageDuration >= 7 && averageDuration <= 9 ? 'text-green-600' : averageDuration >= 6 ? 'text-yellow-600' : 'text-red-600'}`}>
              {averageDuration} hrs
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Recommended</p>
            <p className="text-lg font-semibold text-gray-900">7-9 hrs</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              domain={[0, 12]}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
              label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fill: '#6B7280' } }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Recommended range shading */}
            <ReferenceLine y={7} stroke="#10B981" strokeDasharray="3 3" label={{ value: '7h min', fill: '#10B981', fontSize: 10 }} />
            <ReferenceLine y={9} stroke="#10B981" strokeDasharray="3 3" label={{ value: '9h max', fill: '#10B981', fontSize: 10 }} />

            {/* Average line */}
            <ReferenceLine y={averageDuration} stroke="#6366F1" strokeDasharray="5 5" label={{ value: `Avg: ${averageDuration}h`, fill: '#6366F1', fontSize: 11 }} />

            <Bar
              dataKey="duration"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              shape={(props: any) => {
                const { x, y, width, height, payload } = props
                return (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={getDurationColor(payload.duration)}
                    rx={4}
                  />
                )
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (type === 'quality') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center px-4">
          <div>
            <p className="text-sm text-gray-600">Average Quality</p>
            <p className="text-2xl font-bold text-purple-600">
              {averageQuality}/5 ⭐
            </p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              domain={[1, 5]}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
              label={{ value: 'Quality', angle: -90, position: 'insideLeft', style: { fill: '#6B7280' } }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Average line */}
            <ReferenceLine y={averageQuality} stroke="#9333EA" strokeDasharray="5 5" label={{ value: `Avg: ${averageQuality}`, fill: '#9333EA', fontSize: 11 }} />

            <Line
              type="monotone"
              dataKey="quality"
              stroke="#9333EA"
              strokeWidth={3}
              dot={{ fill: '#9333EA', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Combined view (default)
  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 px-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Average Duration</p>
          <p className={`text-2xl font-bold ${averageDuration >= 7 && averageDuration <= 9 ? 'text-green-600' : averageDuration >= 6 ? 'text-yellow-600' : 'text-red-600'}`}>
            {averageDuration} hrs
          </p>
          <p className="text-xs text-gray-500 mt-1">Target: 7-9 hours</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Average Quality</p>
          <p className="text-2xl font-bold text-purple-600">
            {averageQuality}/5
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {averageQuality >= 4 ? '😊 Great!' : averageQuality >= 3 ? '👍 Good' : '⚠️ Needs work'}
          </p>
        </div>
      </div>

      {/* Duration Chart */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2 px-4">Sleep Duration (Last 14 Days)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              domain={[0, 12]}
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Recommended range */}
            <ReferenceLine y={7} stroke="#10B981" strokeDasharray="3 3" strokeOpacity={0.5} />
            <ReferenceLine y={9} stroke="#10B981" strokeDasharray="3 3" strokeOpacity={0.5} />

            <Area
              type="monotone"
              dataKey="duration"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#colorDuration)"
            />
            <Line
              type="monotone"
              dataKey="duration"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Quality Chart */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2 px-4">Sleep Quality Rating</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333EA" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#9333EA" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              domain={[0, 5]}
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="quality"
              stroke="#9333EA"
              strokeWidth={2}
              fill="url(#colorQuality)"
            />
            <Line
              type="monotone"
              dataKey="quality"
              stroke="#9333EA"
              strokeWidth={2}
              dot={{ fill: '#9333EA', r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
