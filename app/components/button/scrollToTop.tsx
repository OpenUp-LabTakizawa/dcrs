"use client"

import { ChevronDoubleUpIcon } from "@heroicons/react/24/solid"
import { type JSX, type RefObject, useEffect, useRef, useState } from "react"

export function ScrollToTop(): JSX.Element {
  const ref: RefObject<HTMLButtonElement | null> =
    useRef<HTMLButtonElement | null>(null)
  const [scrollY, setScrollY] = useState<number>(0)
  const [isScrollDown, setIsScrollDown] = useState<boolean>(false)
  const scrollPoint: number = 200

  useEffect(() => {
    if (scrollPoint < scrollY) {
      setIsScrollDown(true)
    }

    window.addEventListener("scroll", () => setScrollY(window.scrollY))
    return () => {
      window.removeEventListener("scroll", () => setScrollY(window.scrollY))
    }
  })

  function scrollToTop(): void {
    const scrollBtn: HTMLButtonElement = ref.current as HTMLButtonElement
    // restart animation unless remove the animation class
    scrollBtn.classList.remove("fade-in-up")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <button
      type="button"
      ref={ref}
      onClick={scrollToTop}
      className={`bg-sky-400 border-sky-400 bottom-2 button-pop fixed font-bold leading-4 right-2 rounded-lg shadow-lg size-12 text-sm z-10 hover:bg-sky-500 sm:bottom-4 sm:right-4${scrollY < scrollPoint && !isScrollDown ? " hidden" : ""} ${scrollY < scrollPoint ? "fade-out-down" : "fade-in-up"}`}
    >
      <ChevronDoubleUpIcon className="arrow-up mx-auto size-8" />
      TOP
    </button>
  )
}
