"use client"

import { BlockerLink } from "@/app/components/button/blockerLink"
import { SITE_TITLE } from "@/app/lib/constant"
import {
  ArrowRightEndOnRectangleIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { type JSX, useEffect, useState } from "react"
import { themeChange } from "theme-change"

export function Header(): JSX.Element {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [scrollY, setScrollY] = useState<number>(0)
  const headerHeight: number = 100

  useEffect(() => {
    if (
      !("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      localStorage.setItem("theme", "dark")
    }

    themeChange(false)
    if (localStorage.getItem("theme") === "dark") {
      setTheme("dark")
    }

    window.addEventListener("scroll", () => {
      setScrollY(window.scrollY)
    })
  })

  return (
    <header
      className={`bg-base-100 duration-400 ease justify-between navbar sticky top-0 transition z-10 ${
        scrollY !== 0 && headerHeight < scrollY
          ? "-translate-y-20"
          : "translate-y-0"
      }`}
    >
      <BlockerLink href="/" className="btn btn-ghost h-fit text-xl">
        {SITE_TITLE}
      </BlockerLink>
      <div className="flex gap-4 text-nowrap">
        <Link
          href="/login"
          className="btn btn-ghost flex flex-col gap-0 items-center h-fit p-0 text-nowrap"
        >
          <ArrowRightEndOnRectangleIcon className="rotate-y size-10 text-primary" />
          ログイン
        </Link>
        <label className="btn btn-ghost btn-square h-fit swap swap-rotate">
          <input type="checkbox" />
          <div
            className={`${theme === "light" ? "swap-off" : "swap-on"}`}
            data-set-theme="light"
          >
            <SunIcon className="size-10 text-warning" />
            ライト
          </div>
          <div
            className={`${theme === "dark" ? "swap-off" : "swap-on"}`}
            data-set-theme="dark"
          >
            <MoonIcon className="size-10 text-secondary" />
            ダーク
          </div>
        </label>
      </div>
    </header>
  )
}
