export function generateRandomId(): string {
  return Math.trunc(Math.random() * 0xffffffff).toString(16);
}
