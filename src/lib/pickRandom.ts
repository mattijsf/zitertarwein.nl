/** Up to n distinct items from arr, in random order. */
export function pickRandom<T>(
  arr: readonly T[],
  n: number,
  random: () => number = Math.random
): T[] {
  const rest = [...arr]
  const picked: T[] = []
  while (picked.length < n && rest.length) {
    picked.push(...rest.splice(Math.floor(random() * rest.length), 1))
  }
  return picked
}
