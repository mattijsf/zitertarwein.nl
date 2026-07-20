/** Capital first letter, for names that start lower case ("brood" → "Brood"). */
export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
