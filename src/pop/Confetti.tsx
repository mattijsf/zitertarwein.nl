import type { ReactElement } from "react"
import { useEffect, useState } from "react"

const COLORS = ["#ffd43b", "#51db83", "#74c0fc", "#ff6b6b", "#ffa8c5", "#d0bfff"]
const PIECES = 28
const LIFETIME_MS = 2200

interface Piece {
  left: string
  background: string
  animationDelay: string
  animationDuration: string
}

function randomPieces(): Piece[] {
  return Array.from({ length: PIECES }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    background: COLORS[i % COLORS.length] ?? "",
    animationDelay: `${Math.random() * 0.2}s`,
    animationDuration: `${0.9 + Math.random() * 0.8}s`,
  }))
}

/** A burst of falling squares; remount it to play it again. */
export function Confetti(): ReactElement | null {
  const [pieces] = useState(randomPieces)
  const [done, setDone] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => {
      setDone(true)
    }, LIFETIME_MS)
    return () => {
      clearTimeout(id)
    }
  }, [])
  if (done) {
    return null
  }
  return (
    <div className="confetti">
      {pieces.map((style, i) => (
        <span key={i} style={style} />
      ))}
    </div>
  )
}
