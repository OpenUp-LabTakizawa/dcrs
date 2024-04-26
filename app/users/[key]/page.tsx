import { DownloadBtn } from '@/app/components/downloadBtn'
import { getImage } from '@/app/lib/getImage'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'
import type React from 'react'

export default async function ImagePage({
  params: { key },
}: {
  params: { key: string }
}): Promise<React.JSX.Element> {
  const response = (await getImage(key)) as Response
  const contentType = response.headers.get('Content-Type') as string
  const arrayBuffer: ArrayBuffer = await response.arrayBuffer()
  const buffer: Buffer = Buffer.from(arrayBuffer)
  const base64: string = buffer.toString('base64')

  return (
    <>
      <h1 className="font-semibold text-2xl">{key}</h1>
      <Image
        src={`data:${contentType};base64,${base64}`}
        id={key}
        width={300}
        height={300}
        alt={key}
      />
      <DownloadBtn />
      <Link href="/users" className="btn">
        <ArrowUturnLeftIcon className="size-6" />
        表に戻る
      </Link>
    </>
  )
}
