export const emailRegex = /\S+@\S+\.\S+/

export function isValidEmail(email: string): boolean {
  return emailRegex.test(email)
}
