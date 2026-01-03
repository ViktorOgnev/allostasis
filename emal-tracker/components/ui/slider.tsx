"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  className?: string
}

export function Slider({ min, max, step, value, onChange, className }: SliderProps) {
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
            ${value <= 3 ? '#F87171' : value <= 7 ? '#FACC15' : '#4ADE80'} 0%,
            ${value <= 3 ? '#F87171' : value <= 7 ? '#FACC15' : '#4ADE80'} ${((value - min) / (max - min)) * 100}%,
            #e5e7eb ${((value - min) / (max - min)) * 100}%,
            #e5e7eb 100%)`
        }}
      />
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 2px solid ${value <= 3 ? '#F87171' : value <= 7 ? '#FACC15' : '#4ADE80'};
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 2px solid ${value <= 3 ? '#F87171' : value <= 7 ? '#FACC15' : '#4ADE80'};
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  )
}
