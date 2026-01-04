"use client"

import { useState } from 'react'
import { toast } from 'sonner'
import { useExerciseStore } from '@/store/exerciseStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { ExerciseType, ExerciseIntensity } from '@/types/exercise'

const exerciseTypes: { value: ExerciseType; label: string; emoji: string }[] = [
  { value: 'cardio', label: 'Cardio', emoji: '🏃' },
  { value: 'strength', label: 'Strength', emoji: '💪' },
  { value: 'flexibility', label: 'Flexibility', emoji: '🧘' },
  { value: 'walking', label: 'Walking', emoji: '🚶' },
  { value: 'sports', label: 'Sports', emoji: '⚽' },
  { value: 'other', label: 'Other', emoji: '🏋️' },
]

const intensityLevels: { value: ExerciseIntensity; label: string; emoji: string; description: string }[] = [
  { value: 'low', label: 'Low', emoji: '🟢', description: 'Light activity, easy conversation' },
  { value: 'moderate', label: 'Moderate', emoji: '🟡', description: 'Can talk, breathing harder' },
  { value: 'high', label: 'High', emoji: '🟠', description: 'Hard to talk, breathing heavy' },
  { value: 'vigorous', label: 'Vigorous', emoji: '🔴', description: 'Cannot talk, max effort' },
]

export function ExerciseLogForm() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [type, setType] = useState<ExerciseType>('cardio')
  const [duration, setDuration] = useState<number>(30)
  const [intensity, setIntensity] = useState<ExerciseIntensity>('moderate')
  const [energyBefore, setEnergyBefore] = useState<number>(5)
  const [energyAfter, setEnergyAfter] = useState<number>(6)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addEntry = useExerciseStore((state) => state.addEntry)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await addEntry({
        date: new Date(date),
        type,
        duration,
        intensity,
        energyBefore: energyBefore || undefined,
        energyAfter: energyAfter || undefined,
        notes: notes || undefined,
      })

      toast.success('Exercise logged successfully!')

      // Reset some fields
      setDuration(30)
      setIntensity('moderate')
      setEnergyBefore(5)
      setEnergyAfter(6)
      setNotes('')
    } catch (error) {
      console.error('Error adding exercise entry:', error)
      toast.error('Failed to log exercise')
    } finally{
      setIsSubmitting(false)
    }
  }

  const getIntensityColor = (i: ExerciseIntensity) => {
    switch (i) {
      case 'low': return 'border-green-500 bg-green-50'
      case 'moderate': return 'border-yellow-500 bg-yellow-50'
      case 'high': return 'border-orange-500 bg-orange-50'
      case 'vigorous': return 'border-red-500 bg-red-50'
    }
  }

  const getEnergyColor = (level: number) => {
    if (level <= 3) return 'text-red-600'
    if (level <= 5) return 'text-yellow-600'
    if (level <= 7) return 'text-green-600'
    return 'text-blue-600'
  }

  const energyDiff = energyAfter - energyBefore

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Log Your Exercise</CardTitle>
        <CardDescription>
          Track workouts and see their impact on energy. WHO recommends 300+ min/week moderate exercise
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-md"
              required
            />
          </div>

          {/* Exercise Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Exercise Type</label>
            <div className="grid grid-cols-3 gap-2">
              {exerciseTypes.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    type === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="text-xs font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Duration (minutes)</label>
            <div className="space-y-3">
              <input
                type="range"
                min="5"
                max="600"
                step="5"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">5 min</span>
                <div className="text-center">
                  <span className="text-3xl font-bold text-blue-600">{duration}</span>
                  <span className="text-sm text-gray-600 ml-1">minutes</span>
                </div>
                <span className="text-xs text-gray-500">600 min (10h)</span>
              </div>
            </div>
          </div>

          {/* Intensity */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Intensity Level</label>
            <div className="grid grid-cols-2 gap-2">
              {intensityLevels.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setIntensity(option.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    intensity === option.value
                      ? getIntensityColor(option.value) + ' border-2'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{option.emoji}</span>
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                  <p className="text-xs text-gray-600">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Energy Levels */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="text-sm font-medium">Energy Impact</h3>

            {/* Energy Before */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-gray-600">Energy Before</label>
                <span className={`text-lg font-bold ${getEnergyColor(energyBefore)}`}>
                  {energyBefore}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energyBefore}
                onChange={(e) => setEnergyBefore(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Energy After */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-gray-600">Energy After</label>
                <span className={`text-lg font-bold ${getEnergyColor(energyAfter)}`}>
                  {energyAfter}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energyAfter}
                onChange={(e) => setEnergyAfter(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Energy Difference */}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Energy Change:</span>
                <div className="flex items-center gap-2">
                  {energyDiff > 0 && (
                    <span className="text-green-600 font-medium">
                      ↑ +{energyDiff} points
                    </span>
                  )}
                  {energyDiff === 0 && (
                    <span className="text-gray-600 font-medium">
                      → No change
                    </span>
                  )}
                  {energyDiff < 0 && (
                    <span className="text-red-600 font-medium">
                      ↓ {energyDiff} points
                    </span>
                  )}
                </div>
              </div>
              {energyDiff > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  Great! Exercise boosted your energy
                </p>
              )}
              {energyDiff < 0 && (
                <p className="text-xs text-gray-600 mt-1">
                  Normal for intense workouts - energy will recover
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Workout details, how you felt, achievements..."
              className="w-full p-3 border border-gray-200 rounded-md text-sm resize-none"
              rows={3}
            />
          </div>

          {/* Weekly Progress */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="text-sm font-medium mb-1">WHO Recommendation</p>
                <p className="text-xs text-gray-700">
                  Aim for 300+ minutes of moderate exercise per week (about 43 minutes daily)
                  or 150+ minutes of vigorous exercise (about 22 minutes daily).
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging...' : 'Log Exercise'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
