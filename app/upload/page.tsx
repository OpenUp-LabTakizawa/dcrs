import { ProfileForm } from '@/components/profileForm'
import Link from 'next/link'

export default function Upload() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 lg:px-8 sm:px-6">
      <h1 className="mb-3 font-semibold text-2xl">アップロードフォーム</h1>
      <span className="before:ml-0.5 before:text-red-500 before:content-['*']">
        は必須項目です
      </span>
      <ProfileForm />
      <br />
      <Link
        href="/"
        className="group relative flex w-1/8 justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        ホームに戻る
      </Link>
    </main>
  )
}
