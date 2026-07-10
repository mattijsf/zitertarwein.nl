/**
 * Type-safety ratchet: counts escape hatches (`any`, `as` casts, eslint-disable, ts-ignore) in
 * src/ and fails when a count rises above the checked-in baseline.
 *
 * Counts may only go down. After lowering one, lock it in:
 *   node scripts/check-escape-hatches.ts --update
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const baselineFile = path.join(root, "scripts", "escape-hatches-baseline.json")

const patterns = {
  any: /:\s*any\b|<any>|as any\b/,
  asCasts: / as (?!const\b)[A-Z]/,
  eslintDisable: /eslint-disable/,
  tsIgnore: /@ts-(?:ignore|expect-error|nocheck)/,
} as const

type Counts = Record<keyof typeof patterns, number>

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      return sourceFiles(full)
    }
    return /\.tsx?$/.test(entry.name) ? [full] : []
  })
}

const lines = sourceFiles(path.join(root, "src")).flatMap(file =>
  readFileSync(file, "utf8").split("\n")
)

const keys = Object.keys(patterns) as (keyof typeof patterns)[]
const current = Object.fromEntries(
  keys.map(key => [key, lines.filter(line => patterns[key].test(line)).length])
) as Counts

if (process.argv.includes("--update")) {
  writeFileSync(baselineFile, JSON.stringify(current, null, 2) + "\n")
  console.log("baseline updated:", JSON.stringify(current))
  process.exit(0)
}

const baseline = JSON.parse(readFileSync(baselineFile, "utf8")) as Partial<Counts>
let failed = false
for (const key of keys) {
  const allowed = baseline[key] ?? 0
  const count = current[key]
  console.log(`${count > allowed ? "FAIL" : "ok  "} ${key}: ${count} (baseline ${allowed})`)
  failed ||= count > allowed
}

if (failed) {
  console.error(
    "\nEscape-hatch count went up. Fix the new any/cast/eslint-disable instead of adding it."
  )
  process.exit(1)
}
