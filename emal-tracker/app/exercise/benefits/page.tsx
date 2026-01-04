import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ExerciseBenefitsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/exercise">← Back to Exercise Tracking</Link>
          </Button>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Exercise Benefits
          </h1>
          <p className="text-gray-600">
            Science-based benefits of exercise for energy management and overall health
          </p>
        </div>

        {/* Mitochondrial Growth */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-3xl">🔬</span>
              Mitochondrial Biogenesis
            </CardTitle>
            <CardDescription>
              Creating more cellular power plants
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700">
              Mitochondria are the "power plants" of your cells, converting food into ATP (adenosine
              triphosphate) - the energy currency your body uses. Regular exercise triggers
              mitochondrial biogenesis - the creation of new mitochondria.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-medium text-sm mb-2">How It Works:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Exercise increases energy demand in muscles</li>
                <li>• This triggers PGC-1α protein activation</li>
                <li>• PGC-1α signals cells to create new mitochondria</li>
                <li>• More mitochondria = more efficient energy production</li>
                <li>• Effects are visible within 2-4 weeks of regular exercise</li>
              </ul>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="font-medium text-sm mb-1">Real-World Impact:</p>
              <p className="text-sm text-gray-700">
                Athletes have up to 40% more mitochondria than sedentary individuals, allowing
                them to sustain higher energy output for longer periods with less fatigue.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metabolic Compensation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-3xl">⚙️</span>
              Metabolic Compensation
            </CardTitle>
            <CardDescription>
              Your body becomes more efficient
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700">
              While exercise burns calories during the activity, regular training causes your body
              to become more metabolically efficient. This means baseline functions (breathing,
              circulation, digestion) require less energy, leaving more available for activities
              and cognitive function.
            </p>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="font-medium text-sm mb-2">Adaptations Include:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Improved oxygen utilization (VO2 max increases)</li>
                <li>• More efficient cardiovascular function (lower resting heart rate)</li>
                <li>• Enhanced fat oxidation (better at using fat for fuel)</li>
                <li>• Improved insulin sensitivity (more efficient glucose metabolism)</li>
                <li>• Reduced inflammatory markers</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 italic">
              This is why trained individuals often report feeling more energetic throughout
              the day, even on rest days.
            </p>
          </CardContent>
        </Card>

        {/* Neurochemical Benefits */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-3xl">🧠</span>
              Neurochemical Enhancement
            </CardTitle>
            <CardDescription>
              Exercise as a natural mood booster
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700">
              Exercise triggers the release of several neurochemicals that improve mood, motivation,
              and cognitive function. This is often called the "runner's high" but applies to all
              forms of exercise.
            </p>
            <div className="grid gap-3">
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="font-medium text-sm mb-1">🎯 Endorphins</p>
                <p className="text-sm text-gray-700">
                  Natural painkillers and mood elevators. Released during moderate to vigorous exercise,
                  creating feelings of euphoria and reducing perception of pain.
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="font-medium text-sm mb-1">💪 Dopamine</p>
                <p className="text-sm text-gray-700">
                  The "motivation molecule." Exercise increases dopamine, improving motivation,
                  focus, and feelings of reward. Helps combat depression and low energy.
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="font-medium text-sm mb-1">😊 Serotonin</p>
                <p className="text-sm text-gray-700">
                  Regulates mood, sleep, and appetite. Exercise boosts serotonin production,
                  contributing to improved mood and better sleep quality.
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="font-medium text-sm mb-1">🌟 BDNF (Brain-Derived Neurotrophic Factor)</p>
                <p className="text-sm text-gray-700">
                  Supports neuron growth and survival. Often called "fertilizer for the brain,"
                  BDNF improves learning, memory, and cognitive function.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Quality */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-3xl">😴</span>
              Improved Sleep Quality
            </CardTitle>
            <CardDescription>
              Better sleep means better energy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700">
              Regular exercise significantly improves sleep quality, which is crucial for energy
              management according to the EMAL model. Better sleep means better next-day energy.
            </p>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="font-medium text-sm mb-2">Sleep Benefits:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Fall asleep faster (reduced sleep latency)</li>
                <li>• Increased deep sleep duration (most restorative stage)</li>
                <li>• Fewer nighttime awakenings</li>
                <li>• More consistent sleep schedule</li>
                <li>• Reduced symptoms of insomnia and sleep apnea</li>
              </ul>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="font-medium text-sm mb-1">⏰ Timing Tip:</p>
              <p className="text-sm text-gray-700">
                Exercise in the morning or afternoon for best sleep results. Vigorous exercise
                within 2-3 hours of bedtime may interfere with sleep for some people.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stress Reduction */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-3xl">🧘</span>
              Stress Reduction & Allostatic Load
            </CardTitle>
            <CardDescription>
              Lower stress = lower energy expenditure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700">
              According to the EMAL model, allostasis (stress response) can increase energy
              expenditure by 15-67%. Exercise is one of the most effective ways to reduce
              stress and lower allostatic load.
            </p>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="font-medium text-sm mb-2">How Exercise Reduces Stress:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Lowers cortisol (primary stress hormone) levels</li>
                <li>• Reduces activity in the amygdala (brain's fear center)</li>
                <li>• Activates parasympathetic nervous system (rest & digest)</li>
                <li>• Provides a healthy outlet for nervous energy</li>
                <li>• Improves stress resilience over time</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 italic">
              By reducing chronic stress, you conserve significant energy that would otherwise
              be spent on the stress response.
            </p>
          </CardContent>
        </Card>

        {/* WHO Recommendations */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-3xl">📋</span>
              WHO Exercise Recommendations
            </CardTitle>
            <CardDescription>
              Evidence-based guidelines for optimal health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <p className="font-semibold text-sm mb-2">Aerobic Exercise (Adults 18-64)</p>
                <div className="space-y-2">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="font-medium text-sm text-green-900">Option 1: Moderate Intensity</p>
                    <p className="text-2xl font-bold text-green-700 my-1">300+ minutes/week</p>
                    <p className="text-xs text-gray-700">Or 43+ minutes daily</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Examples: Brisk walking, cycling, swimming, dancing
                    </p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="font-medium text-sm text-orange-900">Option 2: Vigorous Intensity</p>
                    <p className="text-2xl font-bold text-orange-700 my-1">150+ minutes/week</p>
                    <p className="text-xs text-gray-700">Or 22+ minutes daily</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Examples: Running, HIIT, intense cycling, competitive sports
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <p className="font-semibold text-sm mb-2">Strength Training</p>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-purple-700 my-1">2+ days/week</p>
                  <p className="text-sm text-gray-700 mt-2">
                    Moderate or greater intensity involving all major muscle groups
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Examples: Weight training, resistance bands, bodyweight exercises, yoga
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-medium text-sm mb-2">💡 Important Notes:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• You can mix moderate and vigorous exercise</li>
                  <li>• Sessions can be as short as 10 minutes and still count</li>
                  <li>• More exercise provides additional health benefits</li>
                  <li>• Any amount of activity is better than none</li>
                  <li>• Include flexibility and balance exercises as you age</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Energy Timing */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-3xl">⏰</span>
              Exercise Timing & Energy
            </CardTitle>
            <CardDescription>
              When to exercise for optimal energy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="font-medium text-sm mb-2">🌅 Morning Exercise</p>
                <p className="text-sm text-gray-700 mb-2">Best for:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Consistency (fewer schedule conflicts)</li>
                  <li>• Improved focus for the day</li>
                  <li>• Better sleep at night</li>
                  <li>• Enhanced fat oxidation</li>
                </ul>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="font-medium text-sm mb-2">☀️ Afternoon Exercise</p>
                <p className="text-sm text-gray-700 mb-2">Best for:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Peak physical performance</li>
                  <li>• Better muscle activation</li>
                  <li>• Stress relief after work</li>
                  <li>• Evening energy boost</li>
                </ul>
              </div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="font-medium text-sm mb-1">⚠️ Evening Exercise Caution:</p>
              <p className="text-sm text-gray-700">
                Vigorous exercise within 2-3 hours of bedtime may interfere with sleep for some people.
                If you exercise in the evening, opt for moderate intensity or finish early enough to
                allow your body to wind down.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-6 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Ready to Optimize Your Energy?</h2>
          <p className="mb-4 text-orange-100">
            Start tracking your exercise and discover its impact on your energy levels
          </p>
          <Button asChild variant="secondary">
            <Link href="/exercise">Start Tracking Exercise →</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
