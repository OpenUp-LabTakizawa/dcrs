import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import { type JSX, Suspense } from "react"
import { DownloadBtn } from "@/app/components/button/downloadBtn"
import { Breadcrumb } from "@/app/components/layout/breadcrumb"
import { ImagePreview } from "@/app/components/layout/imagePreview"
import type { Index } from "@/app/interfaces/index"
import { INDEX_LIST, USERS_LINK } from "@/app/lib/constant"

export default async function ImagePage({
  params,
}: Readonly<{ params: Promise<{ path: string }> }>): Promise<JSX.Element> {
  const syncPath: string = (await params).path
  const imageCrumb: Index = {
    name: syncPath,
    icon: INDEX_LIST[7].icon,
    color: INDEX_LIST[7].color,
  }

  return (
    <>
      <Breadcrumb crumbs={[USERS_LINK, imageCrumb]} />
      <Suspense fallback={<Skelton />}>
        <ImagePreview path={syncPath} />
      </Suspense>
      <DownloadBtn />
      <Link href="/users" className="btn max-w-fit mx-auto">
        <ArrowUturnLeftIcon className="rotate-z size-6" />
        表に戻る
      </Link>
    </>
  )
}

function Skelton(): JSX.Element {
  return (
    <>
      <h1>
        <p className="h-6 skeleton w-32" />
      </h1>
      <div className="h-80 max-w-lg skeleton w-full" />
    </>
  )
}
