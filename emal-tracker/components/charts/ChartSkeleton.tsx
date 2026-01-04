"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface ChartSkeletonProps {
  showHeader?: boolean
  height?: number
}

export function ChartSkeleton({ showHeader = true, height = 300 }: ChartSkeletonProps) {
  return (
    <Card className="w-full">
      {showHeader && (
        <CardHeader>
          {/* Title skeleton */}
          <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse mb-2" />
          {/* Description skeleton */}
          <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
        </CardHeader>
      )}
      <CardContent>
        {/* Chart area skeleton */}
        <div
          className="w-full bg-gray-100 rounded animate-pulse flex items-center justify-center"
          style={{ height: `${height}px` }}
        >
          <div className="flex items-end gap-2 h-32">
            {/* Simulated bar chart */}
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="w-8 bg-gray-200 rounded-t animate-pulse"
                style={{
                  height: `${40 + Math.random() * 60}px`,
                  animationDelay: `${i * 100}ms`
                }}
              />
            ))}
          </div>
        </div>

        {/* Legend skeleton */}
        <div className="flex gap-4 mt-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
