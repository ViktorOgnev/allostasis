"use client"

import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { colors } from '@/app/design-tokens/colors'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface BreathingPattern {
  name: string
  description: string
  phases: {
    name: string
    duration: number
    instruction: string
    color: string
  }[]
}

const breathingPatterns: Record<string, BreathingPattern> = {
  box: {
    name: 'Box Breathing',
    description: 'Equal duration for all phases - promotes calmness and focus',
    phases: [
      { name: 'Breathe In', duration: 8, instruction: 'Inhale slowly through your nose', color: colors.primary },
      { name: 'Hold', duration: 8, instruction: 'Hold your breath gently', color: colors.secondary },
      { name: 'Breathe Out', duration: 8, instruction: 'Exhale slowly through your mouth', color: colors.success },
      { name: 'Hold', duration: 8, instruction: 'Hold your breath gently', color: colors.warning },
    ],
  },
  '478': {
    name: '4-7-8 Breathing',
    description: 'Dr. Andrew Weil\'s technique for relaxation and sleep',
    phases: [
      { name: 'Breathe In', duration: 8, instruction: 'Inhale quietly through your nose', color: colors.primary },
      { name: 'Hold', duration: 14, instruction: 'Hold your breath', color: colors.secondary },
      { name: 'Breathe Out', duration: 16, instruction: 'Exhale completely through your mouth', color: colors.success },
    ],
  },
  coherent: {
    name: 'Coherent Breathing',
    description: '10-10 breathing for heart rate variability and stress relief',
    phases: [
      { name: 'Breathe In', duration: 10, instruction: 'Inhale slowly and deeply', color: colors.primary },
      { name: 'Breathe Out', duration: 10, instruction: 'Exhale slowly and completely', color: colors.success },
    ],
  },
}

