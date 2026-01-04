import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function MindfulnessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/stress">← Back to Stress Management</Link>
          </Button>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Mindfulness Practices
          </h1>
          <p className="text-gray-600">
            Monitor and Acceptance Therapy (MAT) techniques for stress reduction
          </p>
        </div>

        {/* MAT Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What is Monitor & Acceptance Therapy?</CardTitle>
            <CardDescription>
              A mindfulness approach to stress management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              MAT is a evidence-based approach that helps you relate differently to stress, reducing
              the secondary stress of "stressing about being stressed." This conserves significant
              energy according to the EMAL model.
            </p>

            <div className="space-y-3">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sm mb-2">1️⃣ Monitor (Observe)</h3>
                <p className="text-sm text-gray-700">
                  Notice your thoughts, emotions, and physical sensations without judgment. Simply observe
                  them as they arise, like watching clouds pass in the sky.
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  Key: You are not your thoughts - you are the observer of your thoughts
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sm mb-2">2️⃣ Accept (Allow)</h3>
                <p className="text-sm text-gray-700">
                  Accept that uncomfortable feelings are normal human experiences. Don't try to suppress,
                  fix, or change them. Allow them to exist without resistance.
                </p>
                <p className="text-xs text-green-700 mt-2">
                  Key: What you resist persists - acceptance reduces suffering
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sm mb-2">3️⃣ Respond Mindfully (Choose)</h3>
                <p className="text-sm text-gray-700">
                  After observing and accepting, choose how to respond based on your values rather than
                  reacting automatically from emotion. Create space between stimulus and response.
                </p>
                <p className="text-xs text-purple-700 mt-2">
                  Key: Between stimulus and response lies your power to choose
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guided Practices */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mindfulness Exercises</CardTitle>
            <CardDescription>
              Simple practices you can do anywhere
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Body Scan */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">🧘</span>
                Body Scan Meditation (5-10 minutes)
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <p className="text-sm text-gray-700 mb-3">
                  Systematically notice sensations throughout your body, releasing tension.
                </p>
                <ol className="text-sm text-gray-700 space-y-2 ml-4 list-decimal">
                  <li>Sit or lie down comfortably, close your eyes</li>
                  <li>Take 3 deep breaths to settle in</li>
                  <li>Bring awareness to your feet - notice temperature, pressure, tingling</li>
                  <li>Slowly move attention up: ankles → calves → knees → thighs</li>
                  <li>Continue through hips, belly, chest, back</li>
                  <li>Notice shoulders, arms, hands, fingers</li>
                  <li>Finally, scan neck, jaw, face, top of head</li>
                  <li>End with awareness of whole body breathing</li>
                </ol>
                <p className="text-xs text-blue-700 mt-3">
                  Benefit: Reduces muscle tension, increases body awareness, calms nervous system
                </p>
              </div>
            </div>

            {/* Emotion Observation */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">🎭</span>
                Emotion Observation (2-3 minutes)
              </h3>
              <div className="bg-green-50 p-4 rounded-lg space-y-2">
                <p className="text-sm text-gray-700 mb-3">
                  When feeling overwhelmed, pause and observe the emotion scientifically.
                </p>
                <ol className="text-sm text-gray-700 space-y-2 ml-4 list-decimal">
                  <li><strong>Name it:</strong> "I notice I'm feeling anxious"</li>
                  <li><strong>Locate it:</strong> Where in your body do you feel it? (chest, stomach, throat?)</li>
                  <li><strong>Describe it:</strong> What does it feel like? (tight, heavy, buzzing?)</li>
                  <li><strong>Rate it:</strong> On scale 1-10, how intense is it?</li>
                  <li><strong>Watch it:</strong> Does it change as you observe? (usually it does)</li>
                  <li><strong>Allow it:</strong> "This feeling is okay. It will pass."</li>
                </ol>
                <p className="text-xs text-green-700 mt-3">
                  Benefit: Reduces emotional reactivity, creates space for rational thought
                </p>
              </div>
            </div>

            {/* 5-4-3-2-1 Grounding */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">🌍</span>
                5-4-3-2-1 Grounding (1-2 minutes)
              </h3>
              <div className="bg-yellow-50 p-4 rounded-lg space-y-2">
                <p className="text-sm text-gray-700 mb-3">
                  Quick technique to return to the present moment when overwhelmed.
                </p>
                <ul className="text-sm text-gray-700 space-y-2 ml-4">
                  <li><strong>5 things you can SEE:</strong> Look around and name them</li>
                  <li><strong>4 things you can TOUCH:</strong> Notice textures, temperatures</li>
                  <li><strong>3 things you can HEAR:</strong> Listen carefully</li>
                  <li><strong>2 things you can SMELL:</strong> Notice scents (or imagine favorite smells)</li>
                  <li><strong>1 thing you can TASTE:</strong> Take a sip of water, notice your mouth</li>
                </ul>
                <p className="text-xs text-yellow-700 mt-3">
                  Benefit: Interrupts anxiety spiral, anchors you in present moment
                </p>
              </div>
            </div>

            {/* Mindful Walking */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">🚶</span>
                Mindful Walking (5-15 minutes)
              </h3>
              <div className="bg-purple-50 p-4 rounded-lg space-y-2">
                <p className="text-sm text-gray-700 mb-3">
                  Transform a regular walk into a moving meditation.
                </p>
                <ol className="text-sm text-gray-700 space-y-2 ml-4 list-decimal">
                  <li>Walk at a comfortable, natural pace</li>
                  <li>Notice the sensation of feet touching ground</li>
                  <li>Feel the rhythm: heel, ball, toes, lift, swing</li>
                  <li>Notice your breath naturally syncing with steps</li>
                  <li>When mind wanders (it will), gently return to sensation of walking</li>
                  <li>Notice sounds, sights, smells around you</li>
                  <li>No destination - the walking itself is the practice</li>
                </ol>
                <p className="text-xs text-purple-700 mt-3">
                  Benefit: Combines movement and mindfulness, easier for restless minds
                </p>
              </div>
            </div>

            {/* 30-Second Reset */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                30-Second Mindful Reset
              </h3>
              <div className="bg-red-50 p-4 rounded-lg space-y-2">
                <p className="text-sm text-gray-700 mb-3">
                  Ultra-short practice for busy moments or high stress.
                </p>
                <ol className="text-sm text-gray-700 space-y-2 ml-4 list-decimal">
                  <li>STOP what you're doing (literally pause)</li>
                  <li>BREATHE - Take one slow, deep breath</li>
                  <li>OBSERVE - Notice one thing: your breath, sounds, or body sensation</li>
                  <li>PROCEED - Return to your activity with fresh awareness</li>
                </ol>
                <p className="text-xs text-red-700 mt-3">
                  Benefit: Quick reset, can be done multiple times per day
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* When to Practice */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Building a Mindfulness Practice</CardTitle>
            <CardDescription>
              How to integrate mindfulness into daily life
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-sm mb-2">🌅 Morning Practice</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 5-minute body scan before getting up</li>
                    <li>• Mindful shower (notice sensations)</li>
                    <li>• Mindful breakfast (eat without screens)</li>
                    <li>• Set intention for the day</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-sm mb-2">📅 During Day</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 30-second resets between tasks</li>
                    <li>• Mindful breathing at red lights</li>
                    <li>• One mindful meal or snack</li>
                    <li>• 5-4-3-2-1 when stressed</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-sm mb-2">🌙 Evening Practice</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Mindful walk after dinner</li>
                    <li>• Emotion observation exercise</li>
                    <li>• Gratitude journaling</li>
                    <li>• Body scan before sleep</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-sm mb-2">🚨 As Needed</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Before difficult conversation</li>
                    <li>• When feeling overwhelmed</li>
                    <li>• After stressful event</li>
                    <li>• When can't focus</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                <p className="font-medium text-sm mb-2">💡 Remember:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Start small - even 1 minute counts</li>
                  <li>• Consistency beats duration - daily practice is key</li>
                  <li>• Mind wandering is normal - that's why it's called "practice"</li>
                  <li>• You can't do it "wrong" - any moment of awareness helps</li>
                  <li>• Benefits accumulate over time (usually notice after 2-3 weeks)</li>
                </ul>
              </div>
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
                <strong>Harvard Medical School:</strong> 8 weeks of mindfulness practice increased gray
                matter density in brain regions for learning, memory, and emotional regulation.
              </p>
              <p>
                <strong>UC San Diego:</strong> Mindfulness reduces amygdala reactivity (fear center) by 22%,
                leading to lower stress hormone production.
              </p>
              <p>
                <strong>Stanford University:</strong> Monitor and Acceptance Therapy reduces secondary
                stress (stress about stress), conserving 15-30% more energy than trying to suppress emotions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
