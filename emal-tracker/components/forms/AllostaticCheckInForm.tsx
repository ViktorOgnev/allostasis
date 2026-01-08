"use client"

import { useState } from 'react'
import { toast } from 'sonner'
import { useAllostaticStore } from '@/store/allostaticStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

/**
 * Simplified 5-Question Allostasis Check-In Form
 *
 * All questions on 0-10 scale for consistency
 * Replaces the previous quick check-in form
 */
export function AllostaticCheckInForm() {
  // Question 1: Sleep Recovery (0=terrible, 10=excellent)
  const [sleepRecovery, setSleepRecovery] = useState(5)

  // Question 2: Physical Load (0=sedentary, 10=extreme)
  const [physicalLoad, setPhysicalLoad] = useState(5)

  // Question 3: Recovery from Load (0=exhausted, 10=fully recovered)
  const [recoveryFromLoad, setRecoveryFromLoad] = useState(5)

  // Question 4: Psychological Stress (0=calm, 10=overwhelmed)
  const [psychologicalStress, setPsychologicalStress] = useState(5)

  // Question 5: Energy Level [ANCHOR] (0=exhausted, 10=energized)
  const [energyLevel, setEnergyLevel] = useState(5)

  // Optional notes
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addEntry = useAllostaticStore((state) => state.addEntry)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      await addEntry({
        date: today,
        timestamp: now,
        sleepRecovery,
        physicalLoad,
        recoveryFromLoad,
        psychologicalStress,
        energyLevel,
        notes: notes || undefined,
      })

      toast.success('Check-in completed! 🎉', {
        description: 'Your allostatic data has been logged successfully.',
      })

      // Reset to defaults
      setSleepRecovery(5)
      setPhysicalLoad(5)
      setRecoveryFromLoad(5)
      setPsychologicalStress(5)
      setEnergyLevel(5)
      setNotes('')
    } catch (error) {
      console.error('Error submitting check-in:', error)

      if (error instanceof Error) {
        if (error.name === 'QuotaExceededError') {
          toast.error('Storage is full', {
            description: 'Go to Settings → Export and clear old data.',
            action: {
              label: 'Settings',
              onClick: () => window.location.href = '/settings'
            }
          })
        } else {
          toast.error('Failed to log check-in', {
            description: 'Please try again.',
            action: {
              label: 'Retry',
              onClick: () => handleSubmit({ preventDefault: () => {} } as React.FormEvent)
            }
          })
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Emoji helpers
  const getSleepEmoji = (value: number) => {
    if (value <= 2) return '😫'
    if (value <= 4) return '😴'
    if (value <= 6) return '😌'
    if (value <= 8) return '😊'
    return '✨'
  }

  const getLoadEmoji = (value: number) => {
    if (value <= 2) return '🛋️'
    if (value <= 4) return '🚶'
    if (value <= 6) return '🏃'
    if (value <= 8) return '🏋️'
    return '🔥'
  }

  const getRecoveryEmoji = (value: number) => {
    if (value <= 2) return '😫'
    if (value <= 4) return '😓'
    if (value <= 6) return '😌'
    if (value <= 8) return '💪'
    return '⚡'
  }

  const getStressEmoji = (value: number) => {
    if (value <= 2) return '😌'
    if (value <= 4) return '😐'
    if (value <= 6) return '😰'
    if (value <= 8) return '😫'
    return '🤯'
  }

  const getEnergyEmoji = (value: number) => {
    if (value <= 2) return '😴'
    if (value <= 4) return '😐'
    if (value <= 6) return '😊'
    if (value <= 8) return '😄'
    return '⚡'
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Daily Allostasis Check-In</CardTitle>
        <CardDescription>
          5 quick questions to track your wellbeing (all on 0-10 scale)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question 1: Sleep Recovery */}
          <Card className="p-6 bg-purple-50 border-purple-200">
            <div className="space-y-3">
              <label className="text-sm font-medium text-purple-900">
                1. How well did you sleep last night?
              </label>
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl">{getSleepEmoji(sleepRecovery)}</span>
                <span className="text-3xl font-bold text-purple-700">
                  {sleepRecovery}/10
                </span>
              </div>
              <Slider
                min={0}
                max={10}
                step={1}
                value={sleepRecovery}
                onChange={setSleepRecovery}
              />
              <div className="flex justify-between text-xs text-purple-700">
                <span>Terrible</span>
                <span>Excellent</span>
              </div>
            </div>
          </Card>

          {/* Question 2: Physical Load */}
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="space-y-3">
              <label className="text-sm font-medium text-green-900">
                2. How much physical activity/load today?
              </label>
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl">{getLoadEmoji(physicalLoad)}</span>
                <span className="text-3xl font-bold text-green-700">
                  {physicalLoad}/10
                </span>
              </div>
              <Slider
                min={0}
                max={10}
                step={1}
                value={physicalLoad}
                onChange={setPhysicalLoad}
              />
              <div className="flex justify-between text-xs text-green-700">
                <span>Sedentary</span>
                <span>Extreme</span>
              </div>
            </div>
          </Card>

          {/* Question 3: Recovery from Load */}
          <Card className="p-6 bg-cyan-50 border-cyan-200">
            <div className="space-y-3">
              <label className="text-sm font-medium text-cyan-900">
                3. How recovered do you feel from physical demands?
              </label>
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl">{getRecoveryEmoji(recoveryFromLoad)}</span>
                <span className="text-3xl font-bold text-cyan-700">
                  {recoveryFromLoad}/10
                </span>
              </div>
              <Slider
                min={0}
                max={10}
                step={1}
                value={recoveryFromLoad}
                onChange={setRecoveryFromLoad}
              />
              <div className="flex justify-between text-xs text-cyan-700">
                <span>Exhausted</span>
                <span>Fully Recovered</span>
              </div>
            </div>
          </Card>

          {/* Question 4: Psychological Stress */}
          <Card className="p-6 bg-orange-50 border-orange-200">
            <div className="space-y-3">
              <label className="text-sm font-medium text-orange-900">
                4. How stressed are you right now?
              </label>
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl">{getStressEmoji(psychologicalStress)}</span>
                <span className="text-3xl font-bold text-orange-700">
                  {psychologicalStress}/10
                </span>
              </div>
              <Slider
                min={0}
                max={10}
                step={1}
                value={psychologicalStress}
                onChange={setPsychologicalStress}
              />
              <div className="flex justify-between text-xs text-orange-700">
                <span>Calm</span>
                <span>Overwhelmed</span>
              </div>
            </div>
          </Card>

          {/* Question 5: Energy Level (ANCHOR METRIC) */}
          <Card className="p-6 bg-blue-50 border-2 border-blue-400">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-blue-900">
                  5. What's your current energy level?
                </label>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded font-semibold">
                  ANCHOR METRIC
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl">{getEnergyEmoji(energyLevel)}</span>
                <span className="text-3xl font-bold text-blue-700">
                  {energyLevel}/10
                </span>
              </div>
              <Slider
                min={0}
                max={10}
                step={1}
                value={energyLevel}
                onChange={setEnergyLevel}
              />
              <div className="flex justify-between text-xs text-blue-700">
                <span>Exhausted</span>
                <span>Energized</span>
              </div>
            </div>
          </Card>

          {/* Optional Notes - Collapsible */}
          <Accordion type="single" collapsible>
            <AccordionItem value="notes">
              <AccordionTrigger className="text-sm font-medium">
                Add Notes (Optional)
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional context about your current state..."
                    className="w-full p-3 border border-gray-200 rounded-md text-sm resize-none"
                    rows={3}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Info Box */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div className="flex-1">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Why these 5 questions?</strong>
                </p>
                <p className="text-xs text-gray-600">
                  This simplified system tracks your <strong>allostatic load</strong> - the cumulative
                  wear and tear on your body from stress. By tracking sleep, load, recovery, stress,
                  and energy daily, the system learns which factors most impact your wellbeing.
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
            {isSubmitting ? 'Logging...' : '✅ Complete Check-In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
