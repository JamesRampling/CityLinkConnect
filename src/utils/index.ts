export function generateRandomId(): string {
  return Math.trunc(Math.random() * 0xffffffff).toString(16);
}

export function formatDate(
  isoDate?: string,
  options?: Intl.DateTimeFormatOptions,
) {
  if (!isoDate) return '-';
  const date = new Date(isoDate);
  return date.toLocaleDateString(undefined, options);
}
