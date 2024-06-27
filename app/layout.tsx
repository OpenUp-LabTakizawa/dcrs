import { ScrollToTop } from "@/app/components/button/scrollToTop"
import { AlertBox } from "@/app/components/layout/alertBox"
import { Footer } from "@/app/components/layout/footer"
import { Header } from "@/app/components/layout/header"
import { SITE_TITLE } from "@/app/lib/constant"
import type { Metadata } from "next"
import type { NextFont } from "next/dist/compiled/@next/font"
import { Sawarabi_Gothic } from "next/font/google"
import type React from "react"
import "./globals.css"

const sawarabi: NextFont = Sawarabi_Gothic({
  subsets: ["latin"],
  weight: "400",
})

export const metadata: Metadata = {
  title: "DCRS",
  description: SITE_TITLE,
  metadataBase: new URL("https://openuplab-takizawa.com"),
}

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>): React.JSX.Element {
  return (
    <html lang="ja">
      <body className={sawarabi.className}>
        <Header />
        <main className="bg-gray-50 grid gap-6 items-center justify-center px-4 py-6 lg:px-8 sm:px-6">
          <AlertBox>
            {children}
            {modal}
          </AlertBox>
          <ScrollToTop />
        </main>
        <Footer />
      </body>
    </html>
  )
}
