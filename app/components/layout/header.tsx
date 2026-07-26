"use client"

import {
  ArrowLeftStartOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline"
import { type JSX, useEffect, useRef, useState } from "react"
import { BlockerLink } from "@/app/components/button/blockerLink"
import { SignInModal } from "@/app/components/layout/signInModal"
import { signOut, useSession } from "@/app/lib/auth-client"
import { SITE_TITLE } from "@/app/lib/constant"

type Theme = "light" | "dark"

export function Header(): JSX.Element {
  const { data: session } = useSession()
  const [theme, setTheme] = useState<Theme | null>(null)
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const [scrollY, setScrollY] = useState<number>(0)
  const headerHeight: number = 100

  useEffect(() => {
    const documentTheme = document.documentElement.dataset.theme
    const savedTheme = localStorage.getItem("theme")
    const initialTheme =
      documentTheme === "dark" || documentTheme === "light"
        ? documentTheme
        : savedTheme === "dark" || savedTheme === "light"
          ? savedTheme
          : window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"

    document.documentElement.dataset.theme = initialTheme
    if (savedTheme === null && initialTheme === "dark") {
      localStorage.setItem("theme", initialTheme)
    }
    setTheme(initialTheme)
  }, [])

  useEffect(() => {
    const handleScroll = (): void => setScrollY(window.scrollY)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  function changeTheme(nextTheme: Theme): void {
    document.documentElement.dataset.theme = nextTheme
    localStorage.setItem("theme", nextTheme)
    setTheme(nextTheme)
  }

  return (
    <>
      <header
        className={`bg-base-100 duration-400 ease justify-between navbar sticky top-0 transition z-10 ${
          scrollY !== 0 && headerHeight < scrollY
            ? "-translate-y-20"
            : "translate-y-0"
        }`}
      >
        <BlockerLink
          href="/"
          className="btn btn-ghost h-fit text-xl whitespace-pre sm:whitespace-normal"
        >
          {SITE_TITLE}
        </BlockerLink>
        <div className="flex gap-4 text-nowrap">
          <button
            type="button"
            onClick={() => dialogRef.current?.showModal()}
            className={`btn btn-ghost flex flex-col gap-0 items-center h-fit p-0 text-nowrap${
              session ? " hidden" : ""
            }`}
          >
            <ArrowRightEndOnRectangleIcon className="rotate-y size-10 text-primary" />
            ログイン
          </button>
          <button
            type="button"
            onClick={() =>
              signOut({
                fetchOptions: {
                  onSuccess: () => {
                    window.location.href = "/"
                  },
                },
              })
            }
            className={`btn btn-ghost flex flex-col gap-0 items-center h-fit p-0 text-nowrap${
              session ? "" : " hidden"
            }`}
          >
            <ArrowLeftStartOnRectangleIcon className="rotate-y size-10 text-accent" />
            ログアウト
          </button>
          <label className="btn btn-ghost btn-square h-fit">
            <input
              type="checkbox"
              aria-label="ダークモード"
              className="sr-only"
              checked={theme === "dark"}
              onChange={(event) =>
                changeTheme(event.currentTarget.checked ? "dark" : "light")
              }
            />
            <div className="theme-toggle-light flex flex-col items-center">
              <SunIcon className="size-10 text-warning" />
              ライト
            </div>
            <div className="theme-toggle-dark flex-col items-center">
              <MoonIcon className="size-10 text-secondary" />
              ダーク
            </div>
          </label>
        </div>
      </header>
      <SignInModal dialogRef={dialogRef} />
    </>
  )
}
