import { Step } from '@/app/components/step'
import type React from 'react'
import { STEPS } from '../page'

export default function Success(): React.JSX.Element {
  return <Step steps={[...STEPS]} targetStep={2} />
}
