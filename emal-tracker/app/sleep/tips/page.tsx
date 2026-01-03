import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SleepTipsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/sleep">← Back to Sleep Tracking</Link>
          </Button>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sleep Optimization Tips
          </h1>
          <p className="text-gray-600">
            Science-based strategies to improve your sleep quality and energy levels
          </p>
        </div>

        {/* Sleep Duration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-3xl">⏰</span>
              Sleep Duration: 7-9 Hours
            </CardTitle>
            <CardDescription>
              The foundation of good sleep
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700">
              Most adults need 7-9 hours of sleep per night for optimal functioning. Individual needs
              vary, but consistently getting less than 6 hours significantly impairs cognitive
              performance, mood, and energy levels.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-medium text-sm mb-2">Why 7-9 Hours?</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Allows completion of 4-6 full sleep cycles (90 min each)</li>
                <li>• Sufficient time for deep sleep and REM sleep</li>
                <li>• Maximizes memory consolidation and learning</li>
                <li>• Optimizes hormone regulation and cellular repair</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Consistency */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-3xl">📅</span>
              Consistent Sleep Schedule
            </CardTitle>
            <CardDescription>
              Your body loves routine
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700">
              Going to bed and waking up at the same time every day (including weekends) helps
              regulate your circadian rhythm, making it easier to fall asleep and wake up naturally.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <p className="font-medium text-sm">Do:</p>
                  <p className="text-sm text-gray-600">
                    Set a consistent bedtime and wake time, even on weekends (within 1 hour)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <div>
                  <p className="font-medium text-sm">Avoid:</p>
                  <p className="text-sm text-gray-600">
                    Drastically different sleep schedules on weekends (social jet lag)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Morning Sunlight */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-3xl">☀️</span>
              Morning Sunlight Exposure
            </CardTitle>
            <CardDescription>
              Reset your circadian rhythm
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700">
              Exposure to bright light (especially sunlight) within 30-60 minutes of waking helps
              anchor your circadian rhythm and improves nighttime sleep quality.
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="font-medium text-sm mb-2">How to do it:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Get outside for 10-30 minutes within an hour of waking</li>
                <li>• If outdoors isn't possible, sit near a bright window</li>
                <li>• Cloudy days still provide sufficient light intensity</li>
                <li>• Combine with morning exercise or a walk for extra benefits</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Temperature */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-3xl">🌡️</span>
              Cool Bedroom Temperature
            </CardTitle>
            <CardDescription>
              Optimize for deep sleep
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700">
              Your body temperature naturally drops during sleep. A cool bedroom (15-19°C / 60-67°F)
              facilitates this process and promotes deeper, more restorative sleep.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="font-medium text-sm mb-1">Ideal Range</p>
                <p className="text-2xl font-bold text-blue-600">15-19°C</p>
                <p className="text-xs text-gray-600">60-67°F</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-sm mb-1">Additional Tips</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Use breathable bedding</li>
                  <li>• Take a warm shower before bed</li>
                  <li>• Keep room well-ventilated</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Caffeine */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-3xl">☕</span>
              No Caffeine After 2pm
            </CardTitle>
            <CardDescription>
              Caffeine has a 5-6 hour half-life
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700">
              Caffeine blocks adenosine receptors, preventing the natural build-up of sleep pressure.
              Even if you can "sleep on caffeine," it reduces deep sleep quality.
            </p>
            <div className="space-y-2">
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="font-medium text-sm mb-2">Caffeine Timeline:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>Half-life:</strong> 5-6 hours (varies by individual)</li>
                  <li>• Coffee at 2pm = 50% still active at 8pm</li>
                  <li>• Coffee at 4pm = 50% still active at 10pm</li>
                  <li>• Complete clearance can take 10+ hours</li>
                </ul>
              </div>
              <p className="text-xs text-gray-600">
                Sources: Coffee, tea, energy drinks, chocolate, some medications
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Alcohol */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-3xl">🍷</span>
              Limit Alcohol Before Bed
            </CardTitle>
            <CardDescription>
              Alcohol disrupts sleep architecture
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700">
              While alcohol may help you fall asleep faster, it significantly disrupts REM sleep
              and causes more frequent awakenings in the second half of the night.
            </p>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="font-medium text-sm mb-2">Effects of Alcohol on Sleep:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Reduces REM sleep (critical for memory and learning)</li>
                <li>• Increases sleep fragmentation and awakenings</li>
                <li>• Worsens snoring and sleep apnea</li>
                <li>• Causes dehydration and poor sleep quality</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              If consuming alcohol, finish at least 3-4 hours before bedtime and stay hydrated.
            </p>
          </CardContent>
        </Card>

        {/* Screen Time */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-3xl">📱</span>
              No Screens 1 Hour Before Bed
            </CardTitle>
            <CardDescription>
              Blue light suppresses melatonin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700">
              Blue light from screens suppresses melatonin production, making it harder to fall
              asleep. The content (emails, social media) can also increase mental arousal.
            </p>
            <div className="space-y-3">
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="font-medium text-sm mb-1">Avoid:</p>
                <p className="text-sm text-gray-600">
                  Phones, tablets, computers, TV within 1 hour of bedtime
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="font-medium text-sm mb-1">Instead, try:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Reading a physical book</li>
                  <li>• Light stretching or yoga</li>
                  <li>• Meditation or breathing exercises</li>
                  <li>• Journaling or gratitude practice</li>
                  <li>• Listening to calm music or podcasts</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Timing */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-3xl">🏃</span>
              Exercise Timing
            </CardTitle>
            <CardDescription>
              Exercise helps, but timing matters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700">
              Regular exercise improves sleep quality, but vigorous exercise too close to bedtime
              can be stimulating and delay sleep onset.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="font-medium text-sm mb-2 text-green-700">✓ Best Times:</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Morning exercise</li>
                  <li>• Afternoon workouts</li>
                  <li>• At least 2-3h before bed</li>
                </ul>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="font-medium text-sm mb-2 text-yellow-700">⚠ Evening:</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Light stretching is fine</li>
                  <li>• Yoga is beneficial</li>
                  <li>• Avoid intense cardio</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wind-Down Routine */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-3xl">🌙</span>
              Evening Wind-Down Routine
            </CardTitle>
            <CardDescription>
              Signal to your body that sleep is coming
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700">
              A consistent pre-sleep routine (30-60 minutes) helps your body transition from
              wakefulness to sleep by reducing arousal and promoting relaxation.
            </p>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="font-medium text-sm mb-2">Sample Wind-Down Routine:</p>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="font-bold">9:00pm</span>
                  <span>Dim lights throughout the house</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold">9:15pm</span>
                  <span>Put away all screens and electronics</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold">9:20pm</span>
                  <span>Light stretching or meditation</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold">9:30pm</span>
                  <span>Warm shower or bath</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold">9:45pm</span>
                  <span>Read a book in dim light</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold">10:00pm</span>
                  <span>Lights out, sleep time</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Environment */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-3xl">🛏️</span>
              Optimize Sleep Environment
            </CardTitle>
            <CardDescription>
              Create a sleep sanctuary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm mb-1">🌑 Darkness</p>
                  <p className="text-xs text-gray-600">
                    Use blackout curtains or eye mask. Even small amounts of light can disrupt
                    sleep quality.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm mb-1">🔇 Quiet</p>
                  <p className="text-xs text-gray-600">
                    Use earplugs or white noise machine to mask disruptive sounds.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm mb-1">❄️ Cool</p>
                  <p className="text-xs text-gray-600">
                    Keep bedroom at 15-19°C (60-67°F) for optimal sleep.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm mb-1">🛌 Comfort</p>
                  <p className="text-xs text-gray-600">
                    Invest in a quality mattress, pillows, and breathable bedding.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Ready to Improve Your Sleep?</h2>
          <p className="mb-4 text-blue-100">
            Start tracking your sleep patterns and discover what works best for you
          </p>
          <Button asChild variant="secondary">
            <Link href="/sleep">Start Tracking Sleep →</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
