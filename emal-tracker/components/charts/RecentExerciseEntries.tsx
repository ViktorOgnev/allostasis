'use client'

import { format } from 'date-fns'
import type { ExerciseEntry } from '@/types/exercise'
import { Card } from '@/components/ui/card'

interface RecentExerciseEntriesProps {
  entries: ExerciseEntry[]
  limit?: number
}

const typeEmojis = {
  cardio: '🏃',
  strength: '💪',
  flexibility: '🧘',
  walking: '🚶',
  sports: '⚽',
  other: '🏋️',
}

const typeLabels = {
  cardio: 'Cardio',
  strength: 'Strength Training',
  flexibility: 'Flexibility',
  walking: 'Walking',
  sports: 'Sports',
  other: 'Other',
}

const intensityEmojis = {
  low: '🟢',
  moderate: '🟡',
  high: '🟠',
  vigorous: '🔴',
}

const intensityLabels = {
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
  vigorous: 'Vigorous',
}

export function RecentExerciseEntries({ entries, limit = 5 }: RecentExerciseEntriesProps) {
  // Sort by date descending and take the most recent
  const recentEntries = [...entries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)

  if (recentEntries.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Recent Workouts</h3>
        <p className="text-sm text-gray-500 text-center py-8">
          No exercise entries yet. Log your first workout!
        </p>
      </Card>
    )
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'text-green-600 bg-green-50'
      case 'moderate': return 'text-yellow-600 bg-yellow-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'vigorous': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getDurationColor = (minutes: number) => {
    if (minutes >= 60) return 'text-green-600 bg-green-50'
    if (minutes >= 30) return 'text-blue-600 bg-blue-50'
    return 'text-gray-600 bg-gray-50'
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Recent Workouts</h3>
      <div className="space-y-3">
        {recentEntries.map((entry) => {
          const energyChange = entry.energyAfter !== undefined && entry.energyBefore !== undefined
            ? entry.energyAfter - entry.energyBefore
            : null

          return (
            <div
              key={entry.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{typeEmojis[entry.type]}</span>
                  <div>
                    <p className="font-medium text-sm">{typeLabels[entry.type]}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(entry.date), 'EEEE, MMM dd')}
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full font-semibold text-sm ${getDurationColor(entry.duration)}`}>
                  {entry.duration} min
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                {/* Intensity */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Intensity:</span>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded ${getIntensityColor(entry.intensity)}`}>
                    <span className="text-sm">{intensityEmojis[entry.intensity]}</span>
                    <span className="text-xs font-medium">{intensityLabels[entry.intensity]}</span>
                  </div>
                </div>

                {/* Energy Change */}
                {energyChange !== null && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Energy:</span>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded ${
                      energyChange > 0 ? 'bg-green-50 text-green-700' :
                      energyChange < 0 ? 'bg-red-50 text-red-700' :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      {energyChange > 0 && <span className="text-xs font-medium">↑ +{energyChange}</span>}
                      {energyChange === 0 && <span className="text-xs font-medium">→ 0</span>}
                      {energyChange < 0 && <span className="text-xs font-medium">↓ {energyChange}</span>}
                    </div>
                  </div>
                )}
              </div>

              {/* Energy Before/After Details */}
              {entry.energyBefore !== undefined && entry.energyAfter !== undefined && (
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-xs">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">
                        Before: <span className="font-medium text-orange-600">{entry.energyBefore}/10</span>
                      </span>
                      <span className="text-gray-600">
                        After: <span className="font-medium text-green-600">{entry.energyAfter}/10</span>
                      </span>
                    </div>
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
          )
        })}
      </div>
    </Card>
  )
}
