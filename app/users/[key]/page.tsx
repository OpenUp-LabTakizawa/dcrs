import { DownloadBtn } from '@/app/components/downloadBtn'
import { getImage } from '@/app/lib/getImage'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'

export default async function ImagePage({
  params: { key },
}: {
  params: { key: string }
}) {
  const response = (await getImage(key)) as Response
  const contentType = response.headers.get('Content-Type')
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const base64 = buffer.toString('base64')

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
