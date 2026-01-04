"use client"

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface FormStep {
  title: string
  fields: ReactNode
}

interface FormStepperProps {
  steps: FormStep[]
  currentStep: number
  onNext: () => void
  onPrev: () => void
  onSubmit: () => void
  isSubmitting?: boolean
}

export function FormStepper({
  steps,
  currentStep,
  onNext,
  onPrev,
  onSubmit,
  isSubmitting = false
}: FormStepperProps) {
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-1"
          >
            {/* Step Circle */}
            <div className="flex items-center w-full">
              {index > 0 && (
                <div
                  className={`flex-1 h-1 transition-colors ${
                    index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              )}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  index < currentStep
                    ? 'bg-blue-500 text-white'
                    : index === currentStep
                    ? 'bg-blue-500 text-white ring-4 ring-blue-100'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 transition-colors ${
                    index < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
            {/* Step Label */}
            <div
              className={`text-xs mt-2 font-medium transition-colors ${
                index === currentStep ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {step.title}
            </div>
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <div className="min-h-[300px]">
        {steps[currentStep].fields}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          disabled={isFirstStep || isSubmitting}
        >
          ← Previous
        </Button>

        {isLastStep ? (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit →'}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
          >
            Next →
          </Button>
        )}
      </div>
    </div>
  )
}
