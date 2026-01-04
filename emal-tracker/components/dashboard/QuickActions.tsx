"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DailyCheckInForm } from '@/components/forms/DailyCheckInForm'

interface QuickActionsProps {
  showDailyCheckIn?: boolean
  onDailyCheckInClick?: () => void
}

export function QuickActions({
  showDailyCheckIn = true,
  onDailyCheckInClick
}: QuickActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDailyCheckInClick = () => {
    if (onDailyCheckInClick) {
      onDailyCheckInClick()
    } else {
      setIsDialogOpen(true)
    }
  }

  return (
    <div className="mb-8">
      {showDailyCheckIn && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Ready to track your day?</h2>
          <p className="mb-4 text-blue-100">
            Quick daily check-in takes just 30 seconds
          </p>
          <Button
            onClick={handleDailyCheckInClick}
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-6 text-lg"
          >
            ⚡ Quick Daily Check-In
          </Button>

          {/* Dialog for Daily Check-In Form */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Quick Daily Check-In</DialogTitle>
                <DialogDescription>
                  Track your energy, sleep, exercise, and stress in one place
                </DialogDescription>
              </DialogHeader>
              <DailyCheckInForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Secondary Quick Actions */}
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
