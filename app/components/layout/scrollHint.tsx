"use client"

import { ChevronRightIcon } from "@heroicons/react/24/solid"
import { type JSX, type RefObject, useEffect, useRef } from "react"

export function ScrollRightHint(): JSX.Element {
  const ref: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(
    null,
  )

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("opacity-0")
          }, 3000)
        } else {
          entry.target.classList.remove("opacity-0")
        }
      }
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current as HTMLDivElement)
      }
    }
  })

  return (
    <div
      ref={ref}
      className="absolute bg-black/60 left-1/2 pt-20 text-white top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 lg:hidden"
    >
      <ChevronRightIcon className="scroll-right size-20" />
      <ChevronRightIcon className="scroll-right size-20" />
      <ChevronRightIcon className="scroll-right size-20" />
      <span className="px-2 text-xs">右スクロール</span>
    </div>
  )
}
