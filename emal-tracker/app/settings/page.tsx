"use client"

import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useEnergyStore } from '@/store/energyStore'
import { useSleepStore } from '@/store/sleepStore'
import { useExerciseStore } from '@/store/exerciseStore'
import { useStressLevelStore } from '@/store/stressLevelStore'
import { db } from '@/lib/db'

export default function SettingsPage() {
  const [isExporting, setIsExporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  // Get all entries from stores
  const energyEntries = useEnergyStore((state) => state.entries)
  const sleepEntries = useSleepStore((state) => state.entries)
  const exerciseEntries = useExerciseStore((state) => state.entries)
  const stressEntries = useStressLevelStore((state) => state.entries)

  // Reload functions
  const loadEnergy = useEnergyStore((state) => state.loadEntries)
  const loadSleep = useSleepStore((state) => state.loadEntries)
  const loadExercise = useExerciseStore((state) => state.loadEntries)
  const loadStress = useStressLevelStore((state) => state.loadEntries)

  // Settings state
  const [targetSleepHours, setTargetSleepHours] = useState<number>(8)
  const [exerciseGoalMinutes, setExerciseGoalMinutes] = useState<number>(150)

  const exportDataAsJSON = async () => {
    setIsExporting(true)
    try {
      const data = {
        exportDate: new Date().toISOString(),
        energy: energyEntries,
        sleep: sleepEntries,
        exercise: exerciseEntries,
        stress: stressEntries,
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `emal-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Data exported successfully!')
    } catch (error) {
      toast.error('Failed to export data', {
        description: 'Please try again or contact support if the problem persists.',
      })
      console.error(error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportDataAsCSV = async () => {
    setIsExporting(true)
    try {
      // Export energy as CSV
      let csv = 'Type,Date,Timestamp,Value,Mood,Notes\n'

      energyEntries.forEach(entry => {
        csv += `Energy,${entry.date},${entry.timestamp},${entry.energyLevel},${entry.mood},"${entry.notes || ''}"\n`
      })

      sleepEntries.forEach(entry => {
        csv += `Sleep,${entry.date},${entry.bedtime},${entry.quality},${entry.mood},"${entry.notes || ''}"\n`
      })

      exerciseEntries.forEach(entry => {
        csv += `Exercise,${entry.date},${entry.startTime},${entry.duration},${entry.type},"${entry.notes || ''}"\n`
      })

      stressEntries.forEach(entry => {
        csv += `Stress,${entry.date},,${entry.stressLevel},${entry.timeOfDay},"${entry.notes || ''}"\n`
      })

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `emal-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Data exported as CSV!')
    } catch (error) {
      toast.error('Failed to export CSV', {
        description: 'Please try again or contact support if the problem persists.',
      })
      console.error(error)
    } finally {
      setIsExporting(false)
    }
  }

  const clearAllData = async () => {
    if (!confirm('⚠️ Are you sure you want to delete ALL your data? This action cannot be undone!')) {
      return
    }

    if (!confirm('⚠️ Really sure? All your tracking history will be permanently deleted!')) {
      return
    }

    setIsClearing(true)
    try {
      // Clear all tables in IndexedDB
      await db.energyEntries.clear()
      await db.sleepEntries.clear()
      await db.exerciseEntries.clear()
      await db.stressLevelEntries.clear()

      // Reload all stores
      await loadEnergy()
      await loadSleep()
      await loadExercise()
      await loadStress()

      toast.success('All data cleared successfully')
    } catch (error) {
      toast.error('Failed to clear data', {
        description: 'Some data may not have been deleted. Please try again.',
      })
      console.error(error)
    } finally {
      setIsClearing(false)
    }
  }

  const saveGoals = () => {
    // Save to localStorage for now
    localStorage.setItem('targetSleepHours', targetSleepHours.toString())
    localStorage.setItem('exerciseGoalMinutes', exerciseGoalMinutes.toString())
    toast.success('Goals saved successfully!')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {/* Data Management */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Export or clear your tracking data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> We recommend exporting your data regularly as a backup.
                Your data is stored locally on your device.
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={exportDataAsJSON}
              disabled={isExporting}
            >
              📥 Export Data (JSON)
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={exportDataAsCSV}
              disabled={isExporting}
            >
              📊 Export Data (CSV)
            </Button>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">
                <strong>⚠️ Danger Zone</strong>
              </p>
              <Button
                variant="destructive"
                className="w-full"
                onClick={clearAllData}
                disabled={isClearing}
              >
                🗑️ Clear All Data (Permanent!)
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                This will permanently delete all your energy, sleep, exercise, and stress logs. This cannot be undone.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Personal Goals */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Personal Goals</CardTitle>
            <CardDescription>
              Set your wellness targets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Target Sleep (hours/night)
              </label>
              <input
                type="number"
                min="6"
                max="10"
                step="0.5"
                value={targetSleepHours}
                onChange={(e) => setTargetSleepHours(Number(e.target.value))}
                className="w-full p-2 border border-gray-200 rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 7-9 hours for adults
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Exercise Goal (minutes/week)
              </label>
              <input
                type="number"
                min="0"
                max="1000"
                step="10"
                value={exerciseGoalMinutes}
                onChange={(e) => setExerciseGoalMinutes(Number(e.target.value))}
                className="w-full p-2 border border-gray-200 rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">
                WHO recommends: 150-300 minutes of moderate activity per week
              </p>
            </div>

            <Button onClick={saveGoals} className="w-full">
              Save Goals
            </Button>
          </CardContent>
        </Card>

        {/* Tracking Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Tracking Preferences</CardTitle>
            <CardDescription>
              Customize which metrics you want to track
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-3">
                All tracking modules are currently enabled. Future updates will allow you to disable individual metrics.
              </p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 text-sm">
                  <input type="checkbox" defaultChecked disabled className="w-4 h-4" />
                  <span>⚡ Energy Level Tracking</span>
                </label>
                <label className="flex items-center gap-3 text-sm">
                  <input type="checkbox" defaultChecked disabled className="w-4 h-4" />
                  <span>😴 Sleep Quality Tracking</span>
                </label>
                <label className="flex items-center gap-3 text-sm">
                  <input type="checkbox" defaultChecked disabled className="w-4 h-4" />
                  <span>🏃 Exercise Tracking</span>
                </label>
                <label className="flex items-center gap-3 text-sm">
                  <input type="checkbox" defaultChecked disabled className="w-4 h-4" />
                  <span>🧘 Stress Level Tracking</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Stats */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Data</CardTitle>
            <CardDescription>
              Storage information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{energyEntries.length}</div>
                <div className="text-xs text-gray-600">Energy Logs</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{sleepEntries.length}</div>
                <div className="text-xs text-gray-600">Sleep Logs</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{exerciseEntries.length}</div>
                <div className="text-xs text-gray-600">Exercise Logs</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{stressEntries.length}</div>
                <div className="text-xs text-gray-600">Stress Logs</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              Total entries: {energyEntries.length + sleepEntries.length + exerciseEntries.length + stressEntries.length}
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
