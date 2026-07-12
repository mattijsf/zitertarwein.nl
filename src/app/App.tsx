import type { ReactElement } from "react"
import { Examples } from "../features/examples/Examples"
import { Fact } from "../features/facts/Fact"
import { ResultCard } from "../features/result/ResultCard"
import { Scanner } from "../features/scanner/Scanner"
import { SearchBox } from "../features/search/SearchBox"
import { useShareLink } from "../features/share/useShareLink"
import { Footer } from "./Footer"
import { Header } from "./Header"

export function App(): ReactElement {
  useShareLink()
  return (
    <>
      <main>
        <Header />
        <SearchBox />
        <ResultCard />
        <Examples />
        <Fact />
        <Scanner />
      </main>
      <Footer />
    </>
  )
}
