"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import { useAllostaticStore } from '@/store/allostaticStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { sALITrendChart } from '@/components/charts/sALITrendChart'
import { CombinedMetricsChart } from '@/components/charts/CombinedMetricsChart'
import { WeightBreakdownChart } from '@/components/charts/WeightBreakdownChart'
import { InterpretableFeedback } from '@/components/charts/InterpretableFeedback'
import { ChronicPatternAlerts } from '@/components/charts/ChronicPatternAlerts'
import { getCalculationStatus } from '@/lib/allostasis/calculations'
import { getsALILevel, getsALIColor, getsALIDescription, getsALIEmoji } from '@/lib/allostasis/sali'

/**
 * Allostasis Insights Page
 * Main analytics dashboard for allostatic load tracking
 */
export default function AllostatisInsightsPage() {
  const { entries, sALIHistory, currentWeights, conflicts, loadEntries } = useAllostaticStore()

  // Load data on mount
  useEffect(() => {
    loadEntries()
  }, [loadEntries])

  const status = getCalculationStatus(entries.length)
  const latestSALI = sALIHistory[sALIHistory.length - 1]

  // Show onboarding if not enough data
  if (!status.canCalculate) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="p-8 text-center">
            <div className="mb-6">
              <span className="text-6xl">📊</span>
            </div>

            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              Building Your Baseline
            </h1>

            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              The Allostasis system needs at least 7 days of data to calculate adaptive weights
              and show meaningful insights about your wellbeing patterns.
            </p>

            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 text-4xl font-bold text-blue-600 mb-2">
                <span>{entries.length}</span>
                <span className="text-2xl text-gray-400">/</span>
                <span className="text-2xl text-gray-600">7</span>
              </div>
              <p className="text-sm text-gray-500">
                {status.message}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-3 mb-6">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${status.progressPercentage}%` }}
              />
            </div>

            <Button asChild size="lg">
              <Link href="/log">Add Today's Check-In</Link>
            </Button>

            {/* Why 7 Days? */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg text-left max-w-2xl mx-auto">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <span>💡</span>
                Why 7 days?
              </h3>
              <p className="text-sm text-blue-800">
                The system uses a week of data to calculate meaningful correlations between your
                metrics and energy levels. This baseline allows the adaptive weight algorithm to
                identify which factors (sleep, stress, etc.) most impact your wellbeing. More data
                = better insights!
              </p>
            </div>
          </Card>
        </div>
      </main>
    )
  }

  // Main insights dashboard
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Allostasis Insights</h1>
          <p className="text-gray-600">
            Adaptive analysis of your wellbeing patterns based on {entries.length} check-ins
          </p>
        </div>

        {/* Current sALI Score Card */}
        {latestSALI && (
          <Card className="mb-8 border-2" style={{ borderColor: getsALIColor(latestSALI.rawSALI) }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Allostatic Load</span>
                <span className="text-5xl">{getsALIEmoji(latestSALI.rawSALI)}</span>
              </CardTitle>
              <CardDescription>
                Lower is better - measures cumulative strain on your system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Raw sALI</div>
                  <div
                    className="text-4xl font-bold"
                    style={{ color: getsALIColor(latestSALI.rawSALI) }}
                  >
                    {latestSALI.rawSALI.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 uppercase">
                    {getsALILevel(latestSALI.rawSALI)}
                  </div>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">7-Day Trend</div>
                  <div className="text-4xl font-bold text-blue-600">
                    {latestSALI.sALI_EMA7.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Short-term pattern
                  </div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">28-Day Trend</div>
                  <div className="text-4xl font-bold text-purple-600">
                    {latestSALI.sALI_EMA28.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Long-term pattern
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-700 text-center">
                {getsALIDescription(latestSALI.rawSALI)}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Chronic Pattern Alerts */}
        <div className="mb-8">
          <ChronicPatternAlerts patterns={conflicts} />
        </div>

        {/* sALI Trend Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Allostatic Load Over Time</CardTitle>
            <CardDescription>
              Track how your system strain changes. Lower values indicate better balance and recovery.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <sALITrendChart data={sALIHistory} />
          </CardContent>
        </Card>

        {/* Combined Metrics Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>All Metrics Overview</CardTitle>
            <CardDescription>
              See how your 5 core metrics evolve together. Energy (thick blue line) is the anchor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CombinedMetricsChart data={entries} />
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Weight Breakdown */}
          {currentWeights && (
            <Card>
              <CardHeader>
                <CardTitle>Current Metric Weights</CardTitle>
                <CardDescription>
                  Based on last {currentWeights.dataWindow.entryCount} entries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WeightBreakdownChart weights={currentWeights} />

                <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
                  <p className="font-semibold mb-1">Weights are calculated from:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• <strong>Impact:</strong> Correlation with energy (Spearman ρ)</li>
                    <li>• <strong>Volatility:</strong> How much the metric varies (σ)</li>
                    <li>• <strong>Imbalance:</strong> Active conflict pattern multiplier</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Interpretable Feedback */}
          {currentWeights && (
            <div>
              <InterpretableFeedback weights={currentWeights} conflicts={conflicts} />
            </div>
          )}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Keep building your insights
                </h3>
                <p className="text-sm text-gray-600">
                  Daily check-ins help the system learn and provide better personalized feedback
                </p>
              </div>
              <Button asChild>
                <Link href="/log">Add Check-In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
