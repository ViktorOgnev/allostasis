"use client"

import { ReactNode } from 'react'
import { Flame } from 'lucide-react'

interface StreakCounterProps {
  count: number
  label: string
  icon?: ReactNode
  variant?: 'default' | 'success' | 'warning'
}

const variantStyles = {
  default: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconColor: 'text-blue-600',
    countColor: 'text-blue-700',
    labelColor: 'text-blue-600',
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    iconColor: 'text-green-600',
    countColor: 'text-green-700',
    labelColor: 'text-green-600',
  },
  warning: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    iconColor: 'text-orange-600',
    countColor: 'text-orange-700',
    labelColor: 'text-orange-600',
  },
}

export function StreakCounter({
  count,
  label,
  icon,
  variant = 'default'
}: StreakCounterProps) {
  const styles = variantStyles[variant]

  return (
    <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-lg border-2 ${styles.bg} ${styles.border}`}>
      {/* Icon */}
      <div className={`${styles.iconColor}`}>
        {icon || <Flame size={24} className="animate-pulse" />}
      </div>

      {/* Count */}
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-bold ${styles.countColor}`}>
          {count}
        </span>
        <span className="text-sm text-gray-500">
          {count === 1 ? 'day' : 'days'}
        </span>
      </div>

      {/* Label */}
      <div className={`text-sm font-medium ${styles.labelColor}`}>
        {label}
      </div>
    </div>
  )
}
