import type { Route } from "next"
import type { ElementType } from "react"

export type Index = {
  name: string
  icon: ElementType
  color: string
  href?: Route
}
