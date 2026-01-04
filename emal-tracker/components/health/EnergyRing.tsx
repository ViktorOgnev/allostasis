"use client"

import { useMemo } from 'react'
import { getEnergyColor } from '@/app/design-tokens/colors'

interface EnergyRingProps {
  level: number // 1-10
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const sizeMap = {
  sm: { container: 64, stroke: 6, text: 'text-lg' },
  md: { container: 96, stroke: 8, text: 'text-2xl' },
  lg: { container: 128, stroke: 10, text: 'text-4xl' },
}

export function EnergyRing({ level, size = 'md', showLabel = true }: EnergyRingProps) {
  const config = sizeMap[size]
  const radius = (config.container - config.stroke) / 2
  const circumference = 2 * Math.PI * radius

  // Calculate progress (level is 1-10, convert to percentage)
  const progress = (level / 10) * 100
  const offset = circumference - (progress / 100) * circumference

  // Get color based on energy level
  const color = useMemo(() => {
    if (level <= 3) return '#EF4444' // red
    if (level <= 5) return '#F97316' // orange
    if (level <= 7) return '#EAB308' // yellow
    if (level <= 9) return '#84CC16' // lime
    return '#22C55E' // green
  }, [level])

  const getEnergyLabel = (level: number) => {
    if (level <= 2) return 'Very Low'
    if (level <= 4) return 'Low'
    if (level <= 6) return 'Moderate'
    if (level <= 8) return 'Good'
    return 'Excellent'
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: config.container, height: config.container }}>
        <svg className="transform -rotate-90" width={config.container} height={config.container}>
          {/* Background circle */}
          <circle
            cx={config.container / 2}
            cy={config.container / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={config.stroke}
            fill="none"
          />

          {/* Progress circle */}
          <circle
            cx={config.container / 2}
            cy={config.container / 2}
            r={radius}
            stroke={color}
            strokeWidth={config.stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`font-bold ${config.text}`} style={{ color }}>
              {level}
            </div>
            <div className="text-xs text-gray-500">/10</div>
          </div>
        </div>
      </div>

      {showLabel && (
        <div className="text-sm font-medium text-gray-700">
          {getEnergyLabel(level)}
        </div>
      )}
    </div>
  )
}