export function BreathingTimer() {
  const [selectedPattern, setSelectedPattern] = useState<string>('box')
  const [isActive, setIsActive] = useState(false)
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [secondsRemaining, setSecondsRemaining] = useState(0)
  const [cyclesCompleted, setCyclesCompleted] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [stressLevelBefore, setStressLevelBefore] = useState<number | null>(null)
  const [stressLevelAfter, setStressLevelAfter] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)

  const pattern = breathingPatterns[selectedPattern]
  const currentPhase = pattern.phases[currentPhaseIndex]
  const cycleTime = pattern.phases.reduce((sum, phase) => sum + phase.duration, 0)

  useEffect(() => {
    if (!isActive) return

    if (secondsRemaining > 0) {
      const timer = setTimeout(() => {
        setSecondsRemaining(secondsRemaining - 1)
        setTotalDuration(totalDuration + 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      // Move to next phase
      const nextPhaseIndex = (currentPhaseIndex + 1) % pattern.phases.length

      if (nextPhaseIndex === 0) {
        setCyclesCompleted(cyclesCompleted + 1)
      }

      setCurrentPhaseIndex(nextPhaseIndex)
      setSecondsRemaining(pattern.phases[nextPhaseIndex].duration)
    }
  }, [isActive, secondsRemaining, currentPhaseIndex, pattern.phases, cyclesCompleted, totalDuration])

  const startSession = () => {
    if (stressLevelBefore === null) {
      toast.error('Please rate your stress level before starting')
      return
    }
    setIsActive(true)
    setCurrentPhaseIndex(0)
    setSecondsRemaining(pattern.phases[0].duration)
    setCyclesCompleted(0)
    setTotalDuration(0)
    setShowResults(false)
  }

  const pauseSession = () => {
    setIsActive(false)
  }

  const resumeSession = () => {
    setIsActive(true)
  }

  const endSession = () => {
    setIsActive(false)
    if (stressLevelAfter !== null && stressLevelBefore !== null) {
      setShowResults(true)
    }
  }

  const resetSession = () => {
    setIsActive(false)
    setCurrentPhaseIndex(0)
    setSecondsRemaining(0)
    setCyclesCompleted(0)
    setTotalDuration(0)
    setStressLevelBefore(null)
    setStressLevelAfter(null)
    setShowResults(false)
  }

  // Calculate circle animation
  const progress = secondsRemaining > 0 ? (currentPhase.duration - secondsRemaining) / currentPhase.duration : 0
  const scale = 0.5 + (progress * 0.5) // Scale from 0.5 to 1.0

  return (
    <div className="space-y-6">
      {/* Pattern Selection */}
      {!isActive && !showResults && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Breathing Pattern</CardTitle>
            <CardDescription>Select a technique that works best for you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {Object.entries(breathingPatterns).map(([key, pattern]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPattern(key)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedPattern === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-sm mb-1">{pattern.name}</div>
                  <div className="text-xs text-gray-600">{pattern.description}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    Cycle: {pattern.phases.map(p => p.duration).join('-')} seconds
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pre-Session Stress Level */}
      {!isActive && !showResults && (
        <Card>
          <CardHeader>
            <CardTitle>Before You Begin</CardTitle>
            <CardDescription>How stressed do you feel right now?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Stress Level</span>
                <span className={`text-2xl font-bold ${
                  stressLevelBefore === null ? 'text-gray-400' :
                  stressLevelBefore <= 3 ? 'text-green-600' :
                  stressLevelBefore <= 6 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {stressLevelBefore ?? '?'}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevelBefore ?? 5}
                onChange={(e) => setStressLevelBefore(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>😌 Calm</span>
                <span>😰 Very Stressed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Breathing Animation */}
      {isActive && (
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center">
              {/* Animated Circle */}
              <div className="relative w-64 h-64 mb-8">
                <div
                  className="absolute inset-0 rounded-full transition-all duration-1000 ease-in-out flex items-center justify-center"
                  style={{
                    backgroundColor: currentPhase.color + '20',
                    border: `4px solid ${currentPhase.color}`,
                    transform: `scale(${scale})`,
                  }}
                >
                  <div className="text-center">
                    <div className="text-6xl font-bold" style={{ color: currentPhase.color }}>
                      {secondsRemaining}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">seconds</div>
                  </div>
                </div>
              </div>

              {/* Phase Instruction */}
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2" style={{ color: currentPhase.color }}>
                  {currentPhase.name}
                </h2>
                <p className="text-gray-600">{currentPhase.instruction}</p>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mb-6 text-sm text-gray-600">
                <div className="text-center">
                  <div className="font-bold text-2xl text-blue-600">{cyclesCompleted}</div>
                  <div>Cycles</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-2xl text-green-600">
                    {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}
                  </div>
                  <div>Duration</div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-3">
                <Button
                  onClick={pauseSession}
                  variant="outline"
                >
                  ⏸ Pause
                </Button>
                <Button
                  onClick={endSession}
                  variant="outline"
                >
                  ⏹ End Session
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paused State */}
      {!isActive && !showResults && cyclesCompleted > 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Session paused</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={resumeSession}>▶ Resume</Button>
              <Button onClick={endSession} variant="outline">⏹ End Session</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Start Button */}
      {!isActive && !showResults && cyclesCompleted === 0 && stressLevelBefore !== null && (
        <Button onClick={startSession} className="w-full" size="lg">
          Start {pattern.name}
        </Button>
      )}

      {/* Post-Session */}
      {!isActive && cyclesCompleted > 0 && !showResults && (
        <Card>
          <CardHeader>
            <CardTitle>How Do You Feel Now?</CardTitle>
            <CardDescription>Rate your stress level after the breathing exercise</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Stress Level</span>
                <span className={`text-2xl font-bold ${
                  stressLevelAfter === null ? 'text-gray-400' :
                  stressLevelAfter <= 3 ? 'text-green-600' :
                  stressLevelAfter <= 6 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {stressLevelAfter ?? '?'}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevelAfter ?? 5}
                onChange={(e) => setStressLevelAfter(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <Button onClick={endSession} className="w-full mt-4" disabled={stressLevelAfter === null}>
                Complete Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {showResults && stressLevelBefore !== null && stressLevelAfter !== null && (
        <Card>
          <CardHeader>
            <CardTitle>Session Complete!</CardTitle>
            <CardDescription>
              {cyclesCompleted} cycles • {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')} minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Stress Level Change</span>
                  <span className={`text-2xl font-bold ${
                    stressLevelAfter < stressLevelBefore ? 'text-green-600' :
                    stressLevelAfter > stressLevelBefore ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {stressLevelAfter < stressLevelBefore ? '↓' : stressLevelAfter > stressLevelBefore ? '↑' : '→'}
                    {' '}
                    {Math.abs(stressLevelAfter - stressLevelBefore)} points
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Before: {stressLevelBefore}/10</span>
                  <span>After: {stressLevelAfter}/10</span>
                </div>
              </div>

              {stressLevelAfter < stressLevelBefore && (
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-green-800 font-medium">🎉 Great job! Your stress level decreased.</p>
                  <p className="text-sm text-green-700 mt-1">
                    Regular practice strengthens your stress response over time.
                  </p>
                </div>
              )}

              <Button onClick={resetSession} className="w-full">
                Start New Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
