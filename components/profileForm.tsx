'use client'

import { useId, useState } from 'react'
import type React from 'react'
import {
  type SubmitHandler,
  type UseFormRegister,
  useForm,
} from 'react-hook-form'

type Profile = {
  name: string
  company: string
  employeeId: number
  phoneNumber: string
  mail: string
  image: FileList
}

export function ProfileForm() {
  const { register, handleSubmit } = useForm<Profile>()
  const onSubmit: SubmitHandler<Profile> = (data) => {
    alert(JSON.stringify(data, null, 2))
    // デモ版仮でlocalStorageに保存
    // ホントはAPI送信してDBに投げたい。
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('profile', JSON.stringify(data))
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-6 [&>labe:input]:w-80"
    >
      <label className="block">
        <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
          お名前
        </span>
        <input
          className="block w-80"
          {...register('name')}
          placeholder="オープン太郎"
          required={true}
        />
      </label>
      <label className="block">
        <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
          所属会社
        </span>
        <select
          className="block w-80"
          defaultValue={''}
          {...register('company')}
          required={true}
        >
          <option value="" disabled>
            以下から選択して下さい。
          </option>
          <option value="株式会社オープンアップグループ">
            株式会社オープンアップグループ
          </option>
          <option value="株式会社ビーネックステクノロジーズ">
            株式会社ビーネックステクノロジーズ
          </option>
        </select>
      </label>
      <label className="block">
        <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
          社員番号
        </span>
        <input
          className="block w-80"
          placeholder="123456"
          {...register('employeeId')}
          required={true}
        />
      </label>
      <label className="block">
        <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
          連絡可能な個人電話番号
        </span>
        <input
          className="block w-80"
          placeholder="090-1234-5678"
          {...register('phoneNumber')}
          required={true}
        />
      </label>
      <label className="block">
        <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
          メールアドレス
        </span>
        <input
          className="block w-80"
          placeholder="example@mail.com"
          {...register('mail')}
          required={true}
        />
      </label>
      <label className="block">
        <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
          個人情報提供への同意
        </span>
        <br />
        同意する
        <input type="checkbox" required={true} />
      </label>
      <ImageUpload register={register} />
      <button
        className="rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        type="submit"
      >
        確認画面へ
      </button>
    </form>
  )
}

function ImageUpload({ register }: { register: UseFormRegister<Profile> }) {
  const imageId = useId()
  const [image, setImage] = useState<FileList | null>(null)

  return (
    <>
      {!image ? (
        <label
          className="mb-5"
          style={{
            border: 'white 3px dotted',
            display: 'flex',
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
            画像をアップロードする
          </span>
          <input
            className="h-1 w-1 opacity-0"
            type="file"
            accept="image/*"
            id={imageId}
            {...register('image')}
            alt="Upload Image"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setImage(e.target.files)
            }
            required={true}
          />
        </label>
      ) : (
        <>
          <img
            src={encodeURI(URL.createObjectURL(image[0]))}
            alt="Uploaded File"
            className="h-64 w-96 object-scale-down"
          />
          <button
            type="button"
            onClick={() => setImage(null)}
            className="mr-2 rounded-full bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
          >
            × アップロードキャンセル
          </button>
        </>
      )}
    </>
  )
}
