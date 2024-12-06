"use client"

import { DownloadBtn } from "@/app/components/button/downloadBtn"
import { XMarkIcon } from "@heroicons/react/24/solid"
import { useRouter } from "next/navigation"
import {
  type JSX,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
} from "react"

export function Modal({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  const router = useRouter()
  const dialogRef: RefObject<HTMLDialogElement | null> =
    useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal()
    }
  })

  return (
    <dialog ref={dialogRef} onClose={router.back} className="modal">
      <div className="modal-box">
        <button
          type="button"
          onClick={router.back}
          className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2"
        >
          <XMarkIcon className="size-7" />
        </button>
        <div className="gap-4 grid text-center">{children}</div>
        <div className="modal-action">
          <div className="flex gap-4 justify-end">
            <DownloadBtn />
            <button type="button" onClick={router.back} className="btn">
              <XMarkIcon className="size-6" />
              閉じる
            </button>
          </div>
        </div>
      </div>
      <button type="button" onClick={router.back} className="modal-backdrop" />
    </dialog>
  )
}
