import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GratitudeJournal } from '@/components/tools/GratitudeJournal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function GratitudePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/stress">← Back to Stress Management</Link>
          </Button>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Gratitude Journal
          </h1>
          <p className="text-gray-600">
            Daily gratitude practice to reduce stress, improve mood, and enhance wellbeing
          </p>
        </div>

        {/* Gratitude Journal */}
        <div className="mb-8">
          <GratitudeJournal />
        </div>

        {/* Educational Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>The Science of Gratitude</CardTitle>
            <CardDescription>
              How gratitude practice affects your brain and body
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">🧠 Neurological Changes</h3>
              <p className="text-sm text-gray-600 mb-2">
                Regular gratitude practice creates measurable changes in brain structure and function:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-6">
                <li>• Increases gray matter density in prefrontal cortex (decision-making)</li>
                <li>• Activates medial prefrontal cortex (social bonding and empathy)</li>
                <li>• Boosts dopamine and serotonin (feel-good neurotransmitters)</li>
                <li>• Reduces amygdala reactivity (less fear and anxiety)</li>
                <li>• Strengthens neural pathways for positive thinking</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">⚡ Stress Hormone Reduction</h3>
              <p className="text-sm text-gray-600 mb-2">
                According to the EMAL model, reducing stress conserves significant energy:
              </p>
              <div className="bg-green-50 p-3 rounded-lg">
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>Cortisol reduction:</strong> Up to 23% decrease in stress hormone levels</li>
                  <li>• <strong>Inflammation markers:</strong> Lower C-reactive protein (CRP)</li>
                  <li>• <strong>Blood pressure:</strong> 10% reduction in systolic blood pressure</li>
                  <li>• <strong>Heart rate variability:</strong> Improved stress resilience</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">😴 Sleep Improvement</h3>
              <p className="text-sm text-gray-600">
                Gratitude journaling before bed improves sleep quality, which is crucial for energy management:
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-6">
                <li>• Fall asleep 15-20% faster</li>
                <li>• Increase sleep duration by 25-30 minutes</li>
                <li>• Reduce pre-sleep worry and rumination</li>
                <li>• Wake up feeling more refreshed</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">💪 Long-Term Benefits</h3>
              <p className="text-sm text-gray-600 mb-2">
                Studies show gratitude practice over 3+ weeks leads to:
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium text-sm mb-1">Mental Health</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• 25% increase in happiness</li>
                    <li>• Reduced depression symptoms</li>
                    <li>• Lower anxiety levels</li>
                    <li>• Greater life satisfaction</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="font-medium text-sm mb-1">Physical Health</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Stronger immune system</li>
                    <li>• Less physical pain</li>
                    <li>• Better cardiovascular health</li>
                    <li>• More energy and vitality</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Practice */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Gratitude Practice Tips</CardTitle>
            <CardDescription>
              Make the most of your gratitude journaling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">✍️ Best Practices</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <div>
                    <p className="font-medium text-sm">Be Specific</p>
                    <p className="text-sm text-gray-600">
                      Instead of "I'm grateful for my family," write "I'm grateful for the hug my daughter
                      gave me this morning when I was feeling stressed."
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">2️⃣</span>
                  <div>
                    <p className="font-medium text-sm">Focus on People</p>
                    <p className="text-sm text-gray-600">
                      Gratitude for people (vs. things) has stronger effects on wellbeing and relationships.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">3️⃣</span>
                  <div>
                    <p className="font-medium text-sm">Include "Surprises"</p>
                    <p className="text-sm text-gray-600">
                      Unexpected positive events increase dopamine more than expected ones. Note small
                      pleasant surprises from your day.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">4️⃣</span>
                  <div>
                    <p className="font-medium text-sm">Quality Over Quantity</p>
                    <p className="text-sm text-gray-600">
                      3-5 detailed items are better than 10 superficial ones. Take time to really feel
                      the gratitude.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">5️⃣</span>
                  <div>
                    <p className="font-medium text-sm">Consistency is Key</p>
                    <p className="text-sm text-gray-600">
                      Daily practice (even 2-3 minutes) is more effective than occasional long sessions.
                      Best time: morning or before bed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="font-medium text-sm mb-2">🎯 When You Can't Think of Anything:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• What made today less difficult than it could have been?</li>
                <li>• What basic need do you have met? (food, shelter, health)</li>
                <li>• What ability or skill helped you today?</li>
                <li>• What in nature did you appreciate?</li>
                <li>• Who smiled at you or showed kindness?</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Research */}
        <Card>
          <CardHeader>
            <CardTitle>Scientific Research</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>UC Berkeley:</strong> Gratitude journaling for 3 weeks led to measurable increases
                in happiness and reductions in depressive symptoms that lasted 6 months.
              </p>
              <p>
                <strong>Harvard Health:</strong> Gratitude practice strengthens the immune system, lowers
                blood pressure, and helps people sleep better.
              </p>
              <p>
                <strong>Journal of Psychosomatic Research:</strong> Daily gratitude reduced cortisol by 23%
                and improved heart rate variability, key markers of stress resilience.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
