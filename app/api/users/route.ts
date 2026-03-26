import { db, handicap, type NewUser, type User } from "@/app/lib/schema"
import { storageClient } from "@/app/lib/storage"

export async function GET(): Promise<Response> {
  const getUsers: User[] = await db.select().from(handicap)
  return Response.json({ getUsers })
}

export async function POST(request: Readonly<Request>): Promise<Response> {
  const body: FormData = await request.formData()
  const image = body.get("image")
  if (!(image instanceof File) || !image.name) {
    return Response.json({ error: "Missing or invalid image" }, { status: 400 })
  }
  const key = `${body.get("employeeId")}.${image.name.split(".").pop()}`

  const arrayBuffer: ArrayBuffer = await image.arrayBuffer()
  const buffer: Buffer = Buffer.from(arrayBuffer)
  await storageClient.upload({
    key,
    body: buffer,
    contentType: image.type,
  })

  const newUser: NewUser = {
    name: body.get("name") as string,
    company: body.get("company") as string,
    employeeId: body.get("employeeId") as string,
    telephone: body.get("telephone") as string,
    email: body.get("email") as string,
    image: key,
  }

  try {
    const insertUser: User[] = await db
      .insert(handicap)
      .values(newUser)
      .returning()
    return Response.json({ insertUser })
  } catch (error) {
    try {
      await storageClient.delete(key)
    } catch {
      // Ignore storage cleanup errors
    }
    const message = error instanceof Error ? error.message : "DB insert failed"
    return Response.json({ error: message }, { status: 500 })
  }
}
