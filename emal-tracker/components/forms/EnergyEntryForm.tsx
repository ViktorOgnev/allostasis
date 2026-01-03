"use client"

import { useState } from 'react'
import { useEnergyStore } from '@/store/energyStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import type { EnergyMood, EnergySleepFactor, EnergyStressFactor } from '@/types/energy'

const moodOptions: { value: EnergyMood; label: string; emoji: string }[] = [
  { value: 'excellent', label: 'Excellent', emoji: '😄' },
  { value: 'good', label: 'Good', emoji: '🙂' },
  { value: 'neutral', label: 'Neutral', emoji: '😐' },
  { value: 'low', label: 'Low', emoji: '😔' },
  { value: 'exhausted', label: 'Exhausted', emoji: '😫' },
]

export function EnergyEntryForm() {
  const [energyLevel, setEnergyLevel] = useState(5)
  const [mood, setMood] = useState<EnergyMood>('neutral')
  const [notes, setNotes] = useState('')
  const [sleepFactor, setSleepFactor] = useState<EnergySleepFactor | undefined>()
  const [stressFactor, setStressFactor] = useState<EnergyStressFactor | undefined>()
  const [hadExercise, setHadExercise] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addEntry = useEnergyStore((state) => state.addEntry)

  const getEnergyColor = (level: number) => {
    if (level <= 3) return 'text-red-500'
    if (level <= 7) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getEnergyLabel = (level: number) => {
    if (level <= 2) return 'Very Low'
    if (level <= 4) return 'Low'
    if (level <= 6) return 'Moderate'
    if (level <= 8) return 'Good'
    return 'Excellent'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await addEntry({
        date: new Date(),
        timestamp: new Date(),
        energyLevel,
        mood,
        notes: notes || undefined,
        factors: {
          sleep: sleepFactor,
          stress: stressFactor,
          exercise: hadExercise || undefined,
        },
      })

      // Reset form
      setEnergyLevel(5)
      setMood('neutral')
      setNotes('')
      setSleepFactor(undefined)
      setStressFactor(undefined)
      setHadExercise(false)

      alert('Energy level logged successfully!')
    } catch (error) {
      console.error('Error adding entry:', error)
      alert('Failed to log energy level')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Log Your Energy Level</CardTitle>
        <CardDescription>
          Track how you're feeling right now on a scale of 1-10
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Energy Level Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">
                How's your energy level?
              </label>
              <div className="flex items-center gap-2">
                <span className={`text-3xl font-bold ${getEnergyColor(energyLevel)}`}>
                  {energyLevel}
                </span>
                <span className="text-sm text-gray-500">
                  / 10
                </span>
              </div>
            </div>

            <Slider
              min={1}
              max={10}
              step={1}
              value={energyLevel}
              onChange={setEnergyLevel}
            />

            <div className="flex justify-between text-xs text-gray-500">
              <span>Exhausted</span>
              <span className={getEnergyColor(energyLevel)}>
                {getEnergyLabel(energyLevel)}
              </span>
              <span>Energized</span>
            </div>
          </div>

          {/* Mood Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">How do you feel?</label>
            <div className="grid grid-cols-5 gap-2">
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

          {/* Factors */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Contributing Factors (Optional)</label>

            <div className="grid grid-cols-2 gap-4">
              {/* Sleep Quality */}
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Sleep Quality</label>
                <select
                  value={sleepFactor || ''}
                  onChange={(e) => setSleepFactor(e.target.value as EnergySleepFactor || undefined)}
                  className="w-full p-2 border border-gray-200 rounded-md text-sm"
                >
                  <option value="">Not specified</option>
                  <option value="poor">Poor</option>
                  <option value="fair">Fair</option>
                  <option value="good">Good</option>
                  <option value="excellent">Excellent</option>
                </select>
              </div>

              {/* Stress Level */}
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Stress Level</label>
                <select
                  value={stressFactor || ''}
                  onChange={(e) => setStressFactor(e.target.value as EnergyStressFactor || undefined)}
                  className="w-full p-2 border border-gray-200 rounded-md text-sm"
                >
                  <option value="">Not specified</option>
                  <option value="none">None</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Exercise */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hadExercise}
                onChange={(e) => setHadExercise(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm">I exercised today</span>
            </label>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional context about your energy level..."
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
            {isSubmitting ? 'Logging...' : 'Log Energy Level'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
