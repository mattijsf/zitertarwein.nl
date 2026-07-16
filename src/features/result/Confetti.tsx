import type { ReactElement } from "react"
import { useEffect, useState } from "react"
import "./Confetti.css"

const COLORS = ["#eaba3b", "#d6981f", "#f2d27c", "#8fc267", "#e2a72e", "#c9922a"]
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

/** A burst of falling grains; remount it to play it again. */
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
