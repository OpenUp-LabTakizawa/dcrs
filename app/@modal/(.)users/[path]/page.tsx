import { ImagePreview } from "@/app/components/layout/imagePreview"
import { type JSX, Suspense } from "react"
import { Modal } from "./modal"

export default function ImageModal({
  params: { path },
}: Readonly<{ params: { path: string } }>): JSX.Element {
  return (
    <Modal>
      <Suspense fallback={<Skelton />}>
        <ImagePreview path={path} />
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
