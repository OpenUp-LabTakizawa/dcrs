"use client"

import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"
import { useNavigationBlocker } from "@/app/components/layout/navigationBlocker"

interface BlockerLinkProps extends ComponentProps<typeof Link> {
  children: ReactNode
}

export function BlockerLink({ children, ...props }: BlockerLinkProps) {
  const { isBlocked, setIsBlocked } = useNavigationBlocker()

  return (
    <Link
      onNavigate={(e) => {
        if (
          isBlocked &&
          !window.confirm(
            "移動すると入力したデータは削除されます。\nページを移動しますか？",
          )
        ) {
          e.preventDefault()
        } else {
          setIsBlocked(false)
        }
      }}
      {...props}
    >
      {children}
    </Link>
  )
}
