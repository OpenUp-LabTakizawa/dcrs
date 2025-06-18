import type { JSX, ReactNode } from "react"
import { HomeBtn } from "@/app/components/button/homeBtn"

export default function RegisterLayout({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  return (
    <>
      {children}
      <HomeBtn />
    </>
  )
}
