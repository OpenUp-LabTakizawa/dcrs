import { STEPS } from "@/app/lib/constant"
import { getUsers } from "@/app/lib/getUsers"
import type { User } from "@/app/lib/schema"
import {
  CameraIcon,
  ForwardIcon,
  PlusIcon,
  TableCellsIcon,
} from "@heroicons/react/24/solid"
import Link from "next/link"
import { type JSX, Suspense } from "react"

export const dynamic = "force-dynamic"

export default function Home(): JSX.Element {
  return (
    <>
      <h1 className="flex font-semibold items-center mx-auto text-center text-2xl w-fit">
        <ForwardIcon className="move-right mr-2 size-8 text-info" />
        登録手順
        <ForwardIcon className="move-right mx-2 size-8 text-info" />
      </h1>
      <ul className="timeline timeline-vertical lg:timeline-horizontal">
        {STEPS.map((step, index) => (
          <li key={step.name}>
            {index > 0 && <hr />}
            <div className="timeline-start">{index + 1}</div>
            <div className="timeline-middle">
              <step.icon className={`size-5 ${step.color}`} />
            </div>
            <div className="timeline-end timeline-box">{step.name}</div>
            {index < STEPS.length - 1 && <hr />}
          </li>
        ))}
      </ul>
      <Link href="/register" className="btn btn-primary max-w-fit mx-auto">
        <CameraIcon className="size-6" />
        障がい者手帳画像を提出
      </Link>
      <Link href="/users" className="btn btn-secondary indicator mx-auto">
        <TableCellsIcon className="size-6" />
        登録データ一覧
        <Suspense
          fallback={<div className="badge indicator-item skeleton w-8" />}
        >
          <Badge />
        </Suspense>
      </Link>
    </>
  )
}

async function Badge(): Promise<JSX.Element> {
  const userData: { getUsers: User[] } = await getUsers()

  return (
    <>
      {userData && userData.getUsers.length > 0 && (
        <div className="badge badge-warning gap-0 indicator-item">
          <PlusIcon className="size-4" />
          {userData.getUsers.length}件
        </div>
      )}
    </>
  )
}
