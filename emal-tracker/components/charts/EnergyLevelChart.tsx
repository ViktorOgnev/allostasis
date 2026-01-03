"use client"

import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { format } from 'date-fns'
import type { EnergyEntry } from '@/types/energy'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface EnergyLevelChartProps {
  entries: EnergyEntry[]
  days?: number
}

export function EnergyLevelChart({ entries, days = 7 }: EnergyLevelChartProps) {
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
      acc[dateKey].total += entry.energyLevel
      acc[dateKey].count += 1
      return acc
    }, {} as Record<string, { total: number; count: number; date: Date }>)

    return Object.entries(groupedByDate).map(([date, data]) => ({
      date,
      energy: Math.round((data.total / data.count) * 10) / 10,
      fullDate: data.date,
    }))
  }, [entries, days])

  const averageEnergy = useMemo(() => {
    if (chartData.length === 0) return 0
    const sum = chartData.reduce((acc, item) => acc + item.energy, 0)
    return Math.round((sum / chartData.length) * 10) / 10
  }, [chartData])

  const getEnergyColor = (energy: number) => {
    if (energy <= 3) return '#F87171' // red
    if (energy <= 7) return '#FACC15' // yellow
    return '#4ADE80' // green
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Energy Trends</CardTitle>
          <CardDescription>Last {days} days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No energy data available yet. Start logging your energy levels!
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
            <CardTitle>Energy Trends</CardTitle>
            <CardDescription>Last {days} days</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Average</div>
            <div className={`text-2xl font-bold ${
              averageEnergy <= 3 ? 'text-red-500' :
              averageEnergy <= 7 ? 'text-yellow-500' :
              'text-green-500'
            }`}>
              {averageEnergy}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4ADE80" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              domain={[0, 10]}
              stroke="#6b7280"
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
                      <p className={`text-lg font-bold ${
                        data.energy <= 3 ? 'text-red-500' :
                        data.energy <= 7 ? 'text-yellow-500' :
                        'text-green-500'
                      }`}>
                        Energy: {data.energy}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="energy"
              stroke="#4ADE80"
              strokeWidth={2}
              fill="url(#colorEnergy)"
            />
            <Line
              type="monotone"
              dataKey="energy"
              stroke="#4ADE80"
              strokeWidth={3}
              dot={{ fill: '#4ADE80', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="mt-4 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">Low (1-3)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-600">Moderate (4-7)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">High (8-10)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
