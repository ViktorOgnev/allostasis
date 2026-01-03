import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            EMAL Fitness Tracker
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Energy Management & Allostatic Load
          </p>
          <p className="text-gray-500 mb-8">
            Science-based fitness tracker to optimize your energy through sleep, exercise, and stress management
          </p>
          <Link href="/energy">
            <Button size="lg" className="text-lg px-8">
              Start Tracking Energy →
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Link href="/energy">
            <Card className="hover:shadow-lg transition cursor-pointer h-full">
              <CardHeader>
                <div className="text-4xl mb-2">⚡</div>
                <CardTitle>Energy Tracking</CardTitle>
                <CardDescription>
                  Monitor your daily energy levels and identify patterns
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Card className="opacity-60">
            <CardHeader>
              <div className="text-4xl mb-2">😴</div>
              <CardTitle>Sleep Tracking</CardTitle>
              <CardDescription>
                Log sleep quality and get science-based tips
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="opacity-60">
            <CardHeader>
              <div className="text-4xl mb-2">🏃</div>
              <CardTitle>Exercise Logging</CardTitle>
              <CardDescription>
                Track workouts and see their impact on energy
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="opacity-60">
            <CardHeader>
              <div className="text-4xl mb-2">🧘</div>
              <CardTitle>Stress Management</CardTitle>
              <CardDescription>
                Practice breathing, gratitude, and mindfulness
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* EMAL Model Explanation */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">About the EMAL Model</CardTitle>
            <CardDescription>
              Energy Management & Allostatic Load - A science-based approach to optimizing your wellbeing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">🔬 Energy Sources</h3>
              <p className="text-sm text-gray-600">
                Your body produces energy through ATP in mitochondria. Understanding and optimizing
                this process is key to sustained energy throughout the day.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">📊 Energy Expenditure</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Brain: ~20% of total energy</li>
                <li>• Vital functions: breathing, heartbeat, digestion</li>
                <li>• Allostasis (stress response): can increase energy use by 15-67%</li>
                <li>• Growth & repair: cell regeneration and healing</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">💤 Sleep: 7-9 hours recommended</h3>
              <p className="text-sm text-gray-600">
                Sleep consolidates memory, saves 30-50% energy, and removes brain toxins through
                the glymphatic system.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🏋️ Exercise Benefits</h3>
              <p className="text-sm text-gray-600">
                Regular exercise increases mitochondria count, improves metabolic efficiency,
                and boosts mood hormones. WHO recommends 300+ min moderate exercise weekly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
