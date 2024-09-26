import { TEST_BUCKET } from "@/app/lib/constant"
import { client } from "@/app/lib/s3client"
import {
  GetObjectCommand,
  type GetObjectCommandOutput,
} from "@aws-sdk/client-s3"

export async function GET(
  _request: Request,
  { params }: Readonly<{ params: Promise<{ key: string }> }>,
): Promise<Response> {
  const command: GetObjectCommand = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET || TEST_BUCKET,
    Key: (await params).key,
  })
  const response: GetObjectCommandOutput = await client.send(command)
  const contentType: string = response.ContentType as string

  return new Response(response.Body as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": contentType,
    },
  })
}
