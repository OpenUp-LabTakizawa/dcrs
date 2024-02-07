'use client'

import { useEffect, useState } from 'react'
import type { FormData } from './uploadFormHook'

const readFormData = (): FormData | undefined => {
  const formdata = localStorage.getItem('FormData')
  return formdata != null ? JSON.parse(formdata) : undefined
}

export const useFormData = () => {
  const [formdata, setFormData] = useState<FormData | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setFormData(readFormData())
    setLoading(false)
  }, [])

  return {
    formdata,
    loading,
  }
}
