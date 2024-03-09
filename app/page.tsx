import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 lg:px-8 sm:px-6">
      <div className="w-full max-w-md space-y-8">
        <h2 className="mt-6 text-center font-extrabold text-3xl text-gray-900">
          障がい者手帳登録システム
        </h2>
        <p className="text-center text-gray-600">
          Upload and download your images here
        </p>
        <Link
          href="/upload"
          className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          [派遣従業員向け]障がい者手帳画像をアップロードします。
        </Link>
        <Link
          href="/download"
          className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          [労務担当者向け]障がい者手帳画像をダウンロードします。
        </Link>
      </div>
    </main>
  )
}
