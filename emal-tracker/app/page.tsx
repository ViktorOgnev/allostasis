"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { DashboardOverview } from '@/components/dashboard/DashboardOverview'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { GoalProgress } from '@/components/health/GoalProgress'
import { useEnergyStore } from '@/store/energyStore'
import { useSleepStore } from '@/store/sleepStore'
import { useExerciseStore } from '@/store/exerciseStore'
import { useStressLevelStore } from '@/store/stressLevelStore'

export default function Home() {
  // Load all data on mount
  const loadEnergy = useEnergyStore((state) => state.loadEntries)
  const loadSleep = useSleepStore((state) => state.loadEntries)
  const loadExercise = useExerciseStore((state) => state.loadEntries)
  const loadStress = useStressLevelStore((state) => state.loadEntries)

  useEffect(() => {
    loadEnergy()
    loadSleep()
    loadExercise()
    loadStress()
  }, [loadEnergy, loadSleep, loadExercise, loadStress])

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            EMAL Fitness Tracker
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-2">
            Track energy, sleep, exercise, and stress
          </p>
          <p className="text-sm text-gray-500">
            Simple tracker to help you feel better every day
          </p>
        </div>

        {/* Quick Actions - Primary CTA */}
        <QuickActions />

        {/* Dashboard Overview */}
        <DashboardOverview />

        {/* Weekly Goals Progress */}
        <GoalProgress />

        {/* Learn More - Collapsed by default */}
        <Accordion type="single" collapsible className="max-w-4xl mx-auto mt-8">
          <AccordionItem value="about" className="border rounded-lg">
            <AccordionTrigger className="text-sm text-gray-600 px-4">
              Learn more about EMAL science ▼
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  EMAL (Energy Management & Allostatic Load) helps you understand how sleep, exercise, and stress management affect your daily energy levels.
                  Track these metrics to identify patterns and optimize your wellbeing.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link href="/energy">
                    <Button variant="outline" size="sm" className="w-full">
                      ⚡ Energy
                    </Button>
                  </Link>
                  <Link href="/sleep">
                    <Button variant="outline" size="sm" className="w-full">
                      😴 Sleep
                    </Button>
                  </Link>
                  <Link href="/exercise">
                    <Button variant="outline" size="sm" className="w-full">
                      🏃 Exercise
                    </Button>
                  </Link>
                  <Link href="/stress">
                    <Button variant="outline" size="sm" className="w-full">
                      🧘 Stress
                    </Button>
                  </Link>
                </div>
                <div className="pt-2">
                  <Link href="/learn">
                    <Button variant="link" size="sm" className="text-xs">
                      Read full EMAL guide →
                    </Button>
                  </Link>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  );
}
