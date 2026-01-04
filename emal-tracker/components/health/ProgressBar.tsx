"use client"

interface ProgressBarProps {
  current: number
  target: number
  label: string
  unit?: string
  showPercentage?: boolean
  height?: 'sm' | 'md' | 'lg'
}

const heightMap = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
}

export function ProgressBar({
  current,
  target,
  label,
  unit = '',
  showPercentage = true,
  height = 'md'
}: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100)

  // Color coding based on progress
  const getColor = () => {
    if (percentage < 50) return 'bg-red-500'
    if (percentage < 80) return 'bg-yellow-500'
    if (percentage < 100) return 'bg-green-500'
    return 'bg-blue-500' // Overachieved
  }

  const getBgColor = () => {
    if (percentage < 50) return 'bg-red-100'
    if (percentage < 80) return 'bg-yellow-100'
    if (percentage < 100) return 'bg-green-100'
    return 'bg-blue-100'
  }

  const getTextColor = () => {
    if (percentage < 50) return 'text-red-700'
    if (percentage < 80) return 'text-yellow-700'
    if (percentage < 100) return 'text-green-700'
    return 'text-blue-700'
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {showPercentage && (
          <div className="flex items-baseline gap-2">
            <span className={`text-sm font-semibold ${getTextColor()}`}>
              {current.toFixed(0)} / {target} {unit}
            </span>
            <span className="text-xs text-gray-500">
              ({percentage.toFixed(0)}%)
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className={`w-full ${getBgColor()} rounded-full overflow-hidden ${heightMap[height]}`}>
        <div
          className={`${getColor()} ${heightMap[height]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Status Message */}
      {percentage >= 100 && (
        <p className="text-xs text-blue-600 font-medium">
          🎉 Goal achieved! Keep it up!
        </p>
      )}
      {percentage >= 80 && percentage < 100 && (
        <p className="text-xs text-green-600">
          Almost there! {(target - current).toFixed(0)} {unit} to go
        </p>
      )}
      {percentage < 50 && (
        <p className="text-xs text-gray-600">
          {(target - current).toFixed(0)} {unit} remaining to reach your goal
        </p>
      )}
    </div>
  )
}
