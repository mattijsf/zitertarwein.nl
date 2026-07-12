export const LOGO_MOVES = ["boink", "twirl", "hop"] as const
export type LogoMove = (typeof LOGO_MOVES)[number]

const GRAIN_EMOJI = ["🌾", "✨", "🌾", "⭐️", "🌾", "💛"]
const GRAIN_COUNT = 10

export interface LogoGrain {
  id: number
  emoji: string
  dx: number
  dy: number
  rot: number
}

let nextId = 0

/** Ten grains flying out in a ring, each a bit off its slot. */
export function logoGrains(random: () => number = Math.random): LogoGrain[] {
  return Array.from({ length: GRAIN_COUNT }, (_, i) => {
    const angle = (Math.PI * 2 * i) / GRAIN_COUNT + random() * 0.6
    const dist = 75 + random() * 55
    return {
      id: nextId++,
      emoji: GRAIN_EMOJI[i % GRAIN_EMOJI.length] ?? "🌾",
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      rot: random() * 240 - 120,
    }
  })
}

export function isLogoMove(name: string): name is LogoMove {
  return LOGO_MOVES.some(move => move === name)
}
