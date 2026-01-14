export const formatDateISO = (date: Date): string => {
  // Use local time instead of UTC to avoid timezone issues
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00'); // Append time to force local interpretation
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const getRelativeDateLabel = (dateStr: string): string | null => {
  const inputDate = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  
  // Reset hours to compare just dates
  inputDate.setHours(0,0,0,0);
  today.setHours(0,0,0,0);

  const diffTime = inputDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  return null;
};

export const addDays = (dateStr: string, days: number): string => {
  const date = new Date(dateStr + 'T00:00:00');
  date.setDate(date.getDate() + days);
  return formatDateISO(date);
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  // Returns 0 for Monday, 6 for Sunday (Monday start of week)
  const day = new Date(year, month, 1).getDay();
  // JS getDay(): 0=Sun, 1=Mon ... 6=Sat
  return day === 0 ? 6 : day - 1;
};

// Helper to get the Monday of the current week based on a date
export const getStartOfWeek = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const monday = new Date(date.setDate(diff));
  return formatDateISO(monday);
};

// Helper to get YYYY-Www format for input type="week"
export const toWeekString = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  // ISO week date calculation is complex, keeping it simple for MVP or using standard library is better.
  // Using a simplified approximation for the input value:
  const oneJan = new Date(date.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((date.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
  const result = Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
  return `${date.getFullYear()}-W${String(result).padStart(2, '0')}`;
};

// Helper to get YYYY-MM format
export const toMonthString = (dateStr: string): string => {
  return dateStr.substring(0, 7);
};