"use client"

import type { Alert } from "@/app/interfaces/alert"
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import type React from "react"
import { createContext, useState } from "react"

export const AlertContext = createContext<
  React.Dispatch<React.SetStateAction<Alert>>
>(() => {
  return
})

export function AlertBox({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const [alert, setAlert] = useState<Alert>({
    eventType: "",
    message: "",
  })

  return (
    <AlertContext.Provider value={setAlert}>
      <div
        className={`toast toast-top toast-center z-10 ${
          alert.eventType && alert.message ? "fade-in-alert" : "fade-out-alert"
        }`}
      >
        <div
          role="alert"
          className={`alert shadow-lg ${
            alert.eventType === "error" ? "alert-error" : "alert-info"
          }`}
        >
          {alert.eventType === "error" ? (
            <ExclamationCircleIcon className="size-6 text-info" />
          ) : (
            <CheckCircleIcon className="size-6 text-warning" />
          )}
          <span>{alert.message}</span>
          <button
            type="button"
            className="btn btn-sm flex-nowrap"
            onClick={() => setAlert({ eventType: "", message: "" })}
          >
            <XMarkIcon className="size-6" />
            閉じる
          </button>
        </div>
      </div>
      {children}
    </AlertContext.Provider>
  )
}
