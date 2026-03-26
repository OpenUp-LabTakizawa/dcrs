import { storageClient } from "@/app/lib/storage"

export async function GET(
  _request: Request,
  { params }: Readonly<{ params: Promise<{ key: string }> }>,
): Promise<Response> {
  const result = await storageClient.get((await params).key)
  return new Response(result.body, {
    status: 200,
    headers: {
      "Content-Type": result.contentType,
    },
  })
}
