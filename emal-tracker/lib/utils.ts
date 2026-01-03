import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format time to HH:MM
 */
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Calculate sleep duration in hours
 */
export function calculateSleepDuration(bedtime: Date, wakeTime: Date): number {
  const diff = wakeTime.getTime() - bedtime.getTime();
  return Math.round((diff / (1000 * 60 * 60)) * 10) / 10; // Round to 1 decimal
}

/**
 * Get energy level color based on value (1-10)
 */
export function getEnergyColor(level: number): string {
  if (level <= 3) return 'text-energy-low-400';
  if (level <= 7) return 'text-energy-medium-400';
  return 'text-energy-high-400';
}

/**
 * Get energy level background color
 */
export function getEnergyBgColor(level: number): string {
  if (level <= 3) return 'bg-energy-low-100';
  if (level <= 7) return 'bg-energy-medium-100';
  return 'bg-energy-high-100';
}
