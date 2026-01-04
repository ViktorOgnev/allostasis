'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { Dumbbell } from 'lucide-react'
import { useExerciseStore } from '@/store/exerciseStore'
import { ExerciseLogForm } from '@/components/forms/ExerciseLogForm'
import { ExerciseSummaryChart } from '@/components/charts/ExerciseSummaryChart'
import { RecentExerciseEntries } from '@/components/charts/RecentExerciseEntries'
import { EmptyState } from '@/components/health/EmptyState'
import { ProgressBar } from '@/components/health/ProgressBar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ExercisePage() {
  const { entries, loadEntries } = useExerciseStore()
  const [isLoading, setIsLoading] = useState(true)
  const [chartView, setChartView] = useState<'all' | 'weekly' | 'types' | 'energy'>('all')
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initializeData = async () => {
      await loadEntries()
      setIsLoading(false)
    }
    initializeData()
  }, [loadEntries])

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Calculate weekly exercise minutes for WHO goal
  const weeklyMinutes = useMemo(() => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    return entries
      .filter(entry => new Date(entry.date) >= oneWeekAgo)
      .reduce((total, entry) => total + entry.duration, 0)
  }, [entries])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading exercise data...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Exercise Tracking
          </h1>
          <p className="text-gray-600 mb-4">
            Track your workouts and see their impact on energy. WHO recommends 300+ minutes of moderate exercise per week.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/exercise/benefits">💡 Exercise Benefits</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/exercise/insights">📊 Insights</Link>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Exercise Log Form */}
          <div ref={formRef}>
            <ExerciseLogForm />
          </div>

          {/* Benefits Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why Exercise Matters</CardTitle>
                <CardDescription>
                  Exercise is crucial for energy management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🔬</div>
                  <div>
                    <p className="font-medium text-sm">Mitochondrial Growth</p>
                    <p className="text-xs text-gray-600">
                      Exercise increases mitochondria count and efficiency, boosting cellular energy production
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <p className="font-medium text-sm">Metabolic Compensation</p>
                    <p className="text-xs text-gray-600">
                      Regular exercise makes your body more efficient, using less energy for baseline functions
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">😊</div>
                  <div>
                    <p className="font-medium text-sm">Mood Enhancement</p>
                    <p className="text-xs text-gray-600">
                      Releases endorphins, dopamine, and serotonin, improving mood and reducing stress
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">😴</div>
                  <div>
                    <p className="font-medium text-sm">Better Sleep Quality</p>
                    <p className="text-xs text-gray-600">
                      Regular exercise improves sleep quality, which further boosts energy levels
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WHO Recommendations with Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">WHO Guidelines & Your Progress</CardTitle>
                <CardDescription>Weekly exercise goal tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Weekly Progress */}
                  {entries.length > 0 && (
                    <div className="pb-4 border-b border-gray-200">
                      <ProgressBar
                        current={weeklyMinutes}
                        target={300}
                        label="This Week's Progress"
                        unit="min"
                        showPercentage={true}
                        height="md"
                      />
                    </div>
                  )}

                  {/* Guidelines */}
                  <div className="space-y-3">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="font-medium text-sm text-green-900 mb-1">Moderate Exercise</p>
                      <p className="text-2xl font-bold text-green-700 mb-1">300+ min/week</p>
                      <p className="text-xs text-green-700">~43 minutes daily</p>
                      <p className="text-xs text-gray-600 mt-2">
                        Brisk walking, cycling, swimming, dancing
                      </p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="font-medium text-sm text-orange-900 mb-1">Vigorous Exercise</p>
                      <p className="text-2xl font-bold text-orange-700 mb-1">150+ min/week</p>
                      <p className="text-xs text-orange-700">~22 minutes daily</p>
                      <p className="text-xs text-gray-600 mt-2">
                        Running, HIIT, sports, intense cycling
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="font-medium text-sm text-purple-900 mb-1">Strength Training</p>
                      <p className="text-2xl font-bold text-purple-700 mb-1">2+ days/week</p>
                      <p className="text-xs text-gray-600 mt-2">
                        All major muscle groups
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts Section */}
        {entries.length > 0 && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Exercise Trends</CardTitle>
                    <CardDescription>
                      Your workout patterns and progress
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={chartView === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setChartView('all')}
                    >
                      All
                    </Button>
                    <Button
                      variant={chartView === 'weekly' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setChartView('weekly')}
                    >
                      Weekly
                    </Button>
                    <Button
                      variant={chartView === 'types' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setChartView('types')}
                    >
                      Types
                    </Button>
                    <Button
                      variant={chartView === 'energy' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setChartView('energy')}
                    >
                      Energy
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ExerciseSummaryChart entries={entries} type={chartView} isLoading={isLoading} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Entries or Empty State */}
        <div className="mb-8">
          {entries.length === 0 ? (
            <EmptyState
              icon={<Dumbbell className="w-12 h-12 text-orange-500" />}
              title="Log your first workout"
              description="Start tracking your exercise to see patterns, monitor progress, and understand how workouts affect your energy. WHO recommends 300+ minutes per week."
              action={{
                label: "Log Workout →",
                onClick: scrollToForm
              }}
            />
          ) : (
            <RecentExerciseEntries entries={entries} limit={5} />
          )}
        </div>

        {/* EMAL Exercise Science */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Exercise Science (EMAL Model)</CardTitle>
            <CardDescription>
              Understanding exercise's role in energy management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">🔬</span>
                Mitochondrial Growth
              </h3>
              <p className="text-sm text-gray-600">
                Regular exercise stimulates mitochondrial biogenesis - the creation of new mitochondria
                in your cells. More mitochondria means more efficient energy production from food.
                This is why trained athletes can sustain high energy output for longer periods.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">⚙️</span>
                Metabolic Compensation
              </h3>
              <p className="text-sm text-gray-600">
                Your body adapts to regular exercise by becoming more metabolically efficient.
                This means your baseline metabolic functions (breathing, circulation, digestion)
                require less energy, leaving more available for activities and cognitive function.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">🧠</span>
                Neurochemical Benefits
              </h3>
              <p className="text-sm text-gray-600">
                Exercise triggers release of endorphins (natural painkillers), dopamine (motivation
                and reward), serotonin (mood regulation), and BDNF (brain-derived neurotrophic factor)
                which supports neuron growth and cognitive function.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">⏰</span>
                Timing Matters
              </h3>
              <p className="text-sm text-gray-600">
                Exercise can boost energy levels for 2-4 hours afterward, but intense exercise
                within 2-3 hours of bedtime may interfere with sleep. Morning or afternoon workouts
                are ideal for most people.
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg mt-4">
              <p className="font-medium text-sm mb-2">💡 Pro Tip: Exercise-Energy Connection</p>
              <p className="text-sm text-gray-700">
                Track your energy levels before and after exercise to discover which types and
                intensities boost your energy most effectively. Most people find moderate exercise
                provides the best immediate energy boost, while vigorous exercise may temporarily
                reduce energy but improves overall capacity over time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
