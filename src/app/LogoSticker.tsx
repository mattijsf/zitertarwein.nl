import type { ReactElement } from "react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import type { LogoGrain, LogoMove } from "./logoGrains"
import { isLogoMove, LOGO_MOVES, logoGrains } from "./logoGrains"

const GRAIN_MS = 950

/** The logo; a click plays a random reaction and bursts grains outward. */
export function LogoSticker(): ReactElement {
  const ref = useRef<HTMLSpanElement>(null)
  const [reaction, setReaction] = useState<{ move: LogoMove; id: number } | null>(null)
  const [grains, setGrains] = useState<LogoGrain[]>([])

  // the same move twice in a row: the class stays, so restart its animation
  useLayoutEffect(() => {
    if (!reaction) {
      return
    }
    for (const animation of ref.current?.getAnimations() ?? []) {
      if (animation instanceof CSSAnimation && animation.animationName === reaction.move) {
        animation.cancel()
        animation.play()
      }
    }
  }, [reaction])

  return (
    <span
      ref={ref}
      className={reaction ? `logo-sticker ${reaction.move}` : "logo-sticker"}
      onClick={() => {
        const move = LOGO_MOVES[Math.floor(Math.random() * LOGO_MOVES.length)] ?? "boink"
        setReaction(r => ({ move, id: (r?.id ?? 0) + 1 }))
        setGrains(g => [...g, ...logoGrains()])
      }}
      onAnimationEnd={e => {
        if (isLogoMove(e.animationName)) {
          setReaction(null)
        }
      }}
    >
      <span className="logo" aria-hidden="true">
        🌾
      </span>
      {grains.map(grain => (
        <Grain
          key={grain.id}
          grain={grain}
          onDone={() => {
            setGrains(g => g.filter(other => other.id !== grain.id))
          }}
        />
      ))}
    </span>
  )
}

function Grain({ grain, onDone }: { grain: LogoGrain; onDone: () => void }): ReactElement {
  const done = useRef(onDone)
  useLayoutEffect(() => {
    done.current = onDone
  })
  useEffect(() => {
    const id = setTimeout(() => {
      done.current()
    }, GRAIN_MS)
    return () => {
      clearTimeout(id)
    }
  }, [])
  const ref = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    ref.current?.style.setProperty("--dx", `${grain.dx}px`)
    ref.current?.style.setProperty("--dy", `${grain.dy}px`)
    ref.current?.style.setProperty("--rot", `${grain.rot}deg`)
  }, [grain])
  return (
    <span ref={ref} className="grain">
      {grain.emoji}
    </span>
  )
}
