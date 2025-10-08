import type { Metadata } from "next"
import { Sawarabi_Gothic } from "next/font/google"
import { ScrollToTop } from "@/app/components/button/scrollToTop"
import { AlertBox } from "@/app/components/layout/alertBox"
import { Footer } from "@/app/components/layout/footer"
import { Header } from "@/app/components/layout/header"
import { NavigationBlockerProvider } from "@/app/components/layout/navigationBlocker"
import { SITE_TITLE } from "@/app/lib/constant"
import "./globals.css"
import { SessionProvider } from "next-auth/react"
import { type JSX, ViewTransition } from "react"

const sawarabi = Sawarabi_Gothic({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sawarabi",
})

export const metadata: Metadata = {
  title: "DCRS",
  description: SITE_TITLE,
}

export default function RootLayout(props: LayoutProps<"/">): JSX.Element {
  return (
    <html lang="ja" className={sawarabi.variable}>
      <body className="font-sawarabi">
        <ViewTransition>
          <SessionProvider>
            <NavigationBlockerProvider>
              <Header />
              <main className="bg-gray-50 gap-6 grid items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
                <AlertBox>
                  {props.children}
                  {props.modal}
                </AlertBox>
                <ScrollToTop />
              </main>
              <Footer />
            </NavigationBlockerProvider>
          </SessionProvider>
        </ViewTransition>
      </body>
    </html>
  )
}
