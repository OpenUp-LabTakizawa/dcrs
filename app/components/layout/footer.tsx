import Image from "next/image"
import Link from "next/link"
import type { JSX } from "react"

export function Footer(): JSX.Element {
  return (
    <footer className="bg-base-300 flex flex-row footer items-center justify-center p-4 text-base-content">
      <aside>
        <p>
          Copyright © {new Date().getFullYear()} Open Up Group Inc. All rights
          reserved.
        </p>
      </aside>
      <nav>
        <Link href="https://github.com/OpenUp-LabTakizawa/dcrs" target="_blank">
          <Image
            id="github-mark"
            src="/github-mark.svg"
            alt="GitHub"
            width={24}
            height={24}
            className="dark:hidden"
          />
          <Image
            src="/github-mark-white.svg"
            alt="GitHub"
            width={24}
            height={24}
            className="hidden dark:block"
          />
        </Link>
      </nav>
    </footer>
  )
}
