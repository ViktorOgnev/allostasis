"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StressLogForm } from '@/components/forms/StressLogForm'
import { StressLevelChart } from '@/components/charts/StressLevelChart'
import { StressRecentEntries } from '@/components/layout/StressRecentEntries'
import { useStressLevelStore } from '@/store/stressLevelStore'

export default function StressPage() {
  const { entries, loadEntries } = useStressLevelStore()

  useEffect(() => {
    loadEntries()
  }, [loadEntries])

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Stress Management
          </h1>
          <p className="text-gray-600 mb-4">
            Track your stress levels and use science-based tools to reduce stress and lower allostatic load.
          </p>
        </div>

        {/* Stress Tracking Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Left Column: Form */}
          <div>
            <StressLogForm />
          </div>

          {/* Right Column: Chart and Recent Entries */}
          <div className="space-y-6">
            <StressLevelChart entries={entries} />
            <StressRecentEntries entries={entries} limit={5} />
          </div>
        </div>

        {/* Section Divider */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Stress Management Tools</h2>
          <p className="text-gray-600">
            Use these science-based practices to actively reduce your stress
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Breathing Exercises */}
          <Link href="/stress/breathing">
            <Card className="hover:shadow-lg transition cursor-pointer h-full">
              <CardHeader>
                <div className="text-4xl mb-2">🫁</div>
                <CardTitle>Breathing Exercises</CardTitle>
                <CardDescription>
                  Guided breathing patterns to activate parasympathetic nervous system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>• Box Breathing (4-4-4-4)</div>
                  <div>• 4-7-8 Technique</div>
                  <div>• Coherent Breathing</div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Gratitude Journal */}
          <Link href="/stress/gratitude">
            <Card className="hover:shadow-lg transition cursor-pointer h-full">
              <CardHeader>
                <div className="text-4xl mb-2">📝</div>
                <CardTitle>Gratitude Journal</CardTitle>
                <CardDescription>
                  Daily practice to reduce stress and improve mood
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>• Write 3-5 gratitudes daily</div>
                  <div>• Reduces cortisol levels</div>
                  <div>• Improves sleep quality</div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Mindfulness */}
          <Link href="/stress/mindfulness">
            <Card className="hover:shadow-lg transition cursor-pointer h-full">
              <CardHeader>
                <div className="text-4xl mb-2">🧘</div>
                <CardTitle>Mindfulness Practices</CardTitle>
                <CardDescription>
                  Monitor and Acceptance Therapy (MAT) techniques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>• Body scan meditation</div>
                  <div>• Emotion observation</div>
                  <div>• Present moment awareness</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* About Stress & Energy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Understanding Stress & Allostatic Load</CardTitle>
            <CardDescription>
              How stress affects your energy levels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Energy Cost of Stress
              </h3>
              <p className="text-sm text-gray-600">
                According to the EMAL model, allostasis (your body's stress response) can increase
                daily energy expenditure by <strong>15-67%</strong>. When you're stressed, your body:
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-6">
                <li>• Releases cortisol and adrenaline</li>
                <li>• Increases heart rate and blood pressure</li>
                <li>• Diverts energy from digestion and immune function</li>
                <li>• Reduces sleep quality</li>
                <li>• Impairs cognitive function</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">🫁</span>
                How Breathing Helps
              </h3>
              <p className="text-sm text-gray-600">
                Controlled breathing activates the <strong>parasympathetic nervous system</strong> (rest & digest),
                counteracting the stress response. Benefits include:
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-6">
                <li>• Reduced cortisol levels within minutes</li>
                <li>• Lower heart rate and blood pressure</li>
                <li>• Improved oxygen delivery to brain</li>
                <li>• Enhanced emotional regulation</li>
                <li>• Better decision-making ability</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">🙏</span>
                Science of Gratitude
              </h3>
              <p className="text-sm text-gray-600">
                Regular gratitude practice has measurable effects on brain chemistry and stress hormones:
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-6">
                <li>• Increases serotonin and dopamine (mood hormones)</li>
                <li>• Reduces cortisol by up to 23%</li>
                <li>• Activates brain regions for social bonding</li>
                <li>• Improves heart rate variability (stress resilience)</li>
                <li>• Enhances sleep quality and duration</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">🧠</span>
                Monitor & Acceptance Theory (MAT)
              </h3>
              <p className="text-sm text-gray-600">
                MAT is a mindfulness approach where you:
              </p>
              <ol className="text-sm text-gray-600 mt-2 space-y-1 ml-6 list-decimal">
                <li><strong>Monitor:</strong> Observe your thoughts and emotions without judgment</li>
                <li><strong>Accept:</strong> Acknowledge feelings without trying to change them</li>
                <li><strong>Respond mindfully:</strong> Choose actions based on values, not impulses</li>
              </ol>
              <p className="text-sm text-gray-600 mt-2">
                This reduces the secondary stress of "stressing about being stressed" and conserves energy.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Energy Management Tips */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Stress Relief Techniques</CardTitle>
            <CardDescription>
              Use these when you feel overwhelmed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sm mb-2">🫁 30-Second Breathing Reset</h3>
                <ol className="text-sm text-gray-700 space-y-1">
                  <li>1. Breathe in deeply through nose (4 sec)</li>
                  <li>2. Hold breath (4 sec)</li>
                  <li>3. Exhale slowly through mouth (6 sec)</li>
                  <li>4. Repeat 2-3 times</li>
                </ol>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sm mb-2">🏃 Physical Movement</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 5-minute walk outside</li>
                  <li>• Gentle stretching</li>
                  <li>• Progressive muscle relaxation</li>
                  <li>• Jump or dance to music</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sm mb-2">🧠 Mental Reframe</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Name 5 things you can see</li>
                  <li>• 4 things you can touch</li>
                  <li>• 3 things you can hear</li>
                  <li>• 2 things you can smell</li>
                  <li>• 1 thing you can taste</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sm mb-2">❄️ Cold Exposure</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Splash cold water on face</li>
                  <li>• Hold ice cube briefly</li>
                  <li>• Step outside in cool air</li>
                  <li>• Activates vagus nerve</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Start Managing Your Stress Today</h2>
          <p className="mb-4 text-purple-100">
            Even 5 minutes of daily practice can significantly reduce your allostatic load
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild variant="secondary">
              <Link href="/stress/breathing">Try Breathing Exercise →</Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              <Link href="/stress/gratitude">Write Gratitude →</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
