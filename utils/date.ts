export function getStartOfISOWeek(date: Date): Date {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = (d.getUTCDay() + 6) % 7; // Monday=0
  d.setUTCDate(d.getUTCDate() - day);
  return d;
}

export function getWeekDates(anyDate: Date): Date[] {
  const start = getStartOfISOWeek(anyDate);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    return d;
  });
}

export function isoWeekStringFromDate(date: Date): string {
  // ISO week YYYY-Www
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Thursday in current week decides the year.
  tmp.setUTCDate(tmp.getUTCDate() + 4 - ((tmp.getUTCDay() + 6) % 7));
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((+tmp - +yearStart) / 86400000 + 1) / 7);
  const year = tmp.getUTCFullYear();
  return `${year}-W${String(weekNo).padStart(2, '0')}`;
}

export const weekdayNamesFa = ['??????', '???????', '????????', '???????', '????', '????', '??????'];

export function formatPersianDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z');
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}/${m}/${day}`;
}
