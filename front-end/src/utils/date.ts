// Time slots configuration
export const allTimeSlots = [
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", 
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"
];

/**
 * Get available time slots for a specific date
 * @param date - The date to get time slots for
 * @returns Array of available time slots
 */
export function getTimeSlotsForDate(date: Date | undefined): string[] {
  if (!date) return allTimeSlots;
  
  const day = date.getDay(); // 0 = Sunday
  
  if (day === 0) {
    // Sunday: 5:00 PM – 9:00 PM
    return allTimeSlots.filter(t => t >= "17:00" && t <= "21:00");
  }
  
  // Mon-Sat: 5:00 PM – 11:00 PM
  return allTimeSlots;
}

/**
 * Check if a date is in the past
 * @param date - The date to check
 * @returns True if the date is in the past
 */
export function isDateInPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Check if a date is today
 * @param date - The date to check
 * @returns True if the date is today
 */
export function isDateToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * Get the minimum selectable date (today)
 * @returns Date object for today
 */
export function getMinDate(): Date {
  return new Date();
}

/**
 * Get the maximum selectable date (1 year from today)
 * @returns Date object for 1 year from today
 */
export function getMaxDate(): Date {
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  return maxDate;
}

/**
 * Format a date for display
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDateForDisplay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format a date for API submission (YYYY-MM-DD)
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDateForAPI(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Parse a date string from API format
 * @param dateString - The date string to parse
 * @returns Date object
 */
export function parseDateFromAPI(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Get the day name for a date
 * @param date - The date to get the day name for
 * @returns Day name string
 */
export function getDayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Check if a date is a weekend
 * @param date - The date to check
 * @returns True if the date is a weekend
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
} 