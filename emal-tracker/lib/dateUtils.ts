/**
 * Date and time utility functions for consistent handling across EMAL Fitness Tracker
 */

/**
 * Get the default date for form inputs (YYYY-MM-DD format)
 * Defaults to today
 */
export function getDefaultFormDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get the default time for form inputs (HH:mm format)
 * Defaults to current time
 */
export function getDefaultFormTime(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Combine form date string (YYYY-MM-DD) and time string (HH:mm) into a Date object
 */
export function formDateTimeToDate(dateString: string, timeString: string): Date {
  return new Date(`${dateString}T${timeString}:00`);
}

/**
 * Convert a form date string (YYYY-MM-DD) to a Date object at midnight local time
 */
export function formDateToDate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}

/**
 * Convert a Date object to form date string (YYYY-MM-DD)
 */
export function dateToFormDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Convert a Date object to form time string (HH:mm)
 */
export function dateToFormTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Validate a date for form input
 * Returns error message if invalid, null if valid
 */
export function validateFormDate(
  dateString: string,
  options?: {
    allowFuture?: boolean;
    maxPastDays?: number;
  }
): string | null {
  const { allowFuture = false, maxPastDays = 365 } = options || {};

  const inputDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if future date
  if (!allowFuture && inputDate > today) {
    return 'Cannot log data for future dates';
  }

  // Check if too far in past
  const maxPastDate = new Date(today);
  maxPastDate.setDate(maxPastDate.getDate() - maxPastDays);

  if (inputDate < maxPastDate) {
    return `Cannot log data more than ${maxPastDays} days in the past`;
  }

  return null;
}

/**
 * Get the maximum allowed date for form inputs (today)
 */
export function getMaxFormDate(): string {
  return getDefaultFormDate();
}

/**
 * Get the minimum allowed date for form inputs (1 year ago by default)
 */
export function getMinFormDate(maxPastDays: number = 365): string {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() - maxPastDays);
  return dateToFormDate(minDate);
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is yesterday
 */
export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Get a user-friendly date label
 */
export function getDateLabel(date: Date): string {
  if (isToday(date)) {
    return 'Today';
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * Get a formatted time label (HH:mm)
 */
export function getTimeLabel(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
