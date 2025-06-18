import type { JSX } from "react"
import { STEPS } from "@/app/lib/constant"

export function Stepper({
  targetStep,
}: Readonly<{ targetStep: number }>): JSX.Element {
  return (
    <>
      <ul className="steps">
        {STEPS.map((step, index) => (
          <li
            key={step.name}
            className={`step${index <= targetStep ? " step-primary" : ""}`}
          >
            {step.name}
          </li>
        ))}
      </ul>
      <h1 className="font-semibold mx-auto text-2xl">
        {STEPS[targetStep].name}
      </h1>
    </>
  )
}
