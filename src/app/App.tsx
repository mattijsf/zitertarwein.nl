import type { ReactElement } from "react"
import { Examples } from "../features/examples/Examples"
import { ResultCard } from "../features/result/ResultCard"
import { SearchBox } from "../features/search/SearchBox"
import { Footer } from "./Footer"
import { Header } from "./Header"
import { LookSwitch } from "./LookSwitch"

export function App(): ReactElement {
  return (
    <>
      <LookSwitch />
      <main>
        <Header />
        <SearchBox />
        <ResultCard />
        <Examples />
      </main>
      <Footer />
    </>
  )
}
