import type { JSX } from "react"
import { Stepper } from "@/app/components/layout/stepper"

export default function Success(): JSX.Element {
  return <Stepper targetStep={2} />
}
