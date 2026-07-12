import { useEffect, useRef, useState } from "react"

/** mow → seedling sprouts → ripens back into wheat */
export type HarvestPhase = "idle" | "harvest" | "grow" | "ripen"

const STEPS: readonly (readonly [HarvestPhase, number])[] = [
  ["grow", 500],
  ["ripen", 1250],
  ["idle", 1900],
]

export function useHarvest(): { phase: HarvestPhase; start: () => void } {
  const [phase, setPhase] = useState<HarvestPhase>("idle")
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
    },
    []
  )
  return {
    phase,
    start: () => {
      if (phase !== "idle") {
        return
      }
      setPhase("harvest")
      timers.current = STEPS.map(([next, ms]) =>
        setTimeout(() => {
          setPhase(next)
        }, ms)
      )
    },
  }
}
