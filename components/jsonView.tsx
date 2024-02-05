'use client'

import type { FC } from 'react'

export const JsonView: FC = () => {
  const localFormData = JSON.parse(localStorage.getItem('FormData') || '{}')

  return (
    <div>
      <p>Json Data</p>
      <ul>
        <li>name: {localFormData.name}</li>
        <li>company: {localFormData.company}</li>
        <li>employeeId: {localFormData.employeeId}</li>
        <li>phone: {localFormData.phone}</li>
        <li>image: {localFormData.image}</li>
      </ul>
    </div>
  )
}
