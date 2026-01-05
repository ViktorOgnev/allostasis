"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface QuickActionsProps {
  showDailyCheckIn?: boolean
}

export function QuickActions({
  showDailyCheckIn = true,
}: QuickActionsProps) {
  return (
    <div className="mb-8">
      {showDailyCheckIn && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Ready to log your day?</h2>
          <p className="mb-4 text-blue-100">
            Quick & easy - track all 4 metrics in one place
          </p>
          <Link href="/log">
            <Button
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-6 text-lg"
            >
              📝 Start Daily Log
            </Button>
          </Link>
        </div>
      )}

      {/* Secondary Quick Actions */}
      <div className="text-center mb-3">
        <p className="text-sm text-gray-500">Or log individual metrics:</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href="/energy">
          <Button
            variant="outline"
            className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
          >
            <span className="text-2xl">⚡</span>
            <span className="text-sm font-medium">Log Energy</span>
          </Button>
        </Link>

        <Link href="/sleep">
          <Button
            variant="outline"
            className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-purple-50 hover:border-purple-300"
          >
            <span className="text-2xl">😴</span>
            <span className="text-sm font-medium">Log Sleep</span>
          </Button>
        </Link>

        <Link href="/exercise">
          <Button
            variant="outline"
            className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-green-50 hover:border-green-300"
          >
            <span className="text-2xl">🏃</span>
            <span className="text-sm font-medium">Log Exercise</span>
          </Button>
        </Link>

        <Link href="/stress">
          <Button
            variant="outline"
            className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-orange-50 hover:border-orange-300"
          >
            <span className="text-2xl">🧘</span>
            <span className="text-sm font-medium">Log Stress</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
