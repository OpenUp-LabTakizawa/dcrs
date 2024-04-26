import { getImage } from '@/app/lib/getImage'
import Image from 'next/image'
import type React from 'react'
import { Modal } from './modal'

export default async function ImageModal({
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
    <Modal>
      <Image
        src={`data:${contentType};base64,${base64}`}
        id={key}
        width={100}
        height={100}
        className="w-full"
        alt="障がい者手帳画像"
      />
    </Modal>
  )
}
