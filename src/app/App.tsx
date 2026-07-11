import type { ReactElement } from "react"
import { Examples } from "../features/examples/Examples"
import { InstallButton } from "../features/install/InstallButton"
import { ResultCard } from "../features/result/ResultCard"
import { SearchBox } from "../features/search/SearchBox"
import { Footer } from "./Footer"
import { Header } from "./Header"

export function App(): ReactElement {
  return (
    <>
      <InstallButton />
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
