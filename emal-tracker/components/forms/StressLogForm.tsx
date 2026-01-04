"use client"

import { useState } from 'react'
import { toast } from 'sonner'
import { useStressLevelStore } from '@/store/stressLevelStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { colors } from '@/app/design-tokens/colors'
import type { TimeOfDay } from '@/types/stress'
import { STRESSOR_OPTIONS, SYMPTOM_OPTIONS, COPING_STRATEGY_OPTIONS } from '@/types/stress'

const timeOfDayOptions: { value: TimeOfDay; label: string; emoji: string }[] = [
  { value: 'morning', label: 'Morning', emoji: '🌅' },
  { value: 'afternoon', label: 'Afternoon', emoji: '☀️' },
  { value: 'evening', label: 'Evening', emoji: '🌙' },
]

export function StressLogForm() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon')
  const [stressLevel, setStressLevel] = useState<number>(5)
  const [selectedStressors, setSelectedStressors] = useState<string[]>([])
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([])
  const [strategyDurations, setStrategyDurations] = useState<Record<string, number>>({})
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addEntry = useStressLevelStore((state) => state.addEntry)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedStressors.length === 0) {
      toast.error('Please select at least one stressor')
      return
    }

    setIsSubmitting(true)

    try {
      await addEntry({
        date: new Date(date),
        timeOfDay,
        stressLevel,
        stressors: selectedStressors,
        physicalSymptoms: selectedSymptoms.length > 0 ? selectedSymptoms : undefined,
        copingStrategies: selectedStrategies.map(strategy => ({
          strategy,
          duration: strategyDurations[strategy] || undefined,
        })),
        notes: notes || undefined,
      })

      toast.success('Stress level logged successfully!')

      // Reset form
      setStressLevel(5)
      setSelectedStressors([])
      setSelectedSymptoms([])
      setSelectedStrategies([])
      setStrategyDurations({})
      setNotes('')
    } catch (error) {
      console.error('Error adding stress entry:', error)
      toast.error('Failed to log stress level')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleStressor = (value: string) => {
    setSelectedStressors(prev =>
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    )
  }

  const toggleSymptom = (value: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    )
  }

  const toggleStrategy = (value: string) => {
    setSelectedStrategies(prev =>
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    )
  }

  const getStressColor = (level: number) => {
    if (level <= 2) return colors.stress.none
    if (level <= 4) return colors.stress.low
    if (level <= 6) return colors.stress.medium
    if (level <= 8) return colors.stress.high
    return colors.stress.veryHigh
  }

  const getStressEmoji = (level: number) => {
    if (level <= 2) return '😌'
    if (level <= 4) return '😐'
    if (level <= 6) return '😰'
    if (level <= 8) return '😫'
    return '🤯'
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Log Your Stress Level</CardTitle>
        <CardDescription>
          Track your stress levels and identify patterns to better manage stress
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

          {/* Time of Day */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Time of Day</label>
            <div className="grid grid-cols-3 gap-2">
              {timeOfDayOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTimeOfDay(option.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    timeOfDay === option.value
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

          {/* Stress Level */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Stress Level</label>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600">How stressed are you?</span>
                <div className="flex items-center gap-2">
                  <span className="text-4xl">{getStressEmoji(stressLevel)}</span>
                  <span
                    className="text-3xl font-bold"
                    style={{ color: getStressColor(stressLevel) }}
                  >
                    {stressLevel}/10
                  </span>
                </div>
              </div>
              <Slider
                min={1}
                max={10}
                step={1}
                value={stressLevel}
                onChange={setStressLevel}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>😌 Calm</span>
                <span>😐 Mild</span>
                <span>😰 Moderate</span>
                <span>😫 High</span>
                <span>🤯 Extreme</span>
              </div>
            </div>
          </div>

          {/* Stressors */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              What's causing stress? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STRESSOR_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleStressor(option.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedStressors.includes(option.value)
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{option.emoji}</span>
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Physical Symptoms (Optional) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Physical Symptoms (Optional)</label>
            <div className="grid grid-cols-2 gap-2">
              {SYMPTOM_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer border-2 transition-all ${
                    selectedSymptoms.includes(option.value)
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.includes(option.value)}
                    onChange={() => toggleSymptom(option.value)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-lg">{option.emoji}</span>
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Coping Strategies (Optional) */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Coping Strategies Used (Optional)</label>
            <div className="space-y-2">
              {COPING_STRATEGY_OPTIONS.map((option) => (
                <div key={option.value} className="space-y-2">
                  <label
                    className={`flex items-center gap-2 p-3 rounded cursor-pointer border-2 transition-all ${
                      selectedStrategies.includes(option.value)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStrategies.includes(option.value)}
                      onChange={() => toggleStrategy(option.value)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-xl">{option.emoji}</span>
                    <span className="text-sm font-medium flex-1">{option.label}</span>
                  </label>

                  {selectedStrategies.includes(option.value) && option.hasDuration && (
                    <div className="ml-8 flex items-center gap-2">
                      <label className="text-xs text-gray-600">Duration (min):</label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={strategyDurations[option.value] || ''}
                        onChange={(e) => setStrategyDurations(prev => ({
                          ...prev,
                          [option.value]: Number(e.target.value)
                        }))}
                        className="w-20 p-1 border border-gray-200 rounded text-sm"
                        placeholder="10"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What triggered the stress? How did you handle it? Any insights..."
              className="w-full p-3 border border-gray-200 rounded-md text-sm resize-none"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Logging...' : 'Log Stress Level'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
