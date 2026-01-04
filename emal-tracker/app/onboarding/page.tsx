"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EnergyRing } from '@/components/health/EnergyRing'

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [baselineEnergy, setBaselineEnergy] = useState(5)
  const [trackingPreferences, setTrackingPreferences] = useState({
    energy: true,
    sleep: true,
    exercise: true,
    stress: true,
  })

  const handleComplete = () => {
    // Store completion in localStorage
    localStorage.setItem('hasCompletedOnboarding', 'true')

    // Store preferences
    localStorage.setItem('trackingPreferences', JSON.stringify(trackingPreferences))

    // Redirect to home
    router.push('/')
  }

  const steps = [
    // Step 1: Welcome & EMAL Intro
    {
      title: 'Welcome to EMAL Tracker',
      description: 'Your science-based fitness companion',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">
              E
            </div>
            <h2 className="text-2xl font-bold mb-2">Energy Management & Allostatic Load</h2>
            <p className="text-gray-600 mb-6">
              Track your energy, sleep, exercise, and stress to optimize your wellbeing
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-2 text-blue-900">What is EMAL?</h3>
            <p className="text-sm text-blue-800 mb-3">
              EMAL is a science-based model that helps you understand how your daily habits affect your energy levels:
            </p>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-lg">⚡</span>
                <div>
                  <strong>Energy:</strong> Track fluctuations throughout the day
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg">😴</span>
                <div>
                  <strong>Sleep:</strong> 7-9 hours saves 30-50% daily energy expenditure
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg">🏃</span>
                <div>
                  <strong>Exercise:</strong> Builds mitochondria for more energy production
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg">🧘</span>
                <div>
                  <strong>Stress:</strong> Reduces allostatic load (15-67% energy increase when stressed)
                </div>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <Button onClick={() => setCurrentStep(1)} size="lg" className="w-full md:w-auto">
              Get Started →
            </Button>
          </div>
        </div>
      ),
    },

    // Step 2: Set Baseline Energy
    {
      title: 'Set Your Baseline',
      description: 'How are you feeling right now?',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Let's start by recording your current energy level. This will help us track your progress.
            </p>

            <div className="flex justify-center mb-6">
              <EnergyRing level={baselineEnergy} size="lg" showLabel={true} />
            </div>

            <div className="max-w-md mx-auto">
              <input
                type="range"
                min="1"
                max="10"
                value={baselineEnergy}
                onChange={(e) => setBaselineEnergy(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Exhausted</span>
                <span>Energized</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              💡 <strong>Tip:</strong> Your energy level will fluctuate throughout the day.
              This baseline helps us understand your starting point.
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => setCurrentStep(0)} variant="outline" className="flex-1">
              ← Back
            </Button>
            <Button onClick={() => setCurrentStep(2)} className="flex-1">
              Next →
            </Button>
          </div>
        </div>
      ),
    },

    // Step 3: Choose Tracking Preferences
    {
      title: 'Choose What to Track',
      description: 'Select the metrics you want to monitor',
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 text-center">
            You can always change these preferences later in settings.
          </p>

          <div className="space-y-3">
            {[
              { key: 'energy', label: 'Energy Levels', emoji: '⚡', description: 'Track daily energy fluctuations' },
              { key: 'sleep', label: 'Sleep Quality', emoji: '😴', description: 'Monitor sleep duration and quality' },
              { key: 'exercise', label: 'Exercise', emoji: '🏃', description: 'Log workouts and track progress' },
              { key: 'stress', label: 'Stress Management', emoji: '🧘', description: 'Track stress levels and use relief tools' },
            ].map((item) => (
              <label
                key={item.key}
                className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  trackingPreferences[item.key as keyof typeof trackingPreferences]
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={trackingPreferences[item.key as keyof typeof trackingPreferences]}
                  onChange={(e) => setTrackingPreferences({
                    ...trackingPreferences,
                    [item.key]: e.target.checked
                  })}
                  className="mt-1 w-5 h-5 rounded border-gray-300"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              💡 <strong>Recommendation:</strong> Tracking all 4 metrics gives you the most comprehensive
              insights into your energy patterns and wellbeing.
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => setCurrentStep(1)} variant="outline" className="flex-1">
              ← Back
            </Button>
            <Button
              onClick={handleComplete}
              className="flex-1"
              disabled={!Object.values(trackingPreferences).some(v => v)}
            >
              Complete Setup →
            </Button>
          </div>
        </div>
      ),
    },
  ]

  const currentStepData = steps[currentStep]

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full mx-1 transition-colors ${
                  index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
            <CardDescription>{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStepData.content}
          </CardContent>
        </Card>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            onClick={handleComplete}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Skip onboarding
          </button>
        </div>
      </div>
    </main>
  )
}
