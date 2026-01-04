'use client'

import { useMemo } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts'
import { format, startOfWeek, endOfWeek, eachWeekOfInterval, subWeeks, isWithinInterval } from 'date-fns'
import type { ExerciseEntry } from '@/types/exercise'

interface ExerciseSummaryChartProps {
  entries: ExerciseEntry[]
  type?: 'weekly' | 'types' | 'energy' | 'all'
}

const EXERCISE_COLORS = {
  cardio: '#EF4444',      // red
  strength: '#F59E0B',    // amber
  flexibility: '#10B981', // green
  walking: '#3B82F6',     // blue
  sports: '#8B5CF6',      // purple
  other: '#6B7280',       // gray
}

const INTENSITY_COLORS = {
  low: '#10B981',       // green
  moderate: '#F59E0B',  // amber
  high: '#EF4444',      // red
  vigorous: '#DC2626',  // dark red
}

export function ExerciseSummaryChart({ entries, type = 'all' }: ExerciseSummaryChartProps) {
  // Calculate weekly totals for the last 8 weeks
  const weeklyData = useMemo(() => {
    const now = new Date()
    const weeks = eachWeekOfInterval({
      start: subWeeks(now, 7),
      end: now
    })

    return weeks.map(weekStart => {
      const weekEnd = endOfWeek(weekStart)
      const weekEntries = entries.filter(entry => {
        const entryDate = new Date(entry.date)
        return isWithinInterval(entryDate, { start: weekStart, end: weekEnd })
      })

      const totalMinutes = weekEntries.reduce((sum, e) => sum + e.duration, 0)
      const moderateMinutes = weekEntries
        .filter(e => e.intensity === 'low' || e.intensity === 'moderate')
        .reduce((sum, e) => sum + e.duration, 0)
      const vigorousMinutes = weekEntries
        .filter(e => e.intensity === 'high' || e.intensity === 'vigorous')
        .reduce((sum, e) => sum + e.duration, 0)

      return {
        week: format(weekStart, 'MMM dd'),
        totalMinutes,
        moderateMinutes,
        vigorousMinutes,
      }
    })
  }, [entries])

  // Calculate exercise type breakdown
  const typeData = useMemo(() => {
    const typeCounts: Record<string, { minutes: number; count: number }> = {}

    entries.forEach(entry => {
      if (!typeCounts[entry.type]) {
        typeCounts[entry.type] = { minutes: 0, count: 0 }
      }
      typeCounts[entry.type].minutes += entry.duration
      typeCounts[entry.type].count += 1
    })

    return Object.entries(typeCounts).map(([type, data]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      minutes: data.minutes,
      count: data.count,
      color: EXERCISE_COLORS[type as keyof typeof EXERCISE_COLORS] || '#6B7280',
    }))
  }, [entries])

  // Calculate energy impact
  const energyImpact = useMemo(() => {
    return entries
      .filter(e => e.energyBefore !== undefined && e.energyAfter !== undefined)
      .map(e => ({
        date: format(new Date(e.date), 'MMM dd'),
        before: e.energyBefore!,
        after: e.energyAfter!,
        change: e.energyAfter! - e.energyBefore!,
        type: e.type,
      }))
      .slice(-14) // Last 14 entries
  }, [entries])

  const totalMinutesThisWeek = weeklyData[weeklyData.length - 1]?.totalMinutes || 0
  const whoGoalModerate = 300
  const whoGoalVigorous = 150

  if (entries.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-400">
        No exercise data yet. Start logging your workouts to see trends!
      </div>
    )
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: item.color }}>
              {item.name}: {item.value} min
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Weekly Minutes Chart
  if (type === 'weekly') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center px-4">
          <div>
            <p className="text-sm text-gray-600">This Week</p>
            <p className={`text-2xl font-bold ${totalMinutesThisWeek >= whoGoalModerate ? 'text-green-600' : totalMinutesThisWeek >= whoGoalModerate * 0.7 ? 'text-yellow-600' : 'text-red-600'}`}>
              {totalMinutesThisWeek} min
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">WHO Goal</p>
            <p className="text-lg font-semibold text-gray-900">300+ min</p>
            <p className="text-xs text-gray-500">or 150+ vigorous</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="week"
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
              label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { fill: '#6B7280' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={whoGoalModerate} stroke="#10B981" strokeDasharray="3 3" label={{ value: '300 min', fill: '#10B981', fontSize: 10 }} />
            <Bar dataKey="totalMinutes" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="px-4 text-xs text-gray-600">
          <p>
            {totalMinutesThisWeek >= whoGoalModerate
              ? '🎉 Great job! You met the WHO recommendation'
              : `📊 ${whoGoalModerate - totalMinutesThisWeek} more minutes to reach weekly goal`}
          </p>
        </div>
      </div>
    )
  }

  // Exercise Types Chart
  if (type === 'types') {
    return (
      <div className="space-y-4">
        <div className="px-4">
          <p className="text-sm text-gray-600 mb-2">Exercise Distribution</p>
        </div>

        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeData}
                dataKey="minutes"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ type, minutes }) => `${type}: ${minutes}m`}
                labelLine={true}
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-2 px-4">
          {typeData.map(item => (
            <div key={item.type} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-700">
                {item.type}: {item.minutes} min ({item.count}x)
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Energy Impact Chart
  if (type === 'energy') {
    if (energyImpact.length === 0) {
      return (
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          Log energy levels before and after exercise to see impact
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="px-4">
          <p className="text-sm text-gray-600 mb-2">Energy Before vs After Exercise</p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={energyImpact}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              domain={[1, 10]}
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip
              content={({ active, payload }: any) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-white p-3 rounded-lg shadow-lg border">
                      <p className="font-medium text-sm mb-1">{data.date}</p>
                      <p className="text-sm text-orange-600">Before: {data.before}/10</p>
                      <p className="text-sm text-green-600">After: {data.after}/10</p>
                      <p className="text-sm text-blue-600">
                        Change: {data.change > 0 ? '+' : ''}{data.change}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type="monotone"
              dataKey="before"
              stroke="#F59E0B"
              strokeWidth={2}
              name="Before"
              dot={{ fill: '#F59E0B', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="after"
              stroke="#10B981"
              strokeWidth={2}
              name="After"
              dot={{ fill: '#10B981', r: 4 }}
            />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // All charts combined (default)
  return (
    <div className="space-y-8">
      {/* Weekly Progress */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4 px-4">Weekly Exercise Minutes</h3>
        <div className="flex justify-between items-center px-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">This Week</p>
            <p className={`text-2xl font-bold ${totalMinutesThisWeek >= whoGoalModerate ? 'text-green-600' : totalMinutesThisWeek >= whoGoalModerate * 0.7 ? 'text-yellow-600' : 'text-red-600'}`}>
              {totalMinutesThisWeek} min
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Progress</p>
            <p className="text-lg font-semibold text-blue-600">
              {Math.round((totalMinutesThisWeek / whoGoalModerate) * 100)}%
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="week"
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={whoGoalModerate} stroke="#10B981" strokeDasharray="3 3" strokeOpacity={0.5} />
            <Bar dataKey="totalMinutes" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Exercise Types */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4 px-4">Exercise Type Distribution</h3>
        <div className="grid grid-cols-2 gap-4">
          {typeData.map(item => (
            <div key={item.type} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium">{item.type}</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{item.minutes} min</p>
              <p className="text-xs text-gray-600">{item.count} session{item.count > 1 ? 's' : ''}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
