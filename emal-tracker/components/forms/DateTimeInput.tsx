"use client"

import { useEffect, useState } from 'react'
import {
  getDefaultFormDate,
  getDefaultFormTime,
  getMaxFormDate,
  getMinFormDate,
  validateFormDate,
  getDateLabel,
} from '@/lib/dateUtils'

interface DateTimeInputProps {
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  label?: string;
  helpText?: string;
  required?: boolean;
  allowFuture?: boolean;
  maxPastDays?: number;
  showRelativeLabel?: boolean;
  showTime?: boolean;
  className?: string;
}

export function DateTimeInput({
  date,
  time,
  onDateChange,
  onTimeChange,
  label = 'Date & Time',
  helpText,
  required = false,
  allowFuture = false,
  maxPastDays = 365,
  showRelativeLabel = true,
  showTime = true,
  className = '',
}: DateTimeInputProps) {
  const [error, setError] = useState<string | null>(null);

  const handleDateChange = (newValue: string) => {
    onDateChange(newValue);

    // Validate
    const validationError = validateFormDate(newValue, { allowFuture, maxPastDays });
    setError(validationError);
  };

  // Validate on mount
  useEffect(() => {
    if (date) {
      const validationError = validateFormDate(date, { allowFuture, maxPastDays });
      setError(validationError);
    }
  }, [date, allowFuture, maxPastDays]);

  const relativeLabel = showRelativeLabel && date ? getDateLabel(new Date(date)) : null;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {relativeLabel && (
          <span className="text-xs text-gray-500 italic">{relativeLabel}</span>
        )}
      </div>

      <div className="flex gap-2">
        {/* Date Input */}
        <div className="flex-1">
          <input
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            max={allowFuture ? undefined : getMaxFormDate()}
            min={getMinFormDate(maxPastDays)}
            className={`w-full p-2 border rounded-md ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
            }`}
            required={required}
          />
        </div>

        {/* Time Input */}
        {showTime && (
          <div className="w-32">
            <input
              type="time"
              value={time}
              onChange={(e) => onTimeChange(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500"
              required={required}
            />
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {helpText && !error && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    </div>
  );
}
