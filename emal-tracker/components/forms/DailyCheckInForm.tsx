"use client"

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useEnergyStore } from '@/store/energyStore'
import { useSleepStore } from '@/store/sleepStore'
import { useExerciseStore } from '@/store/exerciseStore'
import { useStressLevelStore } from '@/store/stressLevelStore'
import { useDailyCheckInStore } from '@/store/dailyCheckInStore'
import { getEnergyColor } from '@/app/design-tokens/colors'
import { colors } from '@/app/design-tokens/colors'

interface DailyCheckInFormProps {
  onSuccess?: () => void
}

export function DailyCheckInForm({ onSuccess }: DailyCheckInFormProps) {
  const [mode, setMode] = useState<'quick' | 'detailed'>('quick')

  // Quick mode fields
  const [energyLevel, setEnergyLevel] = useState<number>(5)
  const [sleepQuality, setSleepQuality] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [bedtimeHour, setBedtimeHour] = useState<number>(22)
  const [wakeTimeHour, setWakeTimeHour] = useState<number>(7)
  const [didExercise, setDidExercise] = useState<boolean>(false)
  const [exerciseDuration, setExerciseDuration] = useState<number>(30)
  const [exerciseType, setExerciseType] = useState<'cardio' | 'strength' | 'flexibility' | 'walking' | 'sports' | 'other'>('cardio')
  const [stressLevel, setStressLevel] = useState<number>(5)
  const [mainStressor, setMainStressor] = useState<string>('work')

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Store actions
  const addEnergyEntry = useEnergyStore((state) => state.addEntry)
  const addSleepEntry = useSleepStore((state) => state.addEntry)
  const addExerciseEntry = useExerciseStore((state) => state.addEntry)
  const addStressEntry = useStressLevelStore((state) => state.addEntry)
  const recordCheckIn = useDailyCheckInStore((state) => state.recordCheckIn)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const now = new Date()
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Add energy entry
      await addEnergyEntry({
        date: today,
        timestamp: now,
        energyLevel,
        mood: energyLevel >= 8 ? 'excellent' : energyLevel >= 6 ? 'good' : energyLevel >= 4 ? 'neutral' : energyLevel >= 2 ? 'low' : 'exhausted',
      })

      // Add sleep entry (yesterday's sleep)
      const yesterday = new Date(today)
      yesterday.setDate(today.getDate() - 1)

      // Use user-selected bedtime and wake time
      const estimatedBedtime = new Date(yesterday)
      estimatedBedtime.setHours(bedtimeHour, 0, 0, 0) // User-selected

      const estimatedWakeTime = new Date(today)
      estimatedWakeTime.setHours(wakeTimeHour, 0, 0, 0) // User-selected

      await addSleepEntry({
        date: yesterday,
        bedtime: estimatedBedtime,
        wakeTime: estimatedWakeTime,
        quality: sleepQuality,
      })

      // Add exercise entry (if exercised)
      if (didExercise) {
        await addExerciseEntry({
          date: today,
          startTime: now,
          duration: exerciseDuration,
          type: exerciseType, // User-selected
          intensity: 'moderate',
        })
      }

      // Add stress entry
      await addStressEntry({
        date: today,
        timeOfDay: now.getHours() < 12 ? 'morning' : now.getHours() < 18 ? 'afternoon' : 'evening',
        stressLevel,
        stressors: stressLevel > 3 ? [mainStressor] : [], // User-selected if stress > 3
        copingStrategies: [],
      })

      // Record check-in completion
      recordCheckIn({
        date: today.toISOString().split('T')[0],
        energyLogged: true,
        sleepLogged: true,
        exerciseLogged: didExercise,
        stressLogged: true,
      })

      toast.success('Daily check-in saved successfully! 🎉')

      // Reset form
      setEnergyLevel(5)
      setSleepQuality(3)
      setBedtimeHour(22)
      setWakeTimeHour(7)
      setDidExercise(false)
      setExerciseDuration(30)
      setExerciseType('cardio')
      setStressLevel(5)
      setMainStressor('work')

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error saving daily check-in:', error)
      toast.error('Failed to save daily check-in')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStressColor = (level: number) => {
    if (level <= 2) return colors.stress.none
    if (level <= 4) return colors.stress.low
    if (level <= 6) return colors.stress.medium
    if (level <= 8) return colors.stress.high
    return colors.stress.veryHigh
  }

  const getEnergyEmoji = (level: number) => {
    if (level <= 2) return '😴'
    if (level <= 4) return '😐'
    if (level <= 6) return '😊'
    if (level <= 8) return '😄'
    return '⚡'
  }

  const getStressEmoji = (level: number) => {
    if (level <= 2) return '😌'
    if (level <= 4) return '😐'
    if (level <= 6) return '😰'
    if (level <= 8) return '😫'
    return '🤯'
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
        <Button
          type="button"
          variant={mode === 'quick' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setMode('quick')}
        >
          ⚡ Quick Mode
        </Button>
        <Button
          type="button"
          variant={mode === 'detailed' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setMode('detailed')}
        >
          📋 Detailed Mode
        </Button>
      </div>

      {/* Quick Mode Fields */}
      <div className="space-y-6">
        {/* Energy Level */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <label className="text-sm font-medium flex items-center gap-2 mb-3">
            <span className="text-2xl">⚡</span>
            Energy Level
          </label>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{getEnergyEmoji(energyLevel)}</span>
            <span
              className="text-3xl font-bold"
              style={{ color: getEnergyColor(energyLevel) }}
            >
              {energyLevel}/10
            </span>
          </div>
          <Slider
            min={1}
            max={10}
            step={1}
            value={energyLevel}
            onChange={setEnergyLevel}
          />
        </div>

        {/* Sleep Quality */}
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <label className="text-sm font-medium flex items-center gap-2 mb-3">
            <span className="text-2xl">😴</span>
            Last Night's Sleep
          </label>

          {/* Quality Stars */}
          <div className="flex items-center gap-2 justify-center mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setSleepQuality(star as 1 | 2 | 3 | 4 | 5)}
                className={`text-4xl transition-all ${
                  star <= sleepQuality
                    ? 'opacity-100 scale-110'
                    : 'opacity-30'
                }`}
              >
                ⭐
              </button>
            ))}
          </div>

          {/* Sleep Times */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Bedtime</label>
              <select
                value={bedtimeHour}
                onChange={(e) => setBedtimeHour(Number(e.target.value))}
                className="w-full p-2 border border-purple-200 rounded text-sm bg-white"
              >
                {Array.from({length: 24}, (_, i) => (
                  <option key={i} value={i}>
                    {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i-12} PM`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Wake time</label>
              <select
                value={wakeTimeHour}
                onChange={(e) => setWakeTimeHour(Number(e.target.value))}
                className="w-full p-2 border border-purple-200 rounded text-sm bg-white"
              >
                {Array.from({length: 24}, (_, i) => (
                  <option key={i} value={i}>
                    {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i-12} PM`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600 mt-2">
            {sleepQuality === 1 && 'Poor'}
            {sleepQuality === 2 && 'Fair'}
            {sleepQuality === 3 && 'Good'}
            {sleepQuality === 4 && 'Very Good'}
            {sleepQuality === 5 && 'Excellent'}
          </div>
        </div>

        {/* Exercise */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <label className="text-sm font-medium flex items-center gap-2 mb-3">
            <span className="text-2xl">🏃</span>
            Did you exercise today?
          </label>
          <div className="flex gap-3 mb-3">
            <Button
              type="button"
              variant={didExercise ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setDidExercise(true)}
            >
              Yes
            </Button>
            <Button
              type="button"
              variant={!didExercise ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setDidExercise(false)}
            >
              No
            </Button>
          </div>

          {didExercise && (
            <div className="mt-4 space-y-3">
              {/* Exercise Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <select
                  value={exerciseType}
                  onChange={(e) => setExerciseType(e.target.value as any)}
                  className="w-full p-2 border border-green-200 rounded text-sm bg-white"
                >
                  <option value="cardio">🏃 Cardio</option>
                  <option value="strength">💪 Strength</option>
                  <option value="flexibility">🧘 Flexibility</option>
                  <option value="walking">🚶 Walking</option>
                  <option value="sports">⚽ Sports</option>
                  <option value="other">🏋️ Other</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Duration: {exerciseDuration} minutes
                </label>
                <Slider
                  min={5}
                  max={180}
                  step={5}
                  value={exerciseDuration}
                  onChange={setExerciseDuration}
                />
              </div>
            </div>
          )}
        </div>

        {/* Stress Level */}
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <label className="text-sm font-medium flex items-center gap-2 mb-3">
            <span className="text-2xl">🧘</span>
            Stress Level
          </label>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{getStressEmoji(stressLevel)}</span>
            <span
              className="text-3xl font-bold"
              style={{ color: getStressColor(stressLevel) }}
            >
              {stressLevel}/10
            </span>
          </div>
          <Slider
            min={1}
            max={10}
            step={1}
            value={stressLevel}
            onChange={setStressLevel}
          />

          {/* Main Stressor - Conditional */}
          {stressLevel > 3 && (
            <div className="mt-3">
              <label className="text-xs text-gray-600 mb-1 block">Main stressor?</label>
              <select
                value={mainStressor}
                onChange={(e) => setMainStressor(e.target.value)}
                className="w-full p-2 border border-orange-200 rounded text-sm bg-white"
              >
                <option value="work">Work/School</option>
                <option value="relationships">Relationships</option>
                <option value="health">Health</option>
                <option value="finances">Finances</option>
                <option value="family">Family</option>
                <option value="deadlines">Deadlines</option>
                <option value="sleep">Sleep deprivation</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Mode Notice */}
      {mode === 'detailed' && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 italic">
            💡 Detailed mode coming soon! For now, use the individual tracking pages to add detailed information about each metric.
          </p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full py-6 text-lg font-semibold"
        disabled={isSubmitting}
        loading={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : '✅ Complete Daily Check-In'}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        This quick check-in saves entries to all four tracking modules (Energy, Sleep, Exercise, Stress)
      </p>
    </form>
  )
}
