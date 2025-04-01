"use client"

import type { Alert } from "@/app/interfaces/alert"
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import {
  type Context,
  type Dispatch,
  type JSX,
  type ReactNode,
  type RefObject,
  type SetStateAction,
  createContext,
  useRef,
  useState,
} from "react"

export const AlertContext: Context<Dispatch<SetStateAction<Alert>>> =
  createContext<Dispatch<SetStateAction<Alert>>>(() => {
    return
  })

export function AlertBox({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  const ref: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(
    null,
  )
  const [alert, setAlert] = useState<Alert>({
    eventType: "",
    message: "",
  })

  return (
    <AlertContext.Provider value={setAlert}>
      <div
        ref={ref}
        className={`duration-1000 toast toast-center toast-top transition-discrete z-10${
          alert.eventType && alert.message ? "" : " hidden opacity-0"
        }`}
      >
        <div
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
