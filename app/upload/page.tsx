import { UploadFormHook } from '@/components/uploadFormHook'

export default function Upload() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="mb-3 text-2xl font-semibold">アップロードフォーム</h1>
      <span className="before:content-['*'] before:ml-0.5 before:text-red-500">
        は必須項目です
      </span>
      <UploadFormHook />
    </main>
  )
}
