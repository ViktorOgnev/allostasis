"use client"

import { useEffect, useRef, useMemo } from 'react'
import { Zap } from 'lucide-react'
import { useEnergyStore } from '@/store/energyStore'
import { EnergyEntryForm } from '@/components/forms/EnergyEntryForm'
import { EnergyLevelChart } from '@/components/charts/EnergyLevelChart'
import { RecentEntries } from '@/components/layout/RecentEntries'
import { EmptyState } from '@/components/health/EmptyState'
import { EnergyRing } from '@/components/health/EnergyRing'

export default function EnergyPage() {
  const { entries, isLoading, loadEntries } = useEnergyStore()
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadEntries()
  }, [loadEntries])

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Calculate latest energy level for EnergyRing
  const latestEnergyLevel = useMemo(() => {
    if (entries.length === 0) return 5
    const sortedEntries = [...entries].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    return sortedEntries[0].energyLevel
  }, [entries])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg font-medium">Loading...</div>
          <div className="text-sm text-gray-500">Fetching your energy data</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Energy Tracking</h1>
              <p className="text-gray-600">
                Monitor your energy levels and identify patterns
              </p>
            </div>
            {entries.length > 0 && (
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-500 mb-2">Latest Energy</p>
                <EnergyRing level={latestEnergyLevel} size="md" showLabel={true} />
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Form */}
          <div ref={formRef}>
            <EnergyEntryForm />
          </div>

          {/* Right Column: Chart and Recent Entries or Empty State */}
          <div className="space-y-6">
            {entries.length === 0 ? (
              <EmptyState
                icon={<Zap className="w-12 h-12 text-blue-500" />}
                title="No energy entries yet"
                description="Start tracking your energy levels to discover patterns and optimize your day. Your first entry will appear here."
                action={{
                  label: "Log Your Energy →",
                  onClick: scrollToForm
                }}
              />
            ) : (
              <>
                <EnergyLevelChart entries={entries} days={7} isLoading={isLoading} />
                <RecentEntries entries={entries} limit={5} />
              </>
            )}
          </div>
        </div>

        {/* Educational Content */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-900">
            💡 About Energy Tracking
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              <strong>Energy</strong> is the physical manifestation of your body's ATP production.
              By tracking your energy levels throughout the day, you can identify patterns and
              optimize your lifestyle.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Brain usage:</strong> Your brain consumes ~20% of your total energy</li>
              <li><strong>Allostatic load:</strong> Stress can increase energy expenditure by 15-67%</li>
              <li><strong>Sleep impact:</strong> Poor sleep reduces energy by 30-50%</li>
              <li><strong>Exercise benefit:</strong> Regular exercise increases mitochondria, producing more energy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
