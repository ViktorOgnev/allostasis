"use client"

import { format } from 'date-fns'
import { toast } from 'sonner'
import type { EnergyEntry } from '@/types/energy'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useEnergyStore } from '@/store/energyStore'
import { getDateLabel, getTimeLabel } from '@/lib/dateUtils'

interface RecentEntriesProps {
  entries: EnergyEntry[]
  limit?: number
}

export function RecentEntries({ entries, limit = 5 }: RecentEntriesProps) {
  const deleteEntry = useEnergyStore((state) => state.deleteEntry)

  const recentEntries = entries
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)

  const getEnergyColor = (level: number) => {
    if (level <= 3) return 'bg-red-100 text-red-700 border-red-200'
    if (level <= 7) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    return 'bg-green-100 text-green-700 border-green-200'
  }

  const getMoodEmoji = (mood: EnergyEntry['mood']) => {
    const emojiMap = {
      excellent: '😄',
      good: '🙂',
      neutral: '😐',
      low: '😔',
      exhausted: '😫',
    }
    return emojiMap[mood]
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this energy entry? This cannot be undone.')) {
      try {
        await deleteEntry(id)
        toast.success('Entry deleted successfully')
      } catch (error) {
        toast.error('Failed to delete entry')
        console.error(error)
      }
    }
  }

  const handleEdit = (id: string) => {
    // For now, just notify - full edit functionality would require a modal/form
    toast.info('Edit functionality coming soon! For now, you can delete and re-create the entry.')
  }

  if (recentEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
          <CardDescription>Your latest energy logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            No entries yet. Log your first energy level!
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Entries</CardTitle>
        <CardDescription>Your latest energy logs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition group"
            >
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full border font-bold ${getEnergyColor(entry.energyLevel)}`}>
                  {entry.energyLevel}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium capitalize">{entry.mood}</span>
                    <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {getDateLabel(new Date(entry.date))} at {getTimeLabel(new Date(entry.timestamp))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {entry.notes && (
                  <div className="text-sm text-gray-600 max-w-xs truncate">
                    "{entry.notes}"
                  </div>
                )}

                {/* Edit/Delete buttons - visible on hover */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(entry.id)}
                    className="h-8 px-2"
                    title="Edit entry"
                  >
                    ✏️
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(entry.id)}
                    className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="Delete entry"
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
