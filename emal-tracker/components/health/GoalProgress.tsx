"use client"

import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useExerciseStore } from '@/store/exerciseStore'
import { useSleepStore } from '@/store/sleepStore'
import { useEnergyStore } from '@/store/energyStore'
import { colors } from '@/app/design-tokens/colors'

interface GoalProgressProps {
  variant?: 'full' | 'compact'
  showExercise?: boolean
  showSleep?: boolean
  showEnergy?: boolean
}

export function GoalProgress({
  variant = 'full',
  showExercise = true,
  showSleep = true,
  showEnergy = true
}: GoalProgressProps) {
  const exerciseEntries = useExerciseStore((state) => state.entries)
  const sleepEntries = useSleepStore((state) => state.entries)
  const energyEntries = useEnergyStore((state) => state.entries)

  // Calculate weekly exercise progress
  const exerciseProgress = useMemo(() => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 7)

    const weeklyEntries = exerciseEntries.filter(
      (entry) => new Date(entry.date) >= cutoffDate
    )

    const totalMinutes = weeklyEntries.reduce((sum, entry) => sum + entry.duration, 0)
    const target = 300 // WHO recommendation: 300 min moderate activity per week
    const percentage = Math.min((totalMinutes / target) * 100, 100)
    const daysExercised = new Set(
      weeklyEntries.map((entry) => new Date(entry.date).toDateString())
    ).size

    return {
      totalMinutes,
      target,
      percentage,
      daysExercised,
    }
  }, [exerciseEntries])

  // Calculate sleep consistency streak
  const sleepStreak = useMemo(() => {
    if (sleepEntries.length === 0) return 0

    const sortedEntries = [...sleepEntries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date)
      entryDate.setHours(0, 0, 0, 0)

      const expectedDate = new Date(today)
      expectedDate.setDate(today.getDate() - i)
      expectedDate.setHours(0, 0, 0, 0)

      // Check if entry is within 7-9 hours
      const duration = sortedEntries[i].duration
      if (
        entryDate.getTime() === expectedDate.getTime() &&
        duration >= 7 &&
        duration <= 9
      ) {
        streak++
      } else {
        break
      }
    }

    return streak
  }, [sleepEntries])

  // Calculate energy trend (this week vs last week)
  const energyTrend = useMemo(() => {
    const today = new Date()
    const lastWeekStart = new Date(today)
    lastWeekStart.setDate(today.getDate() - 14)
    const lastWeekEnd = new Date(today)
    lastWeekEnd.setDate(today.getDate() - 7)
    const thisWeekStart = new Date(today)
    thisWeekStart.setDate(today.getDate() - 7)

    const lastWeekEntries = energyEntries.filter((entry) => {
      const date = new Date(entry.date)
      return date >= lastWeekStart && date < lastWeekEnd
    })

    const thisWeekEntries = energyEntries.filter((entry) => {
      const date = new Date(entry.date)
      return date >= thisWeekStart
    })

    const lastWeekAvg =
      lastWeekEntries.length > 0
        ? lastWeekEntries.reduce((sum, entry) => sum + entry.energyLevel, 0) /
          lastWeekEntries.length
        : 0

    const thisWeekAvg =
      thisWeekEntries.length > 0
        ? thisWeekEntries.reduce((sum, entry) => sum + entry.energyLevel, 0) /
          thisWeekEntries.length
        : 0

    const difference = thisWeekAvg - lastWeekAvg
    const trend: 'up' | 'down' | 'stable' =
      Math.abs(difference) < 0.5
        ? 'stable'
        : difference > 0
        ? 'up'
        : 'down'

    return {
      thisWeekAvg: Math.round(thisWeekAvg * 10) / 10,
      lastWeekAvg: Math.round(lastWeekAvg * 10) / 10,
      trend,
      difference: Math.round(Math.abs(difference) * 10) / 10,
    }
  }, [energyEntries])

  // Get progress bar color based on percentage
  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return colors.error // red
    if (percentage < 80) return colors.warning // yellow
    if (percentage < 100) return colors.success // green
    return colors.primary // blue (overachieved)
  }

  if (variant === 'compact') {
    return (
      <div className="space-y-3">
        {showExercise && (
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Exercise Goal</span>
                <span className="font-medium">
                  {exerciseProgress.totalMinutes}/{exerciseProgress.target} min
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${exerciseProgress.percentage}%`,
                    backgroundColor: getProgressColor(exerciseProgress.percentage),
                  }}
                />
              </div>
            </div>
            <div className="text-2xl">🏃</div>
          </div>
        )}

        {showSleep && sleepStreak > 0 && (
          <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
            <span className="text-sm text-gray-700">😴 Sleep Streak</span>
            <span className="font-bold text-blue-600">{sleepStreak} days</span>
          </div>
        )}

        {showEnergy && energyTrend.thisWeekAvg > 0 && (
          <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
            <span className="text-sm text-gray-700">⚡ Avg Energy</span>
            <div className="flex items-center gap-1">
              <span className="font-bold text-green-600">{energyTrend.thisWeekAvg}</span>
              {energyTrend.trend === 'up' && <span className="text-green-600">↑</span>}
              {energyTrend.trend === 'down' && <span className="text-red-600">↓</span>}
              {energyTrend.trend === 'stable' && <span className="text-gray-600">→</span>}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Goals Progress</CardTitle>
        <CardDescription>Track your progress toward health goals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Exercise Goal */}
        {showExercise && (
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <span className="text-2xl">🏃</span>
                  Weekly Exercise Goal
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  WHO recommends 300 min moderate activity/week
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: getProgressColor(exerciseProgress.percentage) }}>
                  {Math.round(exerciseProgress.percentage)}%
                </div>
                <div className="text-xs text-gray-500">
                  {exerciseProgress.totalMinutes} / {exerciseProgress.target} min
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${exerciseProgress.percentage}%`,
                  backgroundColor: getProgressColor(exerciseProgress.percentage),
                }}
              />
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>🗓️ {exerciseProgress.daysExercised} workouts this week</span>
              {exerciseProgress.percentage >= 100 ? (
                <span className="text-blue-600 font-medium">🎉 Goal achieved!</span>
              ) : (
                <span>
                  {exerciseProgress.target - exerciseProgress.totalMinutes} min to go
                </span>
              )}
            </div>
          </div>
        )}

        {/* Sleep Consistency */}
        {showSleep && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <span className="text-2xl">😴</span>
                  Sleep Consistency
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  7-9 hours per night
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {sleepStreak}
                </div>
                <div className="text-xs text-gray-600">
                  {sleepStreak === 1 ? 'day' : 'days'} in a row
                </div>
              </div>
            </div>
            {sleepStreak >= 7 && (
              <div className="mt-3 text-sm text-blue-700 font-medium">
                🎉 Amazing! One week of optimal sleep!
              </div>
            )}
            {sleepStreak === 0 && (
              <div className="mt-3 text-sm text-gray-600">
                Start logging sleep to build your streak
              </div>
            )}
          </div>
        )}

        {/* Energy Trend */}
        {showEnergy && energyTrend.thisWeekAvg > 0 && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  Energy Trend
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  This week vs last week
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <div className="text-3xl font-bold text-green-600">
                    {energyTrend.thisWeekAvg}
                  </div>
                  {energyTrend.trend === 'up' && (
                    <span className="text-2xl text-green-600">↑</span>
                  )}
                  {energyTrend.trend === 'down' && (
                    <span className="text-2xl text-red-600">↓</span>
                  )}
                  {energyTrend.trend === 'stable' && (
                    <span className="text-2xl text-gray-600">→</span>
                  )}
                </div>
                <div className="text-xs text-gray-600">
                  avg energy level
                </div>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-700">
              {energyTrend.trend === 'up' && (
                <span className="text-green-700 font-medium">
                  ↑ {energyTrend.difference} higher than last week
                </span>
              )}
              {energyTrend.trend === 'down' && (
                <span className="text-red-700 font-medium">
                  ↓ {energyTrend.difference} lower than last week
                </span>
              )}
              {energyTrend.trend === 'stable' && (
                <span className="text-gray-700">
                  → Stable energy levels
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
