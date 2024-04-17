'use client'

import type { Checklist } from '@/app/interfaces/checklist'
import {
  CheckIcon,
  EnvelopeIcon,
  IdentificationIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/24/solid'
import type React from 'react'
import { useActionState, useRef, useState } from 'react'
import { validate } from '../lib/validate'
import { ConfirmDialog } from './confirmDialog'
import { ImageUploader } from './imageUploader'

const checklist: Checklist[] = [
  {
    name: 'name',
    value: '氏名',
    type: 'text',
    icon: UserIcon,
    placeholder: 'オープン太郎',
  },
  {
    name: 'company',
    value: '所属会社',
    type: 'select',
  },
  {
    name: 'employeeId',
    value: '社員番号',
    type: 'number',
    icon: IdentificationIcon,
    placeholder: '123456',
  },
  {
    name: 'telephone',
    value: '電話番号',
    type: 'tel',
    icon: PhoneIcon,
    placeholder: '09012345678',
  },
  {
    name: 'email',
    value: 'Eメール',
    type: 'email',
    icon: EnvelopeIcon,
    placeholder: 'example@mail.com',
  },
  {
    name: 'agreement',
    value: '個人情報提供への同意',
    type: 'checkbox',
  },
  {
    name: 'image',
    value: '障がい者手帳の画像・写真',
    type: 'file',
  },
] as const

const COMPANIES = [
  'オープンアップグループ',
  'ビーネックステクノロジーズ',
] as const

export function ProfileForm() {
  const initialState = new FormData()
  const [state, action] = useActionState<FormData>(validate, initialState)
  const dialog = useRef<HTMLDialogElement>(null)
  const [image, setImage] = useState<HTMLImageElement>()

  return (
    <>
      <form action={action} className="flex flex-col gap-6 max-w-xs">
        <p className="text-center before:ml-0.5 before:text-red-500 before:content-['*']">
          は必須項目
        </p>
        <Input
          item={checklist.find((item) => item.name === 'name') as Checklist}
        />
        <label className="form-control w-full">
          <div className="label">
            <p className="label-text after:ml-0.5 after:text-red-500 after:content-['*']">
              {checklist.find((item) => item.name === 'company')?.value}
            </p>
          </div>
          <select
            className="select select-bordered"
            defaultValue={''}
            required={true}
          >
            <option value={''} disabled={true}>
              以下から１つ選択
            </option>
            {COMPANIES.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </label>
        <Input
          item={
            checklist.find((item) => item.name === 'employeeId') as Checklist
          }
        />
        <Input
          item={
            checklist.find((item) => item.name === 'telephone') as Checklist
          }
        />
        <Input
          item={checklist.find((item) => item.name === 'email') as Checklist}
        />
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body overflow-y-auto max-h-72">
            <p className="mb-2 after:ml-0.5 after:text-red-500 after:content-['*']">
              {checklist.find((item) => item.name === 'agreement')?.value}
            </p>
            <p className="text-sm">
              お預かりした個人情報は、株式会社オープンアップグループ（以下「当社」）が業務に利用するほか、
              当社のグループ企業において、以下の利用目的で共同利用します。
              <br />
              共同利用についての公表事項及び共同利用者の範囲に含まれるグループ企業の一覧は、
              以下の個人情報保護方針の記載をご覧下さい。
              <br />
              株式会社オープンアップグループは、提供頂いた個人情報を法令及び個人情報保護方針に従って
              安全且つ適切に取り扱います。
              <br />
              個人情報に関する問い合わせ・請求方法等につきましては、「個人情報について」をご覧下さい。
              <br />
              上記の内容について同意頂ける方は、以下の「同意する」にチェックをお願い致します。
            </p>
            <label className="label cursor-pointer self-center">
              <span className="label-text mr-2">同意する</span>
              <input type="checkbox" className="checkbox" required={true} />
            </label>
          </div>
        </div>
        <p className="after:ml-0.5 after:text-red-500 after:content-['*']">
          {checklist.find((item) => item.name === 'image')?.value}
        </p>
        <ImageUploader />
        <button
          className="btn btn-warning w-max place-self-center"
          type="submit"
        >
          <CheckIcon className="size-6" />
          確認画面へ
        </button>
      </form>
      <ConfirmDialog
        dialog={dialog}
        checkList={checklist}
        image={image as HTMLImageElement}
      />
    </>
  )
}

function Input({
  item,
}: {
  item: Checklist
}): React.JSX.Element {
  const Icon = item.icon as React.ElementType

  return (
    <label className="input input-bordered flex flex-row items-center gap-2">
      <span className="flex flex-row items-center text-sm whitespace-nowrap after:ml-0.5 after:text-red-500 after:content-['*']">
        <Icon className="mr-2 size-4 opacity-70" />
        {item.value}
      </span>
      <input type={item.type} placeholder={item.placeholder} required={true} />
    </label>
  )
}
