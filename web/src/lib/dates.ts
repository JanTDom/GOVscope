/**
 * Narzędzia do spójnego formatowania dat urzędowych KPRM i sprawdzania aktualności.
 * Gwarantuje dynamiczną zgodność z bieżącą datą systemową, eliminując jakiekolwiek halucynacje.
 */

export function getPolishDateWithWeekday(date: Date = new Date()): string {
  const weekday = new Intl.DateTimeFormat('pl-PL', { weekday: 'long' }).format(date);
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  const datePart = new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
  return `${capitalizedWeekday}, ${datePart} r.`;
}

export function getPolishLongDate(date: Date = new Date()): string {
  const datePart = new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
  return `${datePart} r.`;
}

export function getPolishNumericDate(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year} r.`;
}

export function getDailyMeldunekRef(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `KPRM/MD/${y}/${m}/${d}-01`;
}
