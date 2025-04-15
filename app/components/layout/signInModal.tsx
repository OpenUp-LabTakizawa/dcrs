"use client"

import { signInAction } from "@/app/lib/signIn"
import {
  ArrowRightEndOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { type JSX, type RefObject, useState } from "react"

const emailRegex = /\S+@\S+\.\S+/

export function SignInModal({
  dialogRef,
}: Readonly<{ dialogRef: RefObject<HTMLDialogElement | null> }>): JSX.Element {
  const [value, setValue] = useState<string>("")

  function isValidEmail(email: string): boolean {
    return emailRegex.test(email)
  }

  return (
    <dialog ref={dialogRef} className="modal">
      <form action={signInAction} className="modal-box">
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
          <div className="validator-hint hidden">不正なメールアドレスです</div>
          <div className="flex gap-4 justify-end pt-4">
            <button
              type="submit"
              disabled={!isValidEmail(value)}
              className="btn btn-neutral btn-primary"
            >
              <ArrowRightEndOnRectangleIcon className="rotate-y size-6" />
              ログイン
            </button>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="bg-gray-100 btn flex font-bold gap-2 items-center justify-center px-4 shadow-xs text-sm hover:bg-gray-300"
            >
              <XMarkIcon className="size-6" />
              閉じる
            </button>
          </div>
        </fieldset>
      </form>
    </dialog>
  )
}
