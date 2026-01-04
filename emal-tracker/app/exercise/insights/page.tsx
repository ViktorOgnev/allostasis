'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useExerciseStore } from '@/store/exerciseStore'
import { format, startOfWeek, endOfWeek, isWithinInterval, subWeeks } from 'date-fns'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

export default function ExerciseInsightsPage() {
  const { entries, loadEntries } = useExerciseStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeData = async () => {
      await loadEntries()
      setIsLoading(false)
    }
    initializeData()
  }, [loadEntries])

  const insights = useMemo(() => {
    if (entries.length === 0) {
      return {
        totalWorkouts: 0,
        totalMinutes: 0,
        avgDuration: 0,
        weeklyAverage: 0,
        mostCommonType: '',
        mostCommonIntensity: '',
        energyBoost: 0,
        consistency: 0,
        typeBreakdown: [],
        intensityBreakdown: [],
      }
    }

    const totalWorkouts = entries.length
    const totalMinutes = entries.reduce((sum, e) => sum + e.duration, 0)
    const avgDuration = totalMinutes / totalWorkouts

    // Weekly average (last 4 weeks)
    const now = new Date()
    const fourWeeksAgo = subWeeks(now, 4)
    const recentEntries = entries.filter(e => new Date(e.date) >= fourWeeksAgo)
    const weeklyAverage = (recentEntries.reduce((sum, e) => sum + e.duration, 0)) / 4

    // Most common type and intensity
    const typeCounts: Record<string, number> = {}
    const intensityCounts: Record<string, number> = {}

    entries.forEach(e => {
      typeCounts[e.type] = (typeCounts[e.type] || 0) + 1
      intensityCounts[e.intensity] = (intensityCounts[e.intensity] || 0) + 1
    })

    const mostCommonType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
    const mostCommonIntensity = Object.entries(intensityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || ''

    // Average energy boost
    const entriesWithEnergy = entries.filter(e => e.energyBefore !== undefined && e.energyAfter !== undefined)
    const energyBoost = entriesWithEnergy.length > 0
      ? entriesWithEnergy.reduce((sum, e) => sum + (e.energyAfter! - e.energyBefore!), 0) / entriesWithEnergy.length
      : 0

    // Consistency (workouts per week over last 8 weeks)
    const weeks = Array.from({ length: 8 }, (_, i) => {
      const weekStart = startOfWeek(subWeeks(now, 7 - i))
      const weekEnd = endOfWeek(weekStart)
      const weekEntries = entries.filter(e => {
        const entryDate = new Date(e.date)
        return isWithinInterval(entryDate, { start: weekStart, end: weekEnd })
      })
      return weekEntries.length
    })
    const avgWorkoutsPerWeek = weeks.reduce((sum, count) => sum + count, 0) / weeks.length
    const consistency = Math.min(100, (avgWorkoutsPerWeek / 5) * 100) // 5 workouts/week = 100%

    // Type breakdown
    const typeBreakdown = Object.entries(typeCounts).map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count,
      minutes: entries.filter(e => e.type === type).reduce((sum, e) => sum + e.duration, 0),
    }))

    // Intensity breakdown
    const intensityBreakdown = Object.entries(intensityCounts).map(([intensity, count]) => ({
      intensity: intensity.charAt(0).toUpperCase() + intensity.slice(1),
      count,
      minutes: entries.filter(e => e.intensity === intensity).reduce((sum, e) => sum + e.duration, 0),
    }))

    return {
      totalWorkouts,
      totalMinutes,
      avgDuration: Number(avgDuration.toFixed(0)),
      weeklyAverage: Number(weeklyAverage.toFixed(0)),
      mostCommonType,
      mostCommonIntensity,
      energyBoost: Number(energyBoost.toFixed(1)),
      consistency: Number(consistency.toFixed(0)),
      typeBreakdown,
      intensityBreakdown,
    }
  }, [entries])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading insights...</p>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/exercise">← Back to Exercise Tracking</Link>
          </Button>
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-600 mb-4">No exercise data yet. Start logging workouts to see insights!</p>
              <Button asChild>
                <Link href="/exercise">Log Your First Workout →</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/exercise">← Back to Exercise Tracking</Link>
          </Button>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Exercise Insights & Patterns
          </h1>
          <p className="text-gray-600">
            Discover your workout patterns and progress toward fitness goals
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Workouts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{insights.totalWorkouts}</p>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{insights.totalMinutes}</p>
              <p className="text-xs text-gray-500 mt-1">
                {(insights.totalMinutes / 60).toFixed(1)} hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Weekly Average</CardDescription>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${insights.weeklyAverage >= 300 ? 'text-green-600' : insights.weeklyAverage >= 150 ? 'text-yellow-600' : 'text-red-600'}`}>
                {insights.weeklyAverage} min
              </p>
              <p className="text-xs text-gray-500 mt-1">Last 4 weeks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Energy Boost</CardDescription>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${insights.energyBoost > 0 ? 'text-green-600' : insights.energyBoost < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                {insights.energyBoost > 0 ? '+' : ''}{insights.energyBoost}
              </p>
              <p className="text-xs text-gray-500 mt-1">Avg points change</p>
            </CardContent>
          </Card>
        </div>

        {/* WHO Goal Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>WHO Weekly Goal Progress</CardTitle>
            <CardDescription>
              Track your progress toward the WHO recommendation of 300+ minutes moderate or 150+ minutes vigorous exercise per week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Moderate Goal */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Moderate Exercise Goal (300 min/week)</span>
                  <span className="text-sm font-bold text-green-600">
                    {Math.min(100, Math.round((insights.weeklyAverage / 300) * 100))}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-green-500"
                    style={{ width: `${Math.min(100, (insights.weeklyAverage / 300) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {insights.weeklyAverage >= 300
                    ? '🎉 Great! You met the WHO recommendation'
                    : `${300 - insights.weeklyAverage} more minutes to reach goal`}
                </p>
              </div>

              {/* Vigorous Alternative */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Alternative: Vigorous Exercise (150 min/week)</span>
                  <span className="text-sm font-bold text-orange-600">
                    {Math.min(100, Math.round((insights.weeklyAverage / 150) * 100))}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-orange-500"
                    style={{ width: `${Math.min(100, (insights.weeklyAverage / 150) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Type Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Exercise Type Breakdown</CardTitle>
            <CardDescription>
              Your preferred workout types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {insights.typeBreakdown.map((item) => (
                <div key={item.type} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-sm">{item.type}</h3>
                    <span className="text-xs text-gray-500">{item.count} sessions</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 mb-1">{item.minutes} min</p>
                  <p className="text-xs text-gray-600">
                    {(item.minutes / insights.totalMinutes * 100).toFixed(0)}% of total exercise time
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Intensity Distribution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Intensity Distribution</CardTitle>
            <CardDescription>
              How hard you're pushing yourself
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.intensityBreakdown.map((item) => {
                const getColor = () => {
                  switch (item.intensity.toLowerCase()) {
                    case 'low': return 'bg-green-500'
                    case 'moderate': return 'bg-yellow-500'
                    case 'high': return 'bg-orange-500'
                    case 'vigorous': return 'bg-red-500'
                    default: return 'bg-gray-500'
                  }
                }

                return (
                  <div key={item.intensity} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.intensity}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">{item.count} sessions • {item.minutes} min</span>
                        <span className="text-sm font-bold">
                          {(item.count / insights.totalWorkouts * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getColor()}`}
                        style={{ width: `${(item.count / insights.totalWorkouts) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">💡 Intensity Balance Recommendation:</p>
              <p className="text-sm text-gray-700">
                A balanced approach includes mostly moderate exercise (70-80%), with some low-intensity
                recovery (10-15%) and occasional high-intensity sessions (10-15%) for cardiovascular benefits.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Consistency Score */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Exercise Consistency</CardTitle>
            <CardDescription>
              Regular exercise is more beneficial than occasional intense sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Your Consistency Score</span>
                <span className="text-2xl font-bold text-blue-600">{insights.consistency}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${insights.consistency >= 80 ? 'bg-green-500' : insights.consistency >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${insights.consistency}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Based on {insights.totalWorkouts} workouts over the tracking period
              </p>
            </div>

            {insights.consistency < 80 && (
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">🎯 How to Improve Consistency:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Schedule workouts at the same time each day</li>
                  <li>• Start with shorter, manageable sessions (even 10-15 min counts)</li>
                  <li>• Find activities you enjoy to make exercise sustainable</li>
                  <li>• Track your progress to stay motivated</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-6 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Keep Up the Great Work!</h2>
          <p className="mb-4 text-orange-100">
            Explore the science behind exercise and energy management
          </p>
          <Button asChild variant="secondary">
            <Link href="/exercise/benefits">Learn About Exercise Benefits →</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
