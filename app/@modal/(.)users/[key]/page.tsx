import { getImage } from '@/app/lib/getImage'
import Image from 'next/image'
import { Modal } from './modal'

export default async function ImageModal({
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
