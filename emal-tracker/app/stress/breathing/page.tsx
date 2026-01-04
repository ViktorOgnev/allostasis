import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BreathingTimer } from '@/components/tools/BreathingTimer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function BreathingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/stress">← Back to Stress Management</Link>
          </Button>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Breathing Exercises
          </h1>
          <p className="text-gray-600">
            Activate your parasympathetic nervous system and reduce stress in minutes
          </p>
        </div>

        {/* Breathing Timer */}
        <div className="mb-8">
          <BreathingTimer />
        </div>

        {/* Educational Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How Breathing Reduces Stress</CardTitle>
            <CardDescription>
              The science behind controlled breathing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">🧠 The Vagus Nerve Connection</h3>
              <p className="text-sm text-gray-600">
                The vagus nerve connects your brain to your heart, lungs, and digestive system. Slow, deep breathing
                stimulates this nerve, triggering the parasympathetic nervous system (rest & digest mode) which:
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-6">
                <li>• Lowers heart rate and blood pressure within 30-60 seconds</li>
                <li>• Reduces cortisol (stress hormone) production</li>
                <li>• Increases heart rate variability (sign of stress resilience)</li>
                <li>• Improves oxygen delivery to the brain</li>
                <li>• Activates prefrontal cortex (rational thinking)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">📊 Breathing Pattern Benefits</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium text-sm mb-1">Box Breathing (4-4-4-4)</p>
                  <p className="text-sm text-gray-700">
                    Used by Navy SEALs for stress management in high-pressure situations. The equal timing
                    creates a calming rhythm that balances the nervous system.
                  </p>
                  <p className="text-xs text-blue-700 mt-1">Best for: Focus, anxiety, before important events</p>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="font-medium text-sm mb-1">4-7-8 Breathing</p>
                  <p className="text-sm text-gray-700">
                    Developed by Dr. Andrew Weil. The extended exhale (8 seconds) maximizes parasympathetic
                    activation. Many people fall asleep during this practice.
                  </p>
                  <p className="text-xs text-purple-700 mt-1">Best for: Sleep, deep relaxation, severe anxiety</p>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="font-medium text-sm mb-1">Coherent Breathing (5-5)</p>
                  <p className="text-sm text-gray-700">
                    5 seconds in, 5 seconds out = 6 breaths per minute, which optimizes heart rate variability
                    and creates coherence between heart and brain rhythms.
                  </p>
                  <p className="text-xs text-green-700 mt-1">Best for: General stress relief, building resilience</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">⏰ When to Practice</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="font-medium text-sm mb-1">Preventive (Anytime)</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Morning routine (5-10 min)</li>
                    <li>• Before meals</li>
                    <li>• Before bed</li>
                    <li>• During breaks</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="font-medium text-sm mb-1">Reactive (When Stressed)</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Feeling overwhelmed</li>
                    <li>• Before difficult conversation</li>
                    <li>• After stressful event</li>
                    <li>• Can't focus</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-medium text-sm mb-2">💡 Pro Tips:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Practice consistently (same time daily) for best results</li>
                <li>• Even 1-2 minutes can help in acute stress</li>
                <li>• Breathe through your nose when possible (activates vagus nerve more)</li>
                <li>• Don't force it - if you feel dizzy, slow down or stop</li>
                <li>• Combine with hand on heart/belly for grounding effect</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Research References */}
        <Card>
          <CardHeader>
            <CardTitle>Scientific Research</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Harvard Medical School:</strong> Slow breathing activates the parasympathetic nervous
                system, reducing blood pressure and stress hormones.
              </p>
              <p>
                <strong>Stanford Medicine:</strong> Cyclic sighing (extended exhales) reduces anxiety more
                effectively than meditation in controlled trials.
              </p>
              <p>
                <strong>HeartMath Institute:</strong> Heart rate variability (HRV) coherence training through
                breathing improves emotional regulation and cognitive performance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
