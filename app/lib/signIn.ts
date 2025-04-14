"use server"

import { signIn } from "@/auth"

export async function signInAction(formData: FormData) {
  await signIn("forwardemail", formData)
}
