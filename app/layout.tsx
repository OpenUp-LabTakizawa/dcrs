import type { Metadata } from 'next'
import { Sawarabi_Gothic } from 'next/font/google'
import type React from 'react'
import './globals.css'

const inter = Sawarabi_Gothic({
  subsets: ['latin'],
  weight: '400',
})

export const metadata: Metadata = {
  title: 'DCRS',
  description: '障害者手帳登録システム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
