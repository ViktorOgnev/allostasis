"use client"

import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { format } from 'date-fns'
import { colors } from '@/app/design-tokens/colors'
import type { StressLevelEntry } from '@/types/stress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface StressLevelChartProps {
  entries: StressLevelEntry[]
  days?: number
}

export function StressLevelChart({ entries, days = 7 }: StressLevelChartProps) {
  const chartData = useMemo(() => {
    // Filter entries for the last N days
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const filteredEntries = entries
      .filter(entry => new Date(entry.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Group by date and calculate average
    const groupedByDate = filteredEntries.reduce((acc, entry) => {
      const dateKey = format(new Date(entry.date), 'MMM dd')
      if (!acc[dateKey]) {
        acc[dateKey] = { total: 0, count: 0, date: new Date(entry.date) }
      }
      acc[dateKey].total += entry.stressLevel
      acc[dateKey].count += 1
      return acc
    }, {} as Record<string, { total: number; count: number; date: Date }>)

    return Object.entries(groupedByDate).map(([date, data]) => ({
      date,
      stress: Math.round((data.total / data.count) * 10) / 10,
      fullDate: data.date,
    }))
  }, [entries, days])

  const averageStress = useMemo(() => {
    if (chartData.length === 0) return 0
    const sum = chartData.reduce((acc, item) => acc + item.stress, 0)
    return Math.round((sum / chartData.length) * 10) / 10
  }, [chartData])

  const getStressColor = (level: number) => {
    if (level <= 2) return colors.stress.none
    if (level <= 4) return colors.stress.low
    if (level <= 6) return colors.stress.medium
    if (level <= 8) return colors.stress.high
    return colors.stress.veryHigh
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stress Trends</CardTitle>
          <CardDescription>Last {days} days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No stress data available yet. Start logging your stress levels!
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Stress Trends</CardTitle>
            <CardDescription>Last {days} days</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Average</div>
            <div
              className="text-2xl font-bold"
              style={{ color: getStressColor(averageStress) }}
            >
              {averageStress}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={colors.stress.high} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={colors.stress.high} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis
              dataKey="date"
              stroke={colors.text.secondary}
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              domain={[0, 10]}
              stroke={colors.text.secondary}
              fontSize={12}
              tickLine={false}
              ticks={[0, 2, 4, 6, 8, 10]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                      <p className="text-sm font-medium">{data.date}</p>
                      <p
                        className="text-lg font-bold"
                        style={{ color: getStressColor(data.stress) }}
                      >
                        Stress: {data.stress}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="stress"
              stroke={colors.stress.high}
              strokeWidth={2}
              fill="url(#colorStress)"
            />
            <Line
              type="monotone"
              dataKey="stress"
              stroke={colors.stress.high}
              strokeWidth={3}
              dot={{ fill: colors.stress.high, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="mt-4 flex justify-center gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.stress.none }}></div>
            <span className="text-gray-600">Calm (1-2)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.stress.low }}></div>
            <span className="text-gray-600">Mild (3-4)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.stress.medium }}></div>
            <span className="text-gray-600">Moderate (5-6)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.stress.high }}></div>
            <span className="text-gray-600">High (7-8)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.stress.veryHigh }}></div>
            <span className="text-gray-600">Extreme (9-10)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
