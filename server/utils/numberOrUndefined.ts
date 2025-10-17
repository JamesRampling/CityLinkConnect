export function numberOrUndefined(s: string): number | undefined {
  const num = Number(s);
  return isNaN(num) ? undefined : num;
}
