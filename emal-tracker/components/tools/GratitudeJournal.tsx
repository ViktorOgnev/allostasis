"use client"

import { useState } from 'react'
import { useStressStore } from '@/store/stressStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

const gratitudePrompts = [
  "What made you smile today?",
  "Who are you grateful for and why?",
  "What's a simple pleasure you enjoyed recently?",
  "What ability or skill are you thankful for?",
  "What in nature are you grateful for?",
  "What challenge helped you grow?",
  "What technology or tool makes your life easier?",
  "What memory brings you joy?",
  "What about your body are you grateful for?",
  "What opportunity are you thankful for?",
]

export function GratitudeJournal() {
  const [items, setItems] = useState<string[]>(['', '', ''])
  const [currentPrompt, setCurrentPrompt] = useState(
    gratitudePrompts[Math.floor(Math.random() * gratitudePrompts.length)]
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addEntry = useStressStore((state) => state.addEntry)

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items]
    newItems[index] = value
    setItems(newItems)
  }

  const addMoreItem = () => {
    setItems([...items, ''])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const getNewPrompt = () => {
    const newPrompt = gratitudePrompts[Math.floor(Math.random() * gratitudePrompts.length)]
    setCurrentPrompt(newPrompt)
  }

  const handleSubmit = async () => {
    const filledItems = items.filter(item => item.trim() !== '')

    if (filledItems.length === 0) {
      alert('Please add at least one gratitude item')
      return
    }

    setIsSubmitting(true)

    try {
      await addEntry({
        date: new Date(),
        timestamp: new Date(),
        type: 'gratitude',
        gratitudeItems: filledItems,
      })

      alert('Gratitude entry saved!')
      setItems(['', '', ''])
      getNewPrompt()
    } catch (error) {
      console.error('Error saving gratitude entry:', error)
      alert('Failed to save gratitude entry')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Gratitude Journal</CardTitle>
        <CardDescription>
          Write 3-5 things you're grateful for today. Regular gratitude practice reduces stress and improves wellbeing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prompt */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">💭 Prompt for inspiration:</p>
              <p className="text-sm text-blue-800">{currentPrompt}</p>
            </div>
            <button
              onClick={getNewPrompt}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              🔄
            </button>
          </div>
        </div>

        {/* Gratitude Items */}
        <div className="space-y-3">
          <label className="text-sm font-medium">I am grateful for...</label>
          {items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-shrink-0 w-8 h-10 flex items-center justify-center text-gray-400 font-medium">
                {index + 1}.
              </div>
              <textarea
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                placeholder={
                  index === 0 ? "e.g., My family's support and love" :
                  index === 1 ? "e.g., A warm cup of coffee this morning" :
                  index === 2 ? "e.g., Good health and energy today" :
                  "Add another thing you're grateful for..."
                }
                className="flex-1 p-3 border border-gray-200 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
              {items.length > 3 && (
                <button
                  onClick={() => removeItem(index)}
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-md"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add More Button */}
        {items.length < 10 && (
          <button
            onClick={addMoreItem}
            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800 transition"
          >
            + Add another item
          </button>
        )}

        {/* Benefits Info */}
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-green-900 mb-2">🌟 Benefits of Gratitude Practice:</p>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Reduces stress hormones (cortisol)</li>
            <li>• Improves mood and emotional wellbeing</li>
            <li>• Enhances sleep quality</li>
            <li>• Strengthens relationships</li>
            <li>• Increases resilience to stress</li>
          </ul>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={isSubmitting || items.every(item => item.trim() === '')}
        >
          {isSubmitting ? 'Saving...' : 'Save Gratitude Entry'}
        </Button>

        {/* Daily Tip */}
        <div className="text-center text-sm text-gray-600">
          💡 Tip: Practice gratitude daily at the same time (e.g., before bed) for best results
        </div>
      </CardContent>
    </Card>
  )
}
