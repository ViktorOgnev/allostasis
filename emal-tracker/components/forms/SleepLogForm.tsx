"use client"

import { useState } from 'react'
import { useSleepStore } from '@/store/sleepStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { SleepQuality, SleepMood } from '@/types/sleep'
import { calculateSleepDuration } from '@/lib/utils'

const qualityOptions: { value: SleepQuality; label: string; emoji: string }[] = [
  { value: 5, label: 'Excellent', emoji: '⭐' },
  { value: 4, label: 'Good', emoji: '😊' },
  { value: 3, label: 'Fair', emoji: '😐' },
  { value: 2, label: 'Poor', emoji: '😟' },
  { value: 1, label: 'Very Poor', emoji: '😫' },
]

const moodOptions: { value: SleepMood; label: string; emoji: string }[] = [
  { value: 'refreshed', label: 'Refreshed', emoji: '🌟' },
  { value: 'okay', label: 'Okay', emoji: '👍' },
  { value: 'groggy', label: 'Groggy', emoji: '😴' },
  { value: 'exhausted', label: 'Exhausted', emoji: '😩' },
]

export function SleepLogForm() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [bedtime, setBedtime] = useState('22:00')
  const [wakeTime, setWakeTime] = useState('07:00')
  const [quality, setQuality] = useState<SleepQuality>(3)
  const [mood, setMood] = useState<SleepMood>('okay')
  const [interruptions, setInterruptions] = useState<number>(0)
  const [fellAsleepTime, setFellAsleepTime] = useState<number>(15)
  const [notes, setNotes] = useState('')

  // Factors
  const [hadCaffeine, setHadCaffeine] = useState(false)
  const [hadAlcohol, setHadAlcohol] = useState(false)
  const [lateExercise, setLateExercise] = useState(false)
  const [screenTime, setScreenTime] = useState(false)
  const [stress, setStress] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const addEntry = useSleepStore((state) => state.addEntry)

  // Calculate duration for preview
  const getCalculatedDuration = () => {
    const bedDateTime = new Date(`${date}T${bedtime}`)
    let wakeDateTime = new Date(`${date}T${wakeTime}`)

    // If wake time is earlier than bedtime, assume next day
    if (wakeDateTime <= bedDateTime) {
      wakeDateTime.setDate(wakeDateTime.getDate() + 1)
    }

    return calculateSleepDuration(bedDateTime, wakeDateTime)
  }

  const duration = getCalculatedDuration()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const bedDateTime = new Date(`${date}T${bedtime}`)
      let wakeDateTime = new Date(`${date}T${wakeTime}`)

      if (wakeDateTime <= bedDateTime) {
        wakeDateTime.setDate(wakeDateTime.getDate() + 1)
      }

      await addEntry({
        date: new Date(date),
        bedtime: bedDateTime,
        wakeTime: wakeDateTime,
        quality,
        mood,
        interruptions: interruptions || undefined,
        fellAsleepTime: fellAsleepTime || undefined,
        notes: notes || undefined,
        factors: {
          caffeine: hadCaffeine || undefined,
          alcohol: hadAlcohol || undefined,
          lateExercise: lateExercise || undefined,
          screenTime: screenTime || undefined,
          stress: stress || undefined,
        },
      })

      alert('Sleep log saved successfully!')

      // Reset some fields but keep date
      setQuality(3)
      setMood('okay')
      setInterruptions(0)
      setFellAsleepTime(15)
      setNotes('')
      setHadCaffeine(false)
      setHadAlcohol(false)
      setLateExercise(false)
      setScreenTime(false)
      setStress(false)
    } catch (error) {
      console.error('Error adding sleep entry:', error)
      alert('Failed to log sleep')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getQualityColor = (q: number) => {
    if (q <= 2) return 'border-red-500 bg-red-50'
    if (q === 3) return 'border-yellow-500 bg-yellow-50'
    return 'border-green-500 bg-green-50'
  }

  const getDurationColor = (hours: number) => {
    if (hours < 6) return 'text-red-600'
    if (hours < 7) return 'text-yellow-600'
    if (hours <= 9) return 'text-green-600'
    return 'text-blue-600'
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Log Your Sleep</CardTitle>
        <CardDescription>
          Track your sleep quality and identify patterns for better rest
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sleep Date (Night of)</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-md"
              required
            />
          </div>

          {/* Sleep Times */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bedtime</label>
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Wake Time</label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md"
                required
              />
            </div>
          </div>

          {/* Duration Display */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Sleep Duration</span>
              <span className={`text-2xl font-bold ${getDurationColor(duration)}`}>
                {duration} hours
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {duration < 6 && '⚠️ Less than recommended (7-9 hours)'}
              {duration >= 6 && duration < 7 && '⚡ Getting close to recommended'}
              {duration >= 7 && duration <= 9 && '✅ Within recommended range'}
              {duration > 9 && '💤 More than typical range'}
            </div>
          </div>

          {/* Sleep Quality */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sleep Quality</label>
            <div className="grid grid-cols-5 gap-2">
              {qualityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setQuality(option.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    quality === option.value
                      ? getQualityColor(option.value) + ' border-2'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="text-xs">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Mood on Waking */}
          <div className="space-y-2">
            <label className="text-sm font-medium">How did you feel waking up?</label>
            <div className="grid grid-cols-4 gap-2">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMood(option.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    mood === option.value
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="text-xs">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time to Fall Asleep (min)</label>
              <input
                type="number"
                value={fellAsleepTime}
                onChange={(e) => setFellAsleepTime(Number(e.target.value))}
                min="0"
                className="w-full p-2 border border-gray-200 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Night Interruptions</label>
              <input
                type="number"
                value={interruptions}
                onChange={(e) => setInterruptions(Number(e.target.value))}
                min="0"
                className="w-full p-2 border border-gray-200 rounded-md"
              />
            </div>
          </div>

          {/* Sleep Factors */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Factors That May Have Affected Sleep</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={hadCaffeine}
                  onChange={(e) => setHadCaffeine(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">☕ Caffeine after 2pm</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={hadAlcohol}
                  onChange={(e) => setHadAlcohol(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">🍷 Alcohol consumption</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={lateExercise}
                  onChange={(e) => setLateExercise(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">🏃 Exercise within 2h of bedtime</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={screenTime}
                  onChange={(e) => setScreenTime(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">📱 Screen time within 1h of bedtime</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={stress}
                  onChange={(e) => setStress(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">😰 Stress or anxiety</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any dreams, disturbances, or other observations..."
              className="w-full p-3 border border-gray-200 rounded-md text-sm resize-none"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging...' : 'Log Sleep'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
