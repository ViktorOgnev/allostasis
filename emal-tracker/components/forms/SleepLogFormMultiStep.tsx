"use client"

import { useState } from 'react'
import { toast } from 'sonner'
import { useSleepStore } from '@/store/sleepStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FormStepper } from '@/components/forms/FormStepper'
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

export function SleepLogFormMultiStep() {
  const [currentStep, setCurrentStep] = useState(0)
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

    if (wakeDateTime <= bedDateTime) {
      wakeDateTime.setDate(wakeDateTime.getDate() + 1)
    }

    return calculateSleepDuration(bedDateTime, wakeDateTime)
  }

  const duration = getCalculatedDuration()

  const handleSubmit = async () => {
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

      toast.success('Sleep log saved successfully!')

      // Reset form
      setCurrentStep(0)
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
      console.error('Error saving sleep log:', error)
      toast.error('Failed to save sleep log')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Step 1: Basic Info
  const Step1BasicInfo = (
    <div className="space-y-6">
      {/* Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-md"
        />
      </div>

      {/* Bedtime */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Bedtime</label>
        <input
          type="time"
          value={bedtime}
          onChange={(e) => setBedtime(e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-md"
        />
      </div>

      {/* Wake Time */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Wake Time</label>
        <input
          type="time"
          value={wakeTime}
          onChange={(e) => setWakeTime(e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-md"
        />
      </div>

      {/* Duration Preview */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-sm text-gray-600">Total Sleep Duration</div>
        <div className="text-2xl font-bold text-blue-600">
          {duration.toFixed(1)} hours
        </div>
      </div>

      {/* Sleep Quality */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Sleep Quality</label>
        <div className="flex justify-center gap-2">
          {qualityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setQuality(option.value)}
              className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                quality === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-3xl mb-1">{option.emoji}</span>
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  // Step 2: Sleep Factors
  const Step2Factors = (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        Select any factors that may have affected your sleep:
      </p>

      <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:bg-gray-50 cursor-pointer">
        <input
          type="checkbox"
          checked={hadCaffeine}
          onChange={(e) => setHadCaffeine(e.target.checked)}
          className="w-5 h-5 rounded border-gray-300"
        />
        <span className="text-2xl">☕</span>
        <span className="flex-1 text-sm font-medium">Caffeine after 2 PM</span>
      </label>

      <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:bg-gray-50 cursor-pointer">
        <input
          type="checkbox"
          checked={hadAlcohol}
          onChange={(e) => setHadAlcohol(e.target.checked)}
          className="w-5 h-5 rounded border-gray-300"
        />
        <span className="text-2xl">🍷</span>
        <span className="flex-1 text-sm font-medium">Alcohol before bed</span>
      </label>

      <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:bg-gray-50 cursor-pointer">
        <input
          type="checkbox"
          checked={lateExercise}
          onChange={(e) => setLateExercise(e.target.checked)}
          className="w-5 h-5 rounded border-gray-300"
        />
        <span className="text-2xl">🏃</span>
        <span className="flex-1 text-sm font-medium">Exercise within 3 hours of bed</span>
      </label>

      <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:bg-gray-50 cursor-pointer">
        <input
          type="checkbox"
          checked={screenTime}
          onChange={(e) => setScreenTime(e.target.checked)}
          className="w-5 h-5 rounded border-gray-300"
        />
        <span className="text-2xl">📱</span>
        <span className="flex-1 text-sm font-medium">Screen time before bed</span>
      </label>

      <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:bg-gray-50 cursor-pointer">
        <input
          type="checkbox"
          checked={stress}
          onChange={(e) => setStress(e.target.checked)}
          className="w-5 h-5 rounded border-gray-300"
        />
        <span className="text-2xl">😰</span>
        <span className="flex-1 text-sm font-medium">High stress before bed</span>
      </label>
    </div>
  )

  // Step 3: Interruptions & Mood
  const Step3Quality = (
    <div className="space-y-6">
      {/* Time to Fall Asleep */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Time to Fall Asleep (minutes)
        </label>
        <input
          type="number"
          min="0"
          max="120"
          value={fellAsleepTime}
          onChange={(e) => setFellAsleepTime(Number(e.target.value))}
          className="w-full p-2 border border-gray-200 rounded-md"
        />
      </div>

      {/* Night Interruptions */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Night Interruptions (times woken up)
        </label>
        <input
          type="number"
          min="0"
          max="20"
          value={interruptions}
          onChange={(e) => setInterruptions(Number(e.target.value))}
          className="w-full p-2 border border-gray-200 rounded-md"
        />
      </div>

      {/* Morning Mood */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Morning Mood</label>
        <div className="grid grid-cols-2 gap-2">
          {moodOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMood(option.value)}
              className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                mood === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">{option.emoji}</span>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  // Step 4: Notes
  const Step4Notes = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Additional Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any dreams, sleep disturbances, or observations..."
          className="w-full p-3 border border-gray-200 rounded-md text-sm resize-none"
          rows={6}
        />
      </div>

      {/* Summary Preview */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-sm mb-3">Summary</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div>📅 {date}</div>
          <div>🛏️ {bedtime} → ⏰ {wakeTime} ({duration.toFixed(1)}h)</div>
          <div>⭐ Quality: {quality}/5</div>
          <div>😊 Mood: {mood}</div>
          {(hadCaffeine || hadAlcohol || lateExercise || screenTime || stress) && (
            <div className="pt-2 border-t border-gray-300">
              Factors: {[
                hadCaffeine && 'Caffeine',
                hadAlcohol && 'Alcohol',
                lateExercise && 'Late exercise',
                screenTime && 'Screen time',
                stress && 'Stress'
              ].filter(Boolean).join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const steps = [
    { title: 'Sleep Times', fields: Step1BasicInfo },
    { title: 'Factors', fields: Step2Factors },
    { title: 'Quality', fields: Step3Quality },
    { title: 'Notes', fields: Step4Notes },
  ]

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Log Your Sleep</CardTitle>
        <CardDescription>
          Multi-step form to track your sleep patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormStepper
          steps={steps}
          currentStep={currentStep}
          onNext={() => setCurrentStep((s) => Math.min(s + 1, steps.length - 1))}
          onPrev={() => setCurrentStep((s) => Math.max(s - 1, 0))}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </CardContent>
    </Card>
  )
}
