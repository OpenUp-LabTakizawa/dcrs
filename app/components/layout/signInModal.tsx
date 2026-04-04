"use client"

import {
  ArrowRightEndOnRectangleIcon,
  EnvelopeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { type JSX, type RefObject, useState } from "react"
import { signIn } from "@/app/lib/auth-client"

export const emailRegex = /\S+@\S+\.\S+/

export function isValidEmail(email: string): boolean {
  return emailRegex.test(email)
}

export function SignInModal({
  dialogRef,
}: Readonly<{ dialogRef: RefObject<HTMLDialogElement | null> }>): JSX.Element {
  const [value, setValue] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSent, setIsSent] = useState<boolean>(false)

  function handleClose() {
    dialogRef.current?.close()
    setIsSent(false)
    setError(null)
    setValue("")
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const email = value.trim()
      const { error: signInError } = await signIn.magicLink({ email })
      if (signInError) {
        setError(signInError.message ?? "マジックリンクの送信に失敗しました")
      } else {
        setIsSent(true)
      }
    } catch {
      setError("マジックリンクの送信に失敗しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box">
        {isSent ? (
          <div className="flex flex-col gap-4 items-center py-4 text-center">
            <EnvelopeIcon className="size-16 text-primary" />
            <h3 className="font-semibold text-lg">メールを送信しました</h3>
            <p className="text-sm">
              <span className="font-medium">{value}</span>{" "}
              にサインインリンクを送信しました。
              <br />
              メールを確認してリンクをクリックしてください。
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-primary mt-2"
            >
              閉じる
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <fieldset className="bg-base-200 border border-base-300 fieldset mx-auto p-4 rounded-box w-xs">
              <legend className="fieldset-legend">ログイン</legend>
              <label className="fieldset-label text-nowrap validator">
                メールアドレス
                <input
                  type="email"
                  name="email"
                  required={true}
                  onChange={(e) => setValue(e.target.value)}
                  className="input invalid:input-error"
                  placeholder="example@bnt.benextgroup.jp"
                />
              </label>
              <div className="validator-hint hidden">
                不正なメールアドレスです
              </div>
              {error && <div className="text-error text-sm mt-2">{error}</div>}
              <div className="flex gap-4 justify-end pt-4">
                <button
                  type="submit"
                  disabled={!isValidEmail(value) || isSubmitting}
                  className="btn btn-neutral btn-primary"
                >
                  <ArrowRightEndOnRectangleIcon className="rotate-y size-6" />
                  {isSubmitting ? "送信中..." : "ログイン"}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="bg-gray-100 btn flex font-bold gap-2 items-center justify-center px-4 shadow-xs text-sm hover:bg-gray-300"
                >
                  <XMarkIcon className="size-6" />
                  閉じる
                </button>
              </div>
            </fieldset>
          </form>
        )}
      </div>
    </dialog>
  )
}
