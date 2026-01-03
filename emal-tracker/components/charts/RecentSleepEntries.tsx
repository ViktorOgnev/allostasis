'use client'

import { format } from 'date-fns'
import type { SleepEntry } from '@/types/sleep'
import { Card } from '@/components/ui/card'

interface RecentSleepEntriesProps {
  entries: SleepEntry[]
  limit?: number
}

const qualityEmojis = {
  1: '😫',
  2: '😟',
  3: '😐',
  4: '😊',
  5: '⭐',
}

const moodEmojis = {
  refreshed: '🌟',
  okay: '👍',
  groggy: '😴',
  exhausted: '😩',
}

const moodLabels = {
  refreshed: 'Refreshed',
  okay: 'Okay',
  groggy: 'Groggy',
  exhausted: 'Exhausted',
}

export function RecentSleepEntries({ entries, limit = 5 }: RecentSleepEntriesProps) {
  // Sort by date descending and take the most recent
  const recentEntries = [...entries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)

  if (recentEntries.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Recent Sleep Logs</h3>
        <p className="text-sm text-gray-500 text-center py-8">
          No sleep entries yet. Log your first night!
        </p>
      </Card>
    )
  }

  const getDurationColor = (hours: number) => {
    if (hours < 6) return 'text-red-600 bg-red-50'
    if (hours < 7) return 'text-yellow-600 bg-yellow-50'
    if (hours <= 9) return 'text-green-600 bg-green-50'
    return 'text-blue-600 bg-blue-50'
  }

  const getQualityColor = (quality: number) => {
    if (quality <= 2) return 'text-red-600 bg-red-50'
    if (quality === 3) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Recent Sleep Logs</h3>
      <div className="space-y-3">
        {recentEntries.map((entry) => (
          <div
            key={entry.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-medium text-sm">
                  {format(new Date(entry.date), 'EEEE, MMM dd')}
                </p>
                <p className="text-xs text-gray-500">
                  {format(new Date(entry.bedtime), 'h:mm a')} → {format(new Date(entry.wakeTime), 'h:mm a')}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full font-semibold text-sm ${getDurationColor(entry.duration)}`}>
                {entry.duration.toFixed(1)}h
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Quality */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Quality:</span>
                <div className={`flex items-center gap-1 px-2 py-1 rounded ${getQualityColor(entry.quality)}`}>
                  <span className="text-sm">{qualityEmojis[entry.quality]}</span>
                  <span className="text-xs font-medium">{entry.quality}/5</span>
                </div>
              </div>

              {/* Mood */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Mood:</span>
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-gray-100">
                  <span className="text-sm">{moodEmojis[entry.mood]}</span>
                  <span className="text-xs font-medium">{moodLabels[entry.mood]}</span>
                </div>
              </div>
            </div>

            {/* Additional details */}
            {(entry.interruptions !== undefined || entry.fellAsleepTime !== undefined) && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex gap-4 text-xs text-gray-600">
                {entry.fellAsleepTime !== undefined && (
                  <span>💤 Fell asleep in {entry.fellAsleepTime}min</span>
                )}
                {entry.interruptions !== undefined && entry.interruptions > 0 && (
                  <span>🌙 {entry.interruptions} interruption{entry.interruptions > 1 ? 's' : ''}</span>
                )}
              </div>
            )}

            {/* Factors */}
            {entry.factors && Object.values(entry.factors).some(v => v) && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-600 mb-2">Factors:</p>
                <div className="flex flex-wrap gap-2">
                  {entry.factors.caffeine && (
                    <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">☕ Caffeine</span>
                  )}
                  {entry.factors.alcohol && (
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">🍷 Alcohol</span>
                  )}
                  {entry.factors.lateExercise && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">🏃 Late Exercise</span>
                  )}
                  {entry.factors.screenTime && (
                    <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded">📱 Screen Time</span>
                  )}
                  {entry.factors.stress && (
                    <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">😰 Stress</span>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {entry.notes && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-700 italic">"{entry.notes}"</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
