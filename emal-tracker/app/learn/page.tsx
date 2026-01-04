"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Understanding EMAL
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Energy Management & Allostatic Load
          </p>
          <p className="text-gray-500">
            Learn the science behind optimizing your energy through sleep, exercise, and stress management
          </p>
        </div>

        {/* Educational Tabs */}
        <Tabs defaultValue="energy" className="mb-8">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="energy">⚡ Energy</TabsTrigger>
            <TabsTrigger value="sleep">😴 Sleep</TabsTrigger>
            <TabsTrigger value="exercise">🏃 Exercise</TabsTrigger>
            <TabsTrigger value="stress">🧘 Stress</TabsTrigger>
          </TabsList>

          {/* Energy Tab */}
          <TabsContent value="energy">
            <Card>
              <CardHeader>
                <CardTitle>Energy Sources & Management</CardTitle>
                <CardDescription>
                  How your body produces and uses energy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">🔬</span>
                    ATP: Your Body's Energy Currency
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your body produces energy through ATP (adenosine triphosphate) in mitochondria.
                    Every cell contains these "power plants" that convert nutrients from food into usable energy.
                    Understanding and optimizing this process is key to sustained energy throughout the day.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Daily Energy Expenditure
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-2 ml-6">
                    <li><strong>Brain:</strong> ~20% of total energy (despite being only 2% of body weight)</li>
                    <li><strong>Vital functions:</strong> Breathing, heartbeat, digestion, circulation</li>
                    <li><strong>Allostasis (stress response):</strong> Can increase energy use by 15-67%</li>
                    <li><strong>Growth & repair:</strong> Cell regeneration, wound healing, immune function</li>
                    <li><strong>Physical activity:</strong> Varies widely based on intensity and duration</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">⚖️</span>
                    Energy Balance
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your perceived energy level depends on the balance between energy production (from food, sleep, recovery)
                    and energy expenditure (physical activity, mental work, stress response). When expenditure consistently
                    exceeds production, you experience fatigue and reduced performance.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">💡</span>
                    Factors Affecting Energy
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-sm text-green-800 mb-1">Positive Factors</h4>
                      <ul className="text-xs text-gray-700 space-y-1">
                        <li>• Quality sleep (7-9 hours)</li>
                        <li>• Regular exercise</li>
                        <li>• Balanced nutrition</li>
                        <li>• Hydration</li>
                        <li>• Stress management</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-medium text-sm text-red-800 mb-1">Negative Factors</h4>
                      <ul className="text-xs text-gray-700 space-y-1">
                        <li>• Sleep deprivation</li>
                        <li>• Chronic stress</li>
                        <li>• Poor nutrition</li>
                        <li>• Dehydration</li>
                        <li>• Sedentary lifestyle</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sleep Tab */}
          <TabsContent value="sleep">
            <Card>
              <CardHeader>
                <CardTitle>Sleep Science</CardTitle>
                <CardDescription>
                  Why 7-9 hours of quality sleep is essential
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">💤</span>
                    Sleep Stages & Functions
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Sleep cycles through 4-6 stages each night, each serving critical functions:
                  </p>
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-sm text-blue-800">NREM Stage 1-2 (Light Sleep)</h4>
                      <p className="text-xs text-gray-700">Transition to sleep, body temperature drops, heart rate slows</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-sm text-purple-800">NREM Stage 3 (Deep Sleep)</h4>
                      <p className="text-xs text-gray-700">Physical restoration, immune system boost, memory consolidation</p>
                    </div>
                    <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                      <h4 className="font-medium text-sm text-pink-800">REM Sleep</h4>
                      <p className="text-xs text-gray-700">Emotional processing, creativity, procedural memory, brain detox</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    Energy Savings During Sleep
                  </h3>
                  <p className="text-sm text-gray-600">
                    Sleep saves <strong>30-50% of energy</strong> compared to waking hours. Your brain, which uses ~20%
                    of daily energy while awake, reduces consumption significantly during deep sleep. This energy conservation
                    is critical for next-day performance.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">🧠</span>
                    Glymphatic System
                  </h3>
                  <p className="text-sm text-gray-600">
                    During sleep, the glymphatic system (brain's waste clearance system) becomes 10x more active.
                    It removes metabolic waste products, including beta-amyloid proteins associated with Alzheimer's disease.
                    This "brain cleaning" only happens effectively during sleep.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">📉</span>
                    Sleep Debt Impact
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1 ml-6">
                    <li>• <strong>Cognitive performance:</strong> Even one night of poor sleep reduces focus and decision-making</li>
                    <li>• <strong>Immune function:</strong> Sleep deprivation weakens immune response by up to 70%</li>
                    <li>• <strong>Emotional regulation:</strong> 60% increase in emotional reactivity after poor sleep</li>
                    <li>• <strong>Metabolic health:</strong> Disrupted glucose metabolism, increased hunger hormones</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">✅</span>
                    Sleep Optimization Tips
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Before Bed</h4>
                      <ul className="text-xs text-gray-700 space-y-1">
                        <li>• Consistent bedtime (within 30 min)</li>
                        <li>• No screens 1 hour before</li>
                        <li>• Cool room (65-68°F / 18-20°C)</li>
                        <li>• No caffeine after 2 PM</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Sleep Environment</h4>
                      <ul className="text-xs text-gray-700 space-y-1">
                        <li>• Complete darkness (or eye mask)</li>
                        <li>• Quiet (or white noise)</li>
                        <li>• Comfortable mattress/pillow</li>
                        <li>• Reserve bed for sleep only</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exercise Tab */}
          <TabsContent value="exercise">
            <Card>
              <CardHeader>
                <CardTitle>Exercise Benefits</CardTitle>
                <CardDescription>
                  Why physical activity is essential for energy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">🏋️</span>
                    WHO Guidelines
                  </h3>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Adults (18-64 years):</strong>
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1 ml-6">
                      <li>• <strong>300+ minutes</strong> of moderate-intensity activity per week (≈43 min/day)</li>
                      <li>• OR <strong>150+ minutes</strong> of vigorous-intensity activity per week (≈22 min/day)</li>
                      <li>• Muscle-strengthening activities 2+ days/week</li>
                      <li>• Limit sedentary time</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">🔋</span>
                    Mitochondrial Benefits
                  </h3>
                  <p className="text-sm text-gray-600">
                    Regular exercise increases mitochondria count and efficiency (mitochondrial biogenesis).
                    More mitochondria = more ATP production = more sustained energy. This effect builds over weeks
                    and months of consistent training.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">🧪</span>
                    Hormonal Response
                  </h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-sm text-green-800">Acute Effects (during/after)</h4>
                      <ul className="text-xs text-gray-700 space-y-1">
                        <li>• Endorphins: Natural pain relief, mood boost</li>
                        <li>• Dopamine: Motivation, reward, focus</li>
                        <li>• Serotonin: Mood regulation, well-being</li>
                        <li>• Adrenaline: Alertness, energy mobilization</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-sm text-blue-800">Long-term Adaptations</h4>
                      <ul className="text-xs text-gray-700 space-y-1">
                        <li>• BDNF (Brain-Derived Neurotrophic Factor): Neuroplasticity, learning</li>
                        <li>• Improved insulin sensitivity: Better glucose regulation</li>
                        <li>• Reduced cortisol baseline: Lower chronic stress</li>
                        <li>• Enhanced cardiovascular efficiency: Less effort for daily tasks</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">⏰</span>
                    Energy Paradox
                  </h3>
                  <p className="text-sm text-gray-600">
                    Exercise <em>costs</em> energy in the short term but <em>increases</em> total available energy over time.
                    Regular exercisers report 20-40% higher energy levels than sedentary individuals, despite expending more
                    energy on physical activity. The key is consistency and progressive overload.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    Intensity Zones
                  </h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-sm text-green-800">Low (50-60% max HR)</h4>
                      <p className="text-xs text-gray-700">Walking, light yoga. Can talk easily. Recovery, fat burning.</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-medium text-sm text-yellow-800">Moderate (60-70% max HR)</h4>
                      <p className="text-xs text-gray-700">Brisk walking, cycling. Can talk with effort. Cardiovascular fitness.</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <h4 className="font-medium text-sm text-orange-800">High (70-85% max HR)</h4>
                      <p className="text-xs text-gray-700">Running, interval training. Hard to talk. VO2 max improvement.</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-medium text-sm text-red-800">Vigorous (85-95% max HR)</h4>
                      <p className="text-xs text-gray-700">Sprinting, HIIT. Cannot talk. Anaerobic capacity, performance.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stress Tab */}
          <TabsContent value="stress">
            <Card>
              <CardHeader>
                <CardTitle>Stress & Allostatic Load</CardTitle>
                <CardDescription>
                  Understanding and managing your body's stress response
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">⚖️</span>
                    What is Allostasis?
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Allostasis</strong> is your body's process of adapting to stress by changing internal parameters
                    (heart rate, cortisol, blood pressure). <strong>Allostatic load</strong> is the "wear and tear" from chronic
                    stress adaptation. When stress is constant, your body stays in high-alert mode, draining energy reserves.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">📈</span>
                    Energy Cost of Stress
                  </h3>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-gray-700 mb-2">
                      According to the EMAL model, allostasis can increase daily energy expenditure by:
                    </p>
                    <p className="text-3xl font-bold text-red-600 text-center my-3">
                      15-67%
                    </p>
                    <p className="text-xs text-gray-600">
                      This means chronic stress can use as much energy as a full workout session - every single day.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    Stress Response Cascade
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-2 ml-6">
                    <li><strong>Immediate (seconds):</strong> Adrenaline release, increased heart rate, rapid breathing</li>
                    <li><strong>Short-term (minutes-hours):</strong> Cortisol release, glucose mobilization, heightened alertness</li>
                    <li><strong>Chronic (days-months):</strong> Elevated baseline cortisol, disrupted sleep, weakened immune system,
                    digestive issues, mood disorders</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">🫁</span>
                    Breathing for Stress Reduction
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Controlled breathing activates the parasympathetic nervous system (rest & digest),
                    counteracting stress response:
                  </p>
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-sm">Box Breathing (4-4-4-4)</h4>
                      <p className="text-xs text-gray-700">Inhale 4s, Hold 4s, Exhale 4s, Hold 4s. Reduces cortisol in 5-10 minutes.</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-sm">4-7-8 Technique</h4>
                      <p className="text-xs text-gray-700">Inhale 4s, Hold 7s, Exhale 8s. Activates vagus nerve, promotes calm.</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-sm">Coherent Breathing</h4>
                      <p className="text-xs text-gray-700">5-6 breaths/min (5s in, 5s out). Optimizes heart rate variability.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">🙏</span>
                    Gratitude Practice
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Daily gratitude journaling has measurable effects:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-6">
                    <li>• Reduces cortisol by up to 23%</li>
                    <li>• Increases serotonin and dopamine (mood hormones)</li>
                    <li>• Improves heart rate variability (stress resilience indicator)</li>
                    <li>• Enhances sleep quality and duration</li>
                    <li>• Activates brain regions for social bonding and empathy</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">🧠</span>
                    Monitor & Accept (MAT)
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Monitor and Acceptance Therapy approach to mindfulness:
                  </p>
                  <ol className="text-sm text-gray-600 space-y-2 ml-6 list-decimal">
                    <li><strong>Monitor:</strong> Observe thoughts and emotions without judgment. Name what you feel.</li>
                    <li><strong>Accept:</strong> Acknowledge feelings without trying to change them. "It's okay to feel this way."</li>
                    <li><strong>Respond mindfully:</strong> Choose actions based on values, not impulses or avoidance.</li>
                  </ol>
                  <p className="text-sm text-gray-600 mt-3">
                    This reduces "meta-stress" (stressing about being stressed) and conserves energy.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Apply What You've Learned?</h2>
          <p className="mb-6 text-blue-100">
            Start tracking your energy, sleep, exercise, and stress to see real improvements
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button asChild variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              <Link href="/energy">Track Energy</Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              <Link href="/sleep">Track Sleep</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
