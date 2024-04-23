import { prisma } from '@/app/lib/prisma'
import { client } from '@/app/lib/s3client'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { revalidateTag } from 'next/cache'

export const dynamic = 'force-dynamic'

export async function GET() {
  const users = await prisma.user.findMany()
  return Response.json({ users })
}

export async function POST(request: Request) {
  const body = await request.formData()
  const response = await postImage(body)
  if (response.status !== 200) {
    return response
  }

  const image = body.get('image') as File
  const user = await prisma.user.create({
    data: {
      name: body.get('name') as string,
      company: body.get('company') as string,
      employeeId: body.get('employeeId') as string,
      telephone: body.get('telephone') as string,
      email: body.get('email') as string,
      image: `${body.get('employeeId')}.${image.name.split('.').pop()}`,
    },
  })

  revalidateTag('users')
  return Response.json({ user })
}

async function postImage(body: FormData) {
  const image = body.get('image') as File
  const arrayBuffer = await image.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const command = new PutObjectCommand({
    ACL: 'private',
    Bucket: process.env.S3_BUCKET,
    ContentType: image.type,
    Key: `${body.get('employeeId')}.${image.name.split('.').pop()}`,
    Body: buffer,
  })
  const response = await client.send(command)
  return Response.json({ response })
}
