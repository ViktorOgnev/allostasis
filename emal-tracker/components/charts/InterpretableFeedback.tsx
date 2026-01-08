"use client"

import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import type { WeightState, ConflictPattern } from '@/types/allostasis'
import { getTopMetric, getMetricDisplayName, getMetricsByWeight } from '@/lib/allostasis/weights'
import { filterConflictsByType, getSeverityIcon } from '@/lib/allostasis/conflicts'

interface InterpretableFeedbackProps {
  weights: WeightState
  conflicts: ConflictPattern[]
}

/**
 * Interpretable Feedback Component
 * Provides human-readable insights about what's affecting wellbeing
 */
export function InterpretableFeedback({ weights, conflicts }: InterpretableFeedbackProps) {
  const topMetric = useMemo(() => getTopMetric(weights), [weights])
  const rankedMetrics = useMemo(() => getMetricsByWeight(weights), [weights])
  const acuteConflicts = useMemo(() => filterConflictsByType(conflicts, 'acute'), [conflicts])

  // Get metric icon
  const getMetricIcon = (metric: string) => {
    const icons: Record<string, string> = {
      sleepRecovery: '💤',
      physicalLoad: '🏃',
      recoveryFromLoad: '💪',
      psychologicalStress: '😰',
      energyLevel: '⚡',
    }
    return icons[metric] || '📊'
  }

  // Get metric color
  const getMetricColor = (metric: string) => {
    const colors: Record<string, string> = {
      sleepRecovery: '#A855F7',
      physicalLoad: '#10B981',
      recoveryFromLoad: '#06B6D4',
      psychologicalStress: '#F97316',
      energyLevel: '#3B82F6',
    }
    return colors[metric] || '#6B7280'
  }

  return (
    <div className="space-y-4">
      {/* Primary Insight Card */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-4xl">💡</span>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2 text-lg">
              What's Driving Your Wellbeing?
            </h3>
            <p className="text-blue-800 mb-3">
              Based on the last 28 days of data, <strong style={{ color: getMetricColor(topMetric.metric) }}>
                {getMetricIcon(topMetric.metric)} {getMetricDisplayName(topMetric.metric)}
              </strong> has the biggest impact on your energy, accounting for{' '}
              <strong>{topMetric.percentage.toFixed(0)}%</strong> of the weight in calculating your allostatic load.
            </p>

            <div className="bg-white/50 rounded-lg p-3 text-sm">
              <p className="font-semibold text-blue-900 mb-2">Why this matters:</p>
              <p className="text-blue-700">
                {getMetricExplanation(topMetric.metric)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Weight Rankings */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>📊</span>
          Impact Rankings
        </h3>

        <div className="space-y-3">
          {rankedMetrics.map((item, index) => (
            <div key={item.metric} className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-semibold text-sm">
                #{index + 1}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 flex items-center gap-2">
                    <span>{getMetricIcon(item.metric)}</span>
                    {getMetricDisplayName(item.metric)}
                  </span>
                  <span className="font-bold" style={{ color: getMetricColor(item.metric) }}>
                    {item.percentage.toFixed(0)}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: getMetricColor(item.metric),
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Acute Conflicts Alert */}
      {acuteConflicts.length > 0 && (
        <Card className="p-6 border-orange-300 bg-orange-50">
          <div className="flex items-start gap-3">
            <span className="text-3xl">⚠️</span>
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 mb-2">
                Active Imbalances Detected
              </h3>
              <p className="text-orange-800 text-sm mb-3">
                The system detected {acuteConflicts.length} pattern{acuteConflicts.length > 1 ? 's' : ''} that may need attention:
              </p>

              <div className="space-y-2">
                {acuteConflicts.map((conflict) => (
                  <div
                    key={conflict.id}
                    className="bg-white rounded-lg p-3 border border-orange-200"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{getSeverityIcon(conflict.severity)}</span>
                      <span className="font-semibold text-orange-900 text-sm">
                        {conflict.description}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 ml-6">
                      Affected metrics: {conflict.affectedMetrics.map(m =>
                        getMetricDisplayName(m as any)
                      ).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Actionable Recommendations */}
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-start gap-3">
          <span className="text-3xl">💚</span>
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 mb-2">
              What You Can Do
            </h3>
            <div className="text-green-800 text-sm space-y-2">
              {getRecommendations(topMetric.metric, acuteConflicts).map((rec, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <p>{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

/**
 * Get explanation for why a metric matters
 */
function getMetricExplanation(metric: string): string {
  const explanations: Record<string, string> = {
    sleepRecovery: 'Sleep quality strongly correlates with your energy. Your body uses sleep to recover and restore. Focus on consistent sleep schedule and quality rest.',
    physicalLoad: 'Physical demands are a major factor in your energy. Your system is sensitive to activity levels - balance exertion with adequate recovery.',
    recoveryFromLoad: 'How well you recover from physical demands drives your energy. Your body needs sufficient time and resources to bounce back from activity.',
    psychologicalStress: 'Mental and emotional stress significantly impacts your energy. Your nervous system is highly responsive to psychological demands.',
    energyLevel: 'Energy is the anchor metric - it reflects your overall state. All other factors contribute to this foundational measure of vitality.',
  }
  return explanations[metric] || 'This metric shows strong correlation with your overall wellbeing.'
}

/**
 * Get actionable recommendations based on top metric and conflicts
 */
function getRecommendations(topMetric: string, conflicts: ConflictPattern[]): string[] {
  const baseRecommendations: Record<string, string[]> = {
    sleepRecovery: [
      'Maintain consistent sleep schedule (same bedtime/wake time)',
      'Create a relaxing bedtime routine',
      'Limit screen time 1 hour before sleep',
      'Ensure bedroom is dark, cool, and quiet',
    ],
    physicalLoad: [
      'Balance high-intensity days with active recovery',
      'Listen to your body - rest when needed',
      'Track load to avoid sudden spikes',
      'Gradually increase activity levels',
    ],
    recoveryFromLoad: [
      'Prioritize sleep on high-activity days',
      'Consider nutrition timing around workouts',
      'Use active recovery techniques (walking, stretching)',
      'Schedule rest days strategically',
    ],
    psychologicalStress: [
      'Practice daily stress management (meditation, breathing)',
      'Identify and address chronic stressors',
      'Set boundaries to protect recovery time',
      'Consider professional support if stress persists',
    ],
    energyLevel: [
      'Focus on all factors holistically',
      'Track patterns to identify energy drains',
      'Protect your energy with boundaries',
      'Experiment to find what energizes you',
    ],
  }

  let recommendations = [...(baseRecommendations[topMetric] || baseRecommendations.energyLevel)]

  // Add conflict-specific recommendations
  if (conflicts.length > 0) {
    const highLoadLowRecovery = conflicts.find(c => c.pattern === 'high_load_low_recovery')
    if (highLoadLowRecovery) {
      recommendations = [
        'URGENT: Take a rest day or significantly reduce activity',
        ...recommendations,
      ]
    }

    const poorSleepHighStress = conflicts.find(c => c.pattern === 'poor_sleep_high_stress')
    if (poorSleepHighStress) {
      recommendations = [
        'PRIORITY: Address sleep quality - stress may be interfering',
        ...recommendations,
      ]
    }
  }

  return recommendations.slice(0, 4) // Return top 4
}
