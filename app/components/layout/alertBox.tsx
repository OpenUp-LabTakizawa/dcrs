"use client"

import type { Alert } from "@/app/interfaces/alert"
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import {
  type Dispatch,
  type JSX,
  type ReactNode,
  type RefObject,
  type SetStateAction,
  createContext,
  useRef,
  useState,
} from "react"

export const AlertContext = createContext<Dispatch<SetStateAction<Alert>>>(
  () => {
    return
  },
)

export function AlertBox({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  const ref: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(
    null,
  )
  const alertBox: HTMLDivElement = ref.current as HTMLDivElement
  const [alert, setAlert] = useState<Alert>({
    eventType: "",
    message: "",
  })

  function CloseAlert(): void {
    const timeout = setTimeout(() => {
      setAlert({ eventType: "", message: "" })
    }, 1500)
    alertBox.classList.remove("fade-in-alert")
    alertBox.classList.add("fade-out-alert")
    window.clearTimeout(timeout)
  }

  return (
    <AlertContext.Provider value={setAlert}>
      <div
        ref={ref}
        className={`toast toast-center toast-top z-10 ${
          alert.eventType && alert.message ? "fade-in-alert" : "hidden"
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
            onClick={CloseAlert}
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
