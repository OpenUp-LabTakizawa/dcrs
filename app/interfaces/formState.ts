export type FormState = {
  success: boolean
  errors?: {
    name?: string[]
    company?: string[]
    employeeId?: string[]
    telephone?: string[]
    email?: string[]
    agreement?: string[]
    image?: string[]
  }
  value?: {
    name?: string
    company?: string
    employeeId?: string
    telephone?: string
    email?: string
    agreement?: string
    image?: string
  }
}
