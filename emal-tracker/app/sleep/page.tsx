'use client'

import { useEffect, useState, useRef } from 'react'
import { Moon } from 'lucide-react'
import { useSleepStore } from '@/store/sleepStore'
import { SleepLogForm } from '@/components/forms/SleepLogForm'
import { SleepQualityChart } from '@/components/charts/SleepQualityChart'
import { RecentSleepEntries } from '@/components/charts/RecentSleepEntries'
import { EmptyState } from '@/components/health/EmptyState'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SleepPage() {
  const { entries, loadEntries } = useSleepStore()
  const [isLoading, setIsLoading] = useState(true)
  const [chartView, setChartView] = useState<'combined' | 'duration' | 'quality'>('combined')
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading sleep data...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sleep Tracking
          </h1>
          <p className="text-gray-600 mb-4">
            Track your sleep quality and discover patterns for better rest. Recommended: 7-9 hours per night.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/sleep/tips">💡 Sleep Tips</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/sleep/insights">📊 Insights</Link>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Sleep Log Form */}
          <div ref={formRef}>
            <SleepLogForm />
          </div>

          {/* Quick Stats & Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why Track Sleep?</CardTitle>
                <CardDescription>
                  Sleep is crucial for energy management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💾</div>
                  <div>
                    <p className="font-medium text-sm">Memory Consolidation</p>
                    <p className="text-xs text-gray-600">
                      Sleep helps consolidate memories and learning
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <p className="font-medium text-sm">Energy Savings</p>
                    <p className="text-xs text-gray-600">
                      Sleep saves 30-50% of daily energy expenditure
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🧹</div>
                  <div>
                    <p className="font-medium text-sm">Brain Detox</p>
                    <p className="text-xs text-gray-600">
                      Glymphatic system removes toxins during sleep
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <p className="font-medium text-sm">Consistency Matters</p>
                    <p className="text-xs text-gray-600">
                      Regular sleep schedule improves quality
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Keep consistent sleep/wake times
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Get morning sunlight exposure
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Keep bedroom cool (15-19°C)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-600">✗</span>
                    Avoid caffeine after 2pm
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-600">✗</span>
                    No screens 1h before bed
                  </li>
                </ul>
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
                    <CardTitle>Sleep Trends</CardTitle>
                    <CardDescription>
                      Your sleep patterns over the last 14 days
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={chartView === 'combined' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setChartView('combined')}
                    >
                      Both
                    </Button>
                    <Button
                      variant={chartView === 'duration' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setChartView('duration')}
                    >
                      Duration
                    </Button>
                    <Button
                      variant={chartView === 'quality' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setChartView('quality')}
                    >
                      Quality
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <SleepQualityChart entries={entries} type={chartView} isLoading={isLoading} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Entries or Empty State */}
        <div className="mb-8">
          {entries.length === 0 ? (
            <EmptyState
              icon={<Moon className="w-12 h-12 text-purple-500" />}
              title="Start tracking your sleep"
              description="Log your first sleep entry to discover patterns and optimize your rest. Aim for 7-9 hours per night for optimal energy."
              action={{
                label: "Log Sleep →",
                onClick: scrollToForm
              }}
            />
          ) : (
            <RecentSleepEntries entries={entries} limit={5} />
          )}
        </div>

        {/* EMAL Sleep Science */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Sleep Science (EMAL Model)</CardTitle>
            <CardDescription>
              Understanding sleep's role in energy management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">😴</span>
                Recommended Duration: 7-9 Hours
              </h3>
              <p className="text-sm text-gray-600">
                Individual needs vary, but most adults function best with 7-9 hours. Less than 6 hours
                significantly impacts cognitive function and energy levels.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">🔋</span>
                Energy Conservation
              </h3>
              <p className="text-sm text-gray-600">
                During sleep, your body reduces energy consumption by 30-50%. This allows resources to
                be redirected to cellular repair, immune function, and memory consolidation.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">🧠</span>
                Glymphatic System
              </h3>
              <p className="text-sm text-gray-600">
                The brain's waste clearance system is most active during sleep, removing metabolic
                byproducts and toxins that accumulate during waking hours.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">📅</span>
                Consistency is Key
              </h3>
              <p className="text-sm text-gray-600">
                Maintaining a consistent sleep schedule (even on weekends) helps regulate your
                circadian rhythm, improving sleep quality and daytime energy levels.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <p className="font-medium text-sm mb-2">💡 Pro Tip: Sleep-Energy Connection</p>
              <p className="text-sm text-gray-700">
                Track both your sleep and energy levels to discover how different sleep durations
                and quality affect your next-day energy. Most people find their optimal sleep
                duration through consistent tracking.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
