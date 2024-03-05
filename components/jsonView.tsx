'use client'

import { useFormData } from '@/components/useFormData'
import type { FC } from 'react'

export const JsonView: FC = () => {
  const { formdata, loading } = useFormData()

  if (loading) {
    return <p>Loading...</p>
  }
  const localFormData = formdata
  if (localFormData === undefined) {
    return <p>No Json Data</p>
  }
  return (
    <>
      <p>Json Data</p>
      <ul>
        <li>name: {localFormData.name}</li>
        <li>company: {localFormData.company}</li>
        <li>employeeId: {localFormData.employeeId}</li>
        <li>phone: {localFormData.phone}</li>
        {/* <li>image: {localFormData.image}</li> */}
      </ul>
    </>
  )
}
