import { PostItem } from '../types/index.ts';

export interface CalendarDay {
  date: Date;
  isoDate: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  posts: PostItem[];
}

export function formatISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Generate 35 or 42 grid items for full calendar month view
 */
export function getMonthCalendarDays(year: number, monthIndex: number, posts: PostItem[]): CalendarDay[] {
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
  const todayISO = formatISODate(new Date());

  // In standard calendar, Sunday=0, Monday=1. We'll start on Sunday.
  const startDayOfWeek = firstDayOfMonth.getDay();
  const totalDaysInMonth = lastDayOfMonth.getDate();

  const days: CalendarDay[] = [];

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, monthIndex - 1, prevMonthLastDay - i);
    const iso = formatISODate(d);
    days.push({
      date: d,
      isoDate: iso,
      dayNumber: d.getDate(),
      isCurrentMonth: false,
      isToday: iso === todayISO,
      posts: posts.filter((p) => (p.scheduledFor || p.publishedAt || '').startsWith(iso))
    });
  }

  // Current month days
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const d = new Date(year, monthIndex, day);
    const iso = formatISODate(d);
    days.push({
      date: d,
      isoDate: iso,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: iso === todayISO,
      posts: posts.filter((p) => (p.scheduledFor || p.publishedAt || '').startsWith(iso))
    });
  }

  // Next month leading days to complete the 7-column grid
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let day = 1; day <= remaining; day++) {
      const d = new Date(year, monthIndex + 1, day);
      const iso = formatISODate(d);
      days.push({
        date: d,
        isoDate: iso,
        dayNumber: day,
        isCurrentMonth: false,
        isToday: iso === todayISO,
        posts: posts.filter((p) => (p.scheduledFor || p.publishedAt || '').startsWith(iso))
      });
    }
  }

  return days;
}

/**
 * Generate 7 days for Week View starting from the given date's Sunday or Monday
 */
export function getWeekDays(startDate: Date, posts: PostItem[]): CalendarDay[] {
  const current = new Date(startDate);
  const dayOfWeek = current.getDay();
  const sunday = new Date(current);
  sunday.setDate(current.getDate() - dayOfWeek);

  const todayISO = formatISODate(new Date());
  const weekDays: CalendarDay[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    const iso = formatISODate(d);
    weekDays.push({
      date: d,
      isoDate: iso,
      dayNumber: d.getDate(),
      isCurrentMonth: d.getMonth() === startDate.getMonth(),
      isToday: iso === todayISO,
      posts: posts.filter((p) => (p.scheduledFor || p.publishedAt || '').startsWith(iso))
    });
  }

  return weekDays;
}
