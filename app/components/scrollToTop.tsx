"use client"

import { ChevronDoubleUpIcon } from "@heroicons/react/24/solid"
import { useState } from "react"
import type React from "react"

export function ScrollToTop(): React.JSX.Element {
  const [scrollY, setScrollY] = useState<number>(0)
  const scrollPoint: number = 200

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => setScrollY(window.scrollY))
  }

  return (
    <button
      type="button"
      id="scroll-to-top"
      className={`btn btn-square btn-primary fixed right-10 bottom-10 gap-0 hover:scale-110 ${
        scrollY < scrollPoint ? "fade-out-down" : "fade-in-up"
      }`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ChevronDoubleUpIcon className="size-8 scroll-up" />
      TOP
    </button>
  )
}
