"use client"

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="w-full p-12 text-center bg-gradient-to-b from-gray-50 to-white border-2 border-dashed border-gray-200">
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Icon */}
        <div className="rounded-full bg-gray-100 p-6 mb-2">
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 max-w-md">
          {description}
        </p>

        {/* Optional Action Button */}
        {action && (
          <Button
            onClick={action.onClick}
            className="mt-4"
          >
            {action.label}
          </Button>
        )}
      </div>
    </Card>
  )
}
