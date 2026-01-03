'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSleepStore } from '@/store/sleepStore'
import { useEnergyStore } from '@/store/energyStore'
import { format, parseISO, isSameDay, addDays } from 'date-fns'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter } from 'recharts'

export default function SleepInsightsPage() {
  const { entries: sleepEntries, loadEntries: loadSleepEntries } = useSleepStore()
  const { entries: energyEntries, loadEntries: loadEnergyEntries } = useEnergyStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([loadSleepEntries(), loadEnergyEntries()])
      setIsLoading(false)
    }
    initializeData()
  }, [loadSleepEntries, loadEnergyEntries])

  // Calculate insights
  const insights = useMemo(() => {
    if (sleepEntries.length === 0) {
      return {
        avgDuration: 0,
        avgQuality: 0,
        totalNights: 0,
        goodSleepNights: 0,
        sleepDebtNights: 0,
        consistencyScore: 0,
        factorImpacts: {},
        correlations: [],
      }
    }

    const avgDuration = sleepEntries.reduce((sum, e) => sum + e.duration, 0) / sleepEntries.length
    const avgQuality = sleepEntries.reduce((sum, e) => sum + e.quality, 0) / sleepEntries.length
    const totalNights = sleepEntries.length
    const goodSleepNights = sleepEntries.filter(e => e.duration >= 7 && e.duration <= 9).length
    const sleepDebtNights = sleepEntries.filter(e => e.duration < 7).length

    // Calculate sleep consistency (variation in bedtime)
    const bedtimeHours = sleepEntries.map(e => new Date(e.bedtime).getHours() + new Date(e.bedtime).getMinutes() / 60)
    const avgBedtime = bedtimeHours.reduce((sum, h) => sum + h, 0) / bedtimeHours.length
    const bedtimeVariance = bedtimeHours.reduce((sum, h) => sum + Math.pow(h - avgBedtime, 2), 0) / bedtimeHours.length
    const consistencyScore = Math.max(0, 100 - bedtimeVariance * 10)

    // Factor impacts on quality
    const factorImpacts: Record<string, { count: number; avgQuality: number }> = {}
    const factors = ['caffeine', 'alcohol', 'lateExercise', 'screenTime', 'stress']

    factors.forEach(factor => {
      const withFactor = sleepEntries.filter(e => e.factors && (e.factors as any)[factor])
      if (withFactor.length > 0) {
        factorImpacts[factor] = {
          count: withFactor.length,
          avgQuality: withFactor.reduce((sum, e) => sum + e.quality, 0) / withFactor.length,
        }
      }
    })

    // Sleep-Energy correlations
    const correlations = sleepEntries.map(sleepEntry => {
      const sleepDate = new Date(sleepEntry.date)
      const nextDay = addDays(sleepDate, 1)

      // Find energy entries from the next day
      const nextDayEnergy = energyEntries.filter(energyEntry => {
        const energyDate = new Date(energyEntry.date)
        return isSameDay(energyDate, nextDay)
      })

      if (nextDayEnergy.length > 0) {
        const avgEnergy = nextDayEnergy.reduce((sum, e) => sum + e.energyLevel, 0) / nextDayEnergy.length
        return {
          duration: sleepEntry.duration,
          quality: sleepEntry.quality,
          nextDayEnergy: Number(avgEnergy.toFixed(1)),
          date: format(sleepDate, 'MMM dd'),
        }
      }
      return null
    }).filter(Boolean) as any[]

    return {
      avgDuration: Number(avgDuration.toFixed(1)),
      avgQuality: Number(avgQuality.toFixed(1)),
      totalNights,
      goodSleepNights,
      sleepDebtNights,
      consistencyScore: Number(consistencyScore.toFixed(0)),
      factorImpacts,
      correlations,
    }
  }, [sleepEntries, energyEntries])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading insights...</p>
      </div>
    )
  }

  if (sleepEntries.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/sleep">← Back to Sleep Tracking</Link>
          </Button>
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-600 mb-4">No sleep data yet. Start logging your sleep to see insights!</p>
              <Button asChild>
                <Link href="/sleep">Log Your First Night →</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  const avgQualityWithoutFactors = sleepEntries
    .filter(e => !e.factors || !Object.values(e.factors).some(v => v))
    .reduce((sum, e, _, arr) => sum + e.quality / arr.length, 0)

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/sleep">← Back to Sleep Tracking</Link>
          </Button>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sleep Insights & Patterns
          </h1>
          <p className="text-gray-600">
            Discover patterns in your sleep and how it affects your energy levels
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average Duration</CardDescription>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${insights.avgDuration >= 7 && insights.avgDuration <= 9 ? 'text-green-600' : 'text-yellow-600'}`}>
                {insights.avgDuration}h
              </p>
              <p className="text-xs text-gray-500 mt-1">Target: 7-9h</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average Quality</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">
                {insights.avgQuality}/5
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {insights.avgQuality >= 4 ? 'Excellent' : insights.avgQuality >= 3 ? 'Good' : 'Needs work'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Good Sleep Nights</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {insights.goodSleepNights}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {((insights.goodSleepNights / insights.totalNights) * 100).toFixed(0)}% of nights
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Consistency Score</CardDescription>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${insights.consistencyScore >= 80 ? 'text-green-600' : insights.consistencyScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {insights.consistencyScore}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Bedtime regularity</p>
            </CardContent>
          </Card>
        </div>

        {/* Sleep-Energy Correlation */}
        {insights.correlations.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Sleep Duration vs Next-Day Energy</CardTitle>
              <CardDescription>
                How your sleep affects your energy levels the following day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    dataKey="duration"
                    name="Sleep Duration"
                    unit="h"
                    domain={[4, 12]}
                    label={{ value: 'Sleep Duration (hours)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="nextDayEnergy"
                    name="Energy Level"
                    domain={[1, 10]}
                    label={{ value: 'Next Day Energy', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border">
                            <p className="font-medium text-sm">{data.date}</p>
                            <p className="text-sm text-blue-600">Sleep: {data.duration}h</p>
                            <p className="text-sm text-green-600">Energy: {data.nextDayEnergy}/10</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Scatter
                    data={insights.correlations}
                    fill="#3B82F6"
                  />
                </ScatterChart>
              </ResponsiveContainer>
              <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">💡 Insight:</p>
                <p className="text-sm text-gray-700">
                  Track both sleep and energy to discover your optimal sleep duration.
                  Most people see peak energy with 7-9 hours of sleep.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Factor Impacts */}
        {Object.keys(insights.factorImpacts).length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Sleep Factors Impact on Quality</CardTitle>
              <CardDescription>
                How different factors affect your sleep quality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(insights.factorImpacts).map(([factor, data]) => {
                  const factorLabels: Record<string, string> = {
                    caffeine: '☕ Caffeine',
                    alcohol: '🍷 Alcohol',
                    lateExercise: '🏃 Late Exercise',
                    screenTime: '📱 Screen Time',
                    stress: '😰 Stress',
                  }

                  const impact = avgQualityWithoutFactors - data.avgQuality
                  const impactPercent = ((impact / avgQualityWithoutFactors) * 100).toFixed(0)

                  return (
                    <div key={factor} className="border-b border-gray-100 pb-3 last:border-0">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">{factorLabels[factor]}</span>
                        <span className="text-xs text-gray-500">{data.count} nights</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${impact > 0.5 ? 'bg-red-500' : impact > 0.2 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(100, Math.abs(Number(impactPercent)))}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-20 text-right">
                          {data.avgQuality.toFixed(1)}/5
                        </span>
                      </div>
                      {impact > 0.3 && (
                        <p className="text-xs text-red-600 mt-1">
                          ⚠️ Reduces quality by {impact.toFixed(1)} points on average
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">🎯 Recommendations:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {insights.factorImpacts.caffeine && (
                    <li>• Avoid caffeine after 2pm to improve sleep quality</li>
                  )}
                  {insights.factorImpacts.alcohol && (
                    <li>• Limit alcohol consumption, especially close to bedtime</li>
                  )}
                  {insights.factorImpacts.screenTime && (
                    <li>• Implement a 1-hour screen-free wind-down routine</li>
                  )}
                  {insights.factorImpacts.stress && (
                    <li>• Practice stress-reduction techniques before bed (meditation, breathing)</li>
                  )}
                  {insights.factorImpacts.lateExercise && (
                    <li>• Schedule intense workouts earlier in the day</li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Consistency Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Sleep Consistency</CardTitle>
            <CardDescription>
              Maintaining a regular sleep schedule improves sleep quality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Your Consistency Score</span>
                <span className="text-2xl font-bold text-blue-600">{insights.consistencyScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${insights.consistencyScore >= 80 ? 'bg-green-500' : insights.consistencyScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${insights.consistencyScore}%` }}
                />
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <div className="flex items-start gap-2">
                <span className={insights.consistencyScore >= 80 ? 'text-green-600' : 'text-gray-400'}>
                  {insights.consistencyScore >= 80 ? '✓' : '○'}
                </span>
                <div>
                  <p className="text-sm font-medium">Excellent (80%+)</p>
                  <p className="text-xs text-gray-600">Your sleep schedule is very consistent</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className={insights.consistencyScore >= 60 && insights.consistencyScore < 80 ? 'text-yellow-600' : 'text-gray-400'}>
                  {insights.consistencyScore >= 60 && insights.consistencyScore < 80 ? '✓' : '○'}
                </span>
                <div>
                  <p className="text-sm font-medium">Good (60-79%)</p>
                  <p className="text-xs text-gray-600">Room for improvement in regularity</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className={insights.consistencyScore < 60 ? 'text-red-600' : 'text-gray-400'}>
                  {insights.consistencyScore < 60 ? '✓' : '○'}
                </span>
                <div>
                  <p className="text-sm font-medium">Needs Work (&lt;60%)</p>
                  <p className="text-xs text-gray-600">Focus on consistent bedtimes</p>
                </div>
              </div>
            </div>

            {insights.consistencyScore < 80 && (
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">💡 How to Improve Consistency:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Go to bed at the same time every night (even weekends)</li>
                  <li>• Set a bedtime alarm as a reminder</li>
                  <li>• Create a wind-down routine 30-60min before bed</li>
                  <li>• Avoid naps after 3pm</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Want to Learn More?</h2>
          <p className="mb-4 text-blue-100">
            Check out our science-based sleep optimization tips
          </p>
          <Button asChild variant="secondary">
            <Link href="/sleep/tips">View Sleep Tips →</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
