"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Slider } from '@/components/ui/slider'
import { toast } from 'sonner'
import { useEnergyStore } from '@/store/energyStore'
import { useSleepStore } from '@/store/sleepStore'
import { useExerciseStore } from '@/store/exerciseStore'
import { useStressLevelStore } from '@/store/stressLevelStore'
import { useDailyCheckInStore } from '@/store/dailyCheckInStore'
import { getEnergyColor, colors } from '@/app/design-tokens/colors'
import type { SleepQuality } from '@/types/sleep'
import { AllostaticCheckInForm } from '@/components/forms/AllostaticCheckInForm'

export default function UnifiedDailyLog() {
  const router = useRouter()
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  // Mode toggle: 'quick' (new 5-question form) or 'detailed' (legacy 4-section form)
  const [mode, setMode] = useState<'quick' | 'detailed'>('quick')

  // Track completion status
  const [completed, setCompleted] = useState({
    energy: false,
    sleep: false,
    exercise: false,
    stress: false,
  })

  // Energy fields
  const [energyLevel, setEnergyLevel] = useState<number>(5)
  const [mood, setMood] = useState<'excellent' | 'good' | 'neutral' | 'low' | 'exhausted'>('neutral')

  // Sleep fields
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>(3)
  const [bedtimeHour, setBedtimeHour] = useState<number>(22)
  const [wakeTimeHour, setWakeTimeHour] = useState<number>(7)

  // Exercise fields
  const [didExercise, setDidExercise] = useState<boolean>(false)
  const [exerciseType, setExerciseType] = useState<'cardio' | 'strength' | 'flexibility' | 'walking' | 'sports' | 'other'>('cardio')
  const [exerciseDuration, setExerciseDuration] = useState<number>(30)

  // Stress fields
  const [stressLevel, setStressLevel] = useState<number>(5)
  const [mainStressor, setMainStressor] = useState<string>('work')

  // Store actions
  const addEnergyEntry = useEnergyStore((state) => state.addEntry)
  const addSleepEntry = useSleepStore((state) => state.addEntry)
  const addExerciseEntry = useExerciseStore((state) => state.addEntry)
  const addStressEntry = useStressLevelStore((state) => state.addEntry)
  const recordCheckIn = useDailyCheckInStore((state) => state.recordCheckIn)

  const completedCount = Object.values(completed).filter(Boolean).length

  // Helper functions
  const getEnergyEmoji = (level: number) => {
    if (level <= 2) return '😴'
    if (level <= 4) return '😐'
    if (level <= 6) return '😊'
    if (level <= 8) return '😄'
    return '⚡'
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

  // Save handlers
  const handleSaveEnergy = async () => {
    try {
      const selectedDate = new Date(date)
      selectedDate.setHours(12, 0, 0, 0)

      await addEnergyEntry({
        date: selectedDate,
        timestamp: new Date(),
        energyLevel,
        mood,
      })

      setCompleted({ ...completed, energy: true })
      toast.success('Energy logged successfully!')
    } catch (error) {
      toast.error('Failed to log energy')
      console.error(error)
    }
  }

  const handleSaveSleep = async () => {
    try {
      const selectedDate = new Date(date)
      const yesterday = new Date(selectedDate)
      yesterday.setDate(selectedDate.getDate() - 1)

      const estimatedBedtime = new Date(yesterday)
      estimatedBedtime.setHours(bedtimeHour, 0, 0, 0)

      const estimatedWakeTime = new Date(selectedDate)
      estimatedWakeTime.setHours(wakeTimeHour, 0, 0, 0)

      await addSleepEntry({
        date: yesterday,
        bedtime: estimatedBedtime,
        wakeTime: estimatedWakeTime,
        quality: sleepQuality,
        mood: 'okay',
      })

      setCompleted({ ...completed, sleep: true })
      toast.success('Sleep logged successfully!')
    } catch (error) {
      toast.error('Failed to log sleep')
      console.error(error)
    }
  }

  const handleSaveExercise = async () => {
    try {
      if (!didExercise) {
        setCompleted({ ...completed, exercise: true })
        toast.success('No exercise recorded')
        return
      }

      const selectedDate = new Date(date)
      selectedDate.setHours(12, 0, 0, 0)

      await addExerciseEntry({
        date: selectedDate,
        startTime: new Date(),
        duration: exerciseDuration,
        type: exerciseType,
        intensity: 'moderate',
      })

      setCompleted({ ...completed, exercise: true })
      toast.success('Exercise logged successfully!')
    } catch (error) {
      toast.error('Failed to log exercise')
      console.error(error)
    }
  }

  const handleSaveStress = async () => {
    try {
      const selectedDate = new Date(date)
      selectedDate.setHours(12, 0, 0, 0)
      const now = new Date()

      await addStressEntry({
        date: selectedDate,
        timeOfDay: now.getHours() < 12 ? 'morning' : now.getHours() < 18 ? 'afternoon' : 'evening',
        stressLevel,
        stressors: stressLevel > 3 ? [mainStressor] : [],
        copingStrategies: [],
      })

      setCompleted({ ...completed, stress: true })
      toast.success('Stress logged successfully!')
    } catch (error) {
      toast.error('Failed to log stress')
      console.error(error)
    }
  }

  const handleCompleteAll = () => {
    // Record check-in completion
    recordCheckIn({
      date: date,
      energyLogged: completed.energy,
      sleepLogged: completed.sleep,
      exerciseLogged: completed.exercise,
      stressLogged: completed.stress,
    })

    toast.success('Daily log complete! Great job! 🎉')
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Daily Log</h1>
          <p className="text-gray-600 text-sm mb-4">
            Track your daily wellbeing and build insights over time
          </p>

          {/* Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={mode === 'quick' ? 'default' : 'outline'}
              onClick={() => setMode('quick')}
              className="flex-1"
            >
              <span className="mr-2">⚡</span>
              Quick Check-In (5 questions)
            </Button>
            <Button
              variant={mode === 'detailed' ? 'default' : 'outline'}
              onClick={() => setMode('detailed')}
              className="flex-1"
            >
              <span className="mr-2">🔧</span>
              Detailed Tracking
            </Button>
          </div>

          {mode === 'detailed' && (
            <div className="flex items-center justify-between">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="p-2 border rounded"
              />
              <div className="text-sm text-gray-600">
                Progress: <strong>{completedCount}/4</strong> completed
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar (only for detailed mode) */}
        {mode === 'detailed' && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${(completedCount / 4) * 100}%` }}
            />
          </div>
        )}

        {/* Quick Mode: New 5-Question Form */}
        {mode === 'quick' && (
          <div className="flex justify-center">
            <AllostaticCheckInForm />
          </div>
        )}

        {/* Detailed Mode: Legacy 4-Section Form */}
        {mode === 'detailed' && (
          <>
        {/* 4 Sections - Collapsible */}
        <div className="space-y-4">
          {/* 1. Energy Section */}
          <Card className={completed.energy ? 'border-green-500 border-2' : ''}>
            <Accordion type="single" collapsible>
              <AccordionItem value="energy" className="border-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⚡</span>
                      <div className="text-left">
                        <div className="font-semibold">Energy</div>
                        <div className="text-xs text-gray-500">How's your energy today?</div>
                      </div>
                    </div>
                    {completed.energy && (
                      <span className="text-green-500 text-xl mr-2">✓</span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Energy Level</label>
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
                    <div>
                      <label className="text-sm font-medium mb-2 block">Mood</label>
                      <div className="flex gap-2">
                        {[
                          { value: 'excellent', emoji: '😄', label: 'Excellent' },
                          { value: 'good', emoji: '🙂', label: 'Good' },
                          { value: 'neutral', emoji: '😐', label: 'Neutral' },
                          { value: 'low', emoji: '😔', label: 'Low' },
                          { value: 'exhausted', emoji: '😫', label: 'Exhausted' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setMood(option.value as any)}
                            className={`flex-1 p-2 rounded border-2 transition-all ${
                              mood === option.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="text-2xl">{option.emoji}</div>
                            <div className="text-xs">{option.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button onClick={handleSaveEnergy} className="w-full" disabled={completed.energy}>
                      {completed.energy ? '✓ Saved' : 'Save Energy'}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          {/* 2. Sleep Section */}
          <Card className={completed.sleep ? 'border-green-500 border-2' : ''}>
            <Accordion type="single" collapsible>
              <AccordionItem value="sleep" className="border-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">😴</span>
                      <div className="text-left">
                        <div className="font-semibold">Sleep</div>
                        <div className="text-xs text-gray-500">Last night's rest</div>
                      </div>
                    </div>
                    {completed.sleep && (
                      <span className="text-green-500 text-xl mr-2">✓</span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Quality</label>
                      <div className="flex gap-2 justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setSleepQuality(star as SleepQuality)}
                            className={`text-4xl transition-all ${
                              star <= sleepQuality ? 'opacity-100 scale-110' : 'opacity-30'
                            }`}
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                      <div className="text-center text-sm text-gray-600 mt-2">
                        {sleepQuality === 1 && 'Very Poor'}
                        {sleepQuality === 2 && 'Poor'}
                        {sleepQuality === 3 && 'Fair'}
                        {sleepQuality === 4 && 'Good'}
                        {sleepQuality === 5 && 'Excellent'}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">Bedtime</label>
                        <select
                          value={bedtimeHour}
                          onChange={(e) => setBedtimeHour(Number(e.target.value))}
                          className="w-full p-2 border border-gray-200 rounded text-sm bg-white"
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
                          className="w-full p-2 border border-gray-200 rounded text-sm bg-white"
                        >
                          {Array.from({length: 24}, (_, i) => (
                            <option key={i} value={i}>
                              {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i-12} PM`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <Button onClick={handleSaveSleep} className="w-full" disabled={completed.sleep}>
                      {completed.sleep ? '✓ Saved' : 'Save Sleep'}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          {/* 3. Exercise Section */}
          <Card className={completed.exercise ? 'border-green-500 border-2' : ''}>
            <Accordion type="single" collapsible>
              <AccordionItem value="exercise" className="border-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏃</span>
                      <div className="text-left">
                        <div className="font-semibold">Exercise</div>
                        <div className="text-xs text-gray-500">Today's activity</div>
                      </div>
                    </div>
                    {completed.exercise && (
                      <span className="text-green-500 text-xl mr-2">✓</span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Did you exercise?</label>
                      <div className="flex gap-2">
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
                    </div>
                    {didExercise && (
                      <>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Type</label>
                          <select
                            value={exerciseType}
                            onChange={(e) => setExerciseType(e.target.value as any)}
                            className="w-full p-2 border border-gray-200 rounded text-sm bg-white"
                          >
                            <option value="cardio">🏃 Cardio</option>
                            <option value="strength">💪 Strength</option>
                            <option value="flexibility">🧘 Flexibility</option>
                            <option value="walking">🚶 Walking</option>
                            <option value="sports">⚽ Sports</option>
                            <option value="other">🏋️ Other</option>
                          </select>
                        </div>
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
                      </>
                    )}
                    <Button onClick={handleSaveExercise} className="w-full" disabled={completed.exercise}>
                      {completed.exercise ? '✓ Saved' : 'Save Exercise'}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          {/* 4. Stress Section */}
          <Card className={completed.stress ? 'border-green-500 border-2' : ''}>
            <Accordion type="single" collapsible>
              <AccordionItem value="stress" className="border-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🧘</span>
                      <div className="text-left">
                        <div className="font-semibold">Stress</div>
                        <div className="text-xs text-gray-500">Current stress level</div>
                      </div>
                    </div>
                    {completed.stress && (
                      <span className="text-green-500 text-xl mr-2">✓</span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Stress Level</label>
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
                    </div>
                    {stressLevel > 3 && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Main stressor</label>
                        <select
                          value={mainStressor}
                          onChange={(e) => setMainStressor(e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded text-sm bg-white"
                        >
                          <option value="work">💼 Work/School</option>
                          <option value="relationships">❤️ Relationships</option>
                          <option value="health">🏥 Health</option>
                          <option value="finances">💰 Finances</option>
                          <option value="family">👨‍👩‍👧‍👦 Family</option>
                          <option value="deadlines">⏰ Deadlines</option>
                          <option value="sleep">😴 Sleep deprivation</option>
                          <option value="other">🔄 Other</option>
                        </select>
                      </div>
                    )}
                    <Button onClick={handleSaveStress} className="w-full" disabled={completed.stress}>
                      {completed.stress ? '✓ Saved' : 'Save Stress'}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </div>

        {/* Complete All Button */}
        {completedCount === 4 && (
          <div className="mt-8 text-center">
            <p className="text-green-600 font-semibold mb-2">
              🎉 Great! You've logged everything for today!
            </p>
            <Button size="lg" onClick={handleCompleteAll}>
              View Dashboard
            </Button>
          </div>
        )}
          </>
        )}
      </div>
    </main>
  )
}
