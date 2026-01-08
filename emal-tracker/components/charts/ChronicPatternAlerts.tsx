"use client"

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { ConflictPattern } from '@/types/allostasis'
import { filterConflictsByType, getSeverityIcon, getSeverityColor, getPatternDisplayName, getPatternRecommendations } from '@/lib/allostasis/conflicts'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface ChronicPatternAlertsProps {
  patterns: ConflictPattern[]
}

/**
 * Chronic Pattern Alerts Component
 * Shows long-term patterns that need attention
 */
export function ChronicPatternAlerts({ patterns }: ChronicPatternAlertsProps) {
  const chronicPatterns = filterConflictsByType(patterns, 'chronic')

  if (chronicPatterns.length === 0) {
    return (
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-center gap-3">
          <span className="text-3xl">✅</span>
          <div>
            <h3 className="font-semibold text-green-900">No Chronic Patterns Detected</h3>
            <p className="text-sm text-green-700 mt-1">
              Great! No sustained imbalances have been detected in the last 60 days.
              Keep maintaining your current balance.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 border-orange-400 border-2">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-4xl">🔥</span>
        <div className="flex-1">
          <h3 className="font-semibold text-orange-900 text-xl">
            Chronic Patterns Detected
          </h3>
          <p className="text-orange-800 text-sm mt-1">
            {chronicPatterns.length} long-term pattern{chronicPatterns.length > 1 ? 's' : ''} requiring attention
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {chronicPatterns.map((pattern) => (
          <ChronicPatternCard key={pattern.id} pattern={pattern} />
        ))}
      </div>

      {/* Overall Warning */}
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">
          <strong>⚠️ Important:</strong> Chronic patterns indicate sustained imbalance that can lead to
          burnout, illness, or decreased quality of life. Consider consulting with a healthcare provider
          or mental health professional for personalized support.
        </p>
      </div>
    </Card>
  )
}

/**
 * Individual chronic pattern card
 */
function ChronicPatternCard({ pattern }: { pattern: ConflictPattern }) {
  const severityColor = getSeverityColor(pattern.severity)
  const recommendations = getPatternRecommendations(pattern.pattern)

  return (
    <div
      className="bg-white rounded-lg border-2 p-4"
      style={{ borderColor: severityColor }}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{getSeverityIcon(pattern.severity)}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-900">
              {getPatternDisplayName(pattern.pattern)}
            </h4>
            <span
              className="text-xs px-2 py-1 rounded font-semibold uppercase"
              style={{
                backgroundColor: severityColor + '20',
                color: severityColor,
              }}
            >
              {pattern.severity}
            </span>
          </div>

          <p className="text-sm text-gray-700 mb-2">
            {pattern.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>📅 Duration: <strong>{pattern.duration} days</strong></span>
            <span>📊 Detected: {new Date(pattern.detectedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Recommendations Accordion */}
      <Accordion type="single" collapsible className="mt-3">
        <AccordionItem value="recommendations" className="border-0">
          <AccordionTrigger className="text-sm font-semibold text-blue-600 hover:no-underline py-2">
            View Recommendations
          </AccordionTrigger>
          <AccordionContent>
            <div className="bg-blue-50 rounded-lg p-3 mt-2">
              <ul className="space-y-2 text-sm text-gray-700">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>

              {pattern.pattern === 'brain_fog' && (
                <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded">
                  <p className="text-xs text-red-800 font-semibold">
                    ⚕️ This pattern has persisted for 60+ days. Please consult a healthcare provider
                    for evaluation. This could indicate an underlying condition requiring treatment.
                  </p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
