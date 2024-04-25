import { getUsers } from '@/app/lib/getUsers'
import {
  BuildingOffice2Icon,
  ClockIcon,
  EnvelopeIcon,
  IdentificationIcon,
  PhoneIcon,
  PhotoIcon,
  TagIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import type { User } from '@prisma/client'
import Link from 'next/link'
import { Suspense } from 'react'
import type { Indexlist } from '../interfaces/indexlist'

export default function Users() {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <TableIndex />
        </thead>
        <Suspense fallback={<Loading />}>
          <Tbody />
        </Suspense>
        <tfoot>
          <TableIndex />
        </tfoot>
      </table>
    </div>
  )
}

function TableIndex() {
  const indexList: Indexlist[] = [
    {
      name: 'ID',
      icon: TagIcon,
    },
    {
      name: '作成日時',
      icon: ClockIcon,
    },
    {
      name: '氏名',
      icon: UserIcon,
    },
    {
      name: '所属会社',
      icon: BuildingOffice2Icon,
    },
    {
      name: '社員番号',
      icon: IdentificationIcon,
    },
    {
      name: '電話番号',
      icon: PhoneIcon,
    },
    {
      name: 'メールアドレス',
      icon: EnvelopeIcon,
    },
    {
      name: '障がい者手帳画像',
      icon: PhotoIcon,
    },
  ] as const

  return (
    <tr>
      <th>
        <label>
          <input type="checkbox" className="checkbox" />
        </label>
      </th>
      {indexList.map((index) => (
        <th key={index.name} className="text-center">
          <index.icon className="inline mr-1 size-4" />
          {index.name}
        </th>
      ))}
    </tr>
  )
}

function Loading() {
  return (
    <tbody>
      <tr className="text-center">
        <th colSpan={9}>データ取得中・・・</th>
      </tr>
    </tbody>
  )
}

async function Tbody() {
  const userData = await getUsers()

  return (
    <tbody>
      {userData ? (
        userData.users.map((user: User) => (
          <tr key={user.id} className="text-center">
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <td>{user.id}</td>
            <td>{new Date(user.createdAt).toLocaleString('ja-JP')}</td>
            <td>{user.name}</td>
            <td>{user.company}</td>
            <td>{user.employeeId}</td>
            <td>{user.telephone}</td>
            <td>{user.email}</td>
            <td>
              <Link href={`/users/${user.image}`} className="link link-primary">
                {user.image}
              </Link>
            </td>
          </tr>
        ))
      ) : (
        <tr className="text-center">
          <th colSpan={9}>対応待ちデータなし</th>
        </tr>
      )}
    </tbody>
  )
}
