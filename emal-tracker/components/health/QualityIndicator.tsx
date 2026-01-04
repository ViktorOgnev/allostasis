"use client"

import { Star } from 'lucide-react'

interface QualityIndicatorProps {
  quality: 1 | 2 | 3 | 4 | 5
  type?: 'sleep' | 'mood'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const sizeMap = {
  sm: { icon: 16, text: 'text-xs' },
  md: { icon: 20, text: 'text-sm' },
  lg: { icon: 24, text: 'text-base' },
}

const qualityLabels = {
  1: 'Very Poor',
  2: 'Poor',
  3: 'Fair',
  4: 'Good',
  5: 'Excellent',
}

const qualityColors = {
  1: '#EF4444', // red
  2: '#F97316', // orange
  3: '#EAB308', // yellow
  4: '#84CC16', // lime
  5: '#22C55E', // green
}

export function QualityIndicator({
  quality,
  type = 'sleep',
  size = 'md',
  showLabel = true
}: QualityIndicatorProps) {
  const config = sizeMap[size]
  const color = qualityColors[quality]
  const label = qualityLabels[quality]

  return (
    <div className="flex items-center gap-2">
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={config.icon}
            className="transition-all duration-200"
            fill={star <= quality ? color : 'none'}
            stroke={star <= quality ? color : '#D1D5DB'}
            strokeWidth={2}
          />
        ))}
      </div>

      {/* Label */}
      {showLabel && (
        <span
          className={`font-medium ${config.text}`}
          style={{ color }}
        >
          {label}
        </span>
      )}
    </div>
  )
}
