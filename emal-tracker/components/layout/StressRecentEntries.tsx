"use client"

import { format } from 'date-fns'
import type { StressLevelEntry } from '@/types/stress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { colors } from '@/app/design-tokens/colors'

interface StressRecentEntriesProps {
  entries: StressLevelEntry[]
  limit?: number
}

export function StressRecentEntries({ entries, limit = 10 }: StressRecentEntriesProps) {
  const recentEntries = entries
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)

  const getStressColor = (level: number) => {
    if (level <= 2) return 'bg-blue-100 text-blue-700 border-blue-200'
    if (level <= 4) return 'bg-blue-200 text-blue-800 border-blue-300'
    if (level <= 6) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    if (level <= 8) return 'bg-orange-100 text-orange-700 border-orange-200'
    return 'bg-red-100 text-red-700 border-red-200'
  }

  const getStressEmoji = (level: number) => {
    if (level <= 2) return '😌'
    if (level <= 4) return '😐'
    if (level <= 6) return '😰'
    if (level <= 8) return '😫'
    return '🤯'
  }

  const getTimeOfDayEmoji = (timeOfDay: string) => {
    switch (timeOfDay) {
      case 'morning': return '🌅'
      case 'afternoon': return '☀️'
      case 'evening': return '🌙'
      default: return '⏰'
    }
  }

  if (recentEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Stress Logs</CardTitle>
          <CardDescription>Your stress level history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            No stress entries yet. Log your first stress level to start tracking!
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Stress Logs</CardTitle>
        <CardDescription>Your latest {limit} stress entries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentEntries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
            >
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full border font-bold text-lg ${getStressColor(entry.stressLevel)}`}>
                    {getStressEmoji(entry.stressLevel)} {entry.stressLevel}/10
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      {getTimeOfDayEmoji(entry.timeOfDay)}
                      <span className="capitalize">{entry.timeOfDay}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(entry.date), 'MMM dd, yyyy')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stressors */}
              {entry.stressors.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs font-medium text-gray-600 mb-1">Stressors:</div>
                  <div className="flex flex-wrap gap-1">
                    {entry.stressors.map((stressor, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded capitalize"
                      >
                        {stressor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Physical Symptoms */}
              {entry.physicalSymptoms && entry.physicalSymptoms.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs font-medium text-gray-600 mb-1">Physical Symptoms:</div>
                  <div className="flex flex-wrap gap-1">
                    {entry.physicalSymptoms.map((symptom, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded capitalize"
                      >
                        {symptom.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Coping Strategies */}
              {entry.copingStrategies.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs font-medium text-gray-600 mb-1">Coping Strategies:</div>
                  <div className="flex flex-wrap gap-1">
                    {entry.copingStrategies.map((strategy, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded capitalize"
                      >
                        {strategy.strategy.replace('_', ' ')}
                        {strategy.duration && ` (${strategy.duration}m)`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {entry.notes && (
                <div className="mt-2 text-sm text-gray-600 italic border-l-2 border-gray-300 pl-3">
                  "{entry.notes}"
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
