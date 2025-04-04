import { BlockerLink } from "@/app/components/button/blockerLink"
import { HomeIcon } from "@heroicons/react/24/solid"
import type { JSX } from "react"

export function HomeBtn(): JSX.Element {
  return (
    <BlockerLink href="/" className="btn btn-primary max-w-fit mx-auto">
      <HomeIcon className="size-6" />
      ホームに戻る
    </BlockerLink>
  )
}
