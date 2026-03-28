import type { ElementType } from "react"

export type ProfileForm = {
  agreement: boolean
  company: string
  email: string
  employeeId: string
  image: FileList | undefined
  name: string
  telephone: string
}

export type ProfileFormItem = {
  name: keyof ProfileForm
  label: string
  type: string
  icon: ElementType
  placeholder?: string
}
