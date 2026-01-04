"use client"

import { useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { useEnergyStore } from '@/store/energyStore'
import { useSleepStore } from '@/store/sleepStore'
import { useExerciseStore } from '@/store/exerciseStore'
import { useStressLevelStore } from '@/store/stressLevelStore'
import { getEnergyColor } from '@/app/design-tokens/colors'
import { colors } from '@/app/design-tokens/colors'

export function DashboardOverview() {
  const energyEntries = useEnergyStore((state) => state.entries)
  const sleepEntries = useSleepStore((state) => state.entries)
  const exerciseEntries = useExerciseStore((state) => state.entries)
  const stressEntries = useStressLevelStore((state) => state.entries)

  // Get today's data
  const todayData = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Latest energy entry today
    const todayEnergyEntries = energyEntries.filter((entry) => {
      const entryDate = new Date(entry.date)
      return entryDate >= today && entryDate < tomorrow
    })
    const latestEnergy = todayEnergyEntries.length > 0
      ? todayEnergyEntries.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0]
      : null

    // Last night's sleep (yesterday's entry)
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    const yesterdaySleep = sleepEntries.find((entry) => {
      const entryDate = new Date(entry.date)
      entryDate.setHours(0, 0, 0, 0)
      return entryDate.getTime() === yesterday.getTime()
    })

    // Today's exercise total
    const todayExerciseEntries = exerciseEntries.filter((entry) => {
      const entryDate = new Date(entry.date)
      return entryDate >= today && entryDate < tomorrow
    })
    const totalExerciseMinutes = todayExerciseEntries.reduce(
      (sum, entry) => sum + entry.duration,
      0
    )

    // Latest stress entry today
    const todayStressEntries = stressEntries.filter((entry) => {
      const entryDate = new Date(entry.date)
      return entryDate >= today && entryDate < tomorrow
    })
    const latestStress = todayStressEntries.length > 0
      ? todayStressEntries.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0]
      : null

    return {
      energy: latestEnergy,
      sleep: yesterdaySleep,
      exerciseMinutes: totalExerciseMinutes,
      exerciseCount: todayExerciseEntries.length,
      stress: latestStress,
    }
  }, [energyEntries, sleepEntries, exerciseEntries, stressEntries])

  const getStressColor = (level: number) => {
    if (level <= 2) return colors.stress.none
    if (level <= 4) return colors.stress.low
    if (level <= 6) return colors.stress.medium
    if (level <= 8) return colors.stress.high
    return colors.stress.veryHigh
  }

  const getSleepColor = (duration: number) => {
    if (duration < 6) return colors.sleep.poor
    if (duration < 7) return colors.sleep.fair
    if (duration <= 9) return colors.sleep.excellent
    return colors.sleep.good
  }

  const metrics = [
    {
      title: 'Energy',
      href: '/energy',
      icon: '⚡',
      value: todayData.energy ? `${todayData.energy.energyLevel}/10` : 'No data',
      subtitle: todayData.energy
        ? todayData.energy.mood.charAt(0).toUpperCase() + todayData.energy.mood.slice(1)
        : 'Log your energy',
      color: todayData.energy ? getEnergyColor(todayData.energy.energyLevel) : colors.text.tertiary,
      bgColor: todayData.energy ? `${getEnergyColor(todayData.energy.energyLevel)}15` : colors.surface,
    },
    {
      title: 'Sleep',
      href: '/sleep',
      icon: '😴',
      value: todayData.sleep ? `${todayData.sleep.duration}h` : 'No data',
      subtitle: todayData.sleep
        ? `Quality: ${todayData.sleep.quality}/5`
        : 'Log your sleep',
      color: todayData.sleep ? getSleepColor(todayData.sleep.duration) : colors.text.tertiary,
      bgColor: todayData.sleep ? `${getSleepColor(todayData.sleep.duration)}15` : colors.surface,
    },
    {
      title: 'Exercise',
      href: '/exercise',
      icon: '🏃',
      value: todayData.exerciseMinutes > 0 ? `${todayData.exerciseMinutes}m` : 'No data',
      subtitle: todayData.exerciseMinutes > 0
        ? `${todayData.exerciseCount} ${todayData.exerciseCount === 1 ? 'workout' : 'workouts'}`
        : 'Log your workout',
      color: todayData.exerciseMinutes > 0 ? colors.exercise.moderate : colors.text.tertiary,
      bgColor: todayData.exerciseMinutes > 0 ? `${colors.exercise.moderate}15` : colors.surface,
    },
    {
      title: 'Stress',
      href: '/stress',
      icon: '🧘',
      value: todayData.stress ? `${todayData.stress.stressLevel}/10` : 'No data',
      subtitle: todayData.stress
        ? todayData.stress.timeOfDay.charAt(0).toUpperCase() + todayData.stress.timeOfDay.slice(1)
        : 'Log your stress',
      color: todayData.stress ? getStressColor(todayData.stress.stressLevel) : colors.text.tertiary,
      bgColor: todayData.stress ? `${getStressColor(todayData.stress.stressLevel)}15` : colors.surface,
    },
  ]

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Today's Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Link key={metric.title} href={metric.href}>
            <Card
              className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full"
              style={{ backgroundColor: metric.bgColor }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{metric.icon}</span>
                  <div className="text-xs font-medium text-gray-600">
                    {metric.title}
                  </div>
                </div>
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: metric.color }}
                >
                  {metric.value}
                </div>
                <div className="text-xs text-gray-600">
                  {metric.subtitle}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
