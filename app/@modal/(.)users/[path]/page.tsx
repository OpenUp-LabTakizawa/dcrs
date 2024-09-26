import { Modal } from "@/app/@modal/(.)users/[path]/modal"
import { ImagePreview } from "@/app/components/layout/imagePreview"
import { type JSX, Suspense } from "react"

export default async function ImageModal({
  params,
}: Readonly<{ params: Promise<{ path: string }> }>): Promise<JSX.Element> {
  return (
    <Modal>
      <Suspense fallback={<Skelton />}>
        <ImagePreview path={(await params).path} />
      </Suspense>
    </Modal>
  )
}

function Skelton(): JSX.Element {
  return (
    <>
      <h1 className="mx-auto">
        <p className="h-6 skeleton w-32" />
      </h1>
      <div className="h-64 skeleton w-full" />
    </>
  )
}
