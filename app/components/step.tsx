import type React from 'react'
import type { Steps } from '../interfaces/steps'

export function Step({
  steps,
  targetStep,
}: { steps: Steps; targetStep: number }): React.JSX.Element {
  return (
    <>
      <ul className="steps">
        {steps.map((step, index) => (
          <li
            key={step}
            className={`step${index <= targetStep ? ' step-primary' : ''}`}
          >
            {step}
          </li>
        ))}
      </ul>
      <h1 className="font-semibold text-2xl">{steps[targetStep]}</h1>
    </>
  )
}
