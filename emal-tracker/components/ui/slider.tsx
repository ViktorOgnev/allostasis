"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { getEnergyColor } from "@/app/design-tokens/colors"
import { colors } from "@/app/design-tokens/colors"

interface SliderProps {
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  className?: string
}

export function Slider({ min, max, step, value, onChange, className }: SliderProps) {
  const sliderColor = getEnergyColor(value)
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className={cn("relative w-full", className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
        style={{
          background: `linear-gradient(to right,
            ${sliderColor} 0%,
            ${sliderColor} ${percentage}%,
            ${colors.border} ${percentage}%,
            ${colors.border} 100%)`
        }}
      />
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 2px solid ${sliderColor};
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 2px solid ${sliderColor};
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  )
}
