'use client'

import type { FC } from 'react'
// import { ImageInput } from './imageInput'
// import { ImagePreview } from './imagePreview'
import type React from 'react' // React をインポートする
import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { ImageInput } from './imageInput'
import { ImagePreview } from './imagePreview'

// フォームの各要素と型
type FormData = {
  name: string
  company: string
  employeeId: number
  phone: string
  mail: string
  agreement: boolean
  image: FileList
}

// 「確認画面へ」ボタンを押したときの処理

const onSubmit: SubmitHandler<FormData> = (data) => {
  alert(JSON.stringify(data, null, 2))
  // デモ版仮でlocalStorageに保存
  // ホントはAPI送信してDBに投げたい。
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('FormData', JSON.stringify(data))
  }

  if (!data.image) {
    // console.log('画像が選択されていません')
    return
  }
}

export const UploadFormHook: FC = () => {
  const { handleSubmit, register } = useForm<FormData>()

  // ファイルの情報を保存する state 変数
  const [file, setFile] = useState<File>()

  // ファイルが選択されたときに呼び出される関数
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //
    if (e.target.files) {
      // 選択されたファイルを state 変数にセットする
      setFile(e.target.files[0])
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 [&>labe:input]:w-80">
          <label className="group block">
            <span className="after:content-['*'] after:ml-0.5 after:text-red-500">
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
            <span className="after:content-['*'] after:ml-0.5 after:text-red-500">
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
            <span className="after:content-['*'] after:ml-0.5 after:text-red-500">
              社員番号
            </span>
            <input
              className="block w-80"
              {...register('employeeId')}
              placeholder="123456"
              required={true}
            />
          </label>
          <label className="block">
            <span className="after:content-['*'] after:ml-0.5 after:text-red-500">
              連絡可能な個人電話番号
            </span>
            <input
              className="block w-80"
              {...register('phone')}
              placeholder="090-1234-5678"
              required={true}
            />
          </label>
          <label className="block">
            <span className="after:content-['*'] after:ml-0.5 after:text-red-500">
              メールアドレス
            </span>
            <input
              className="block w-80"
              {...register('mail')}
              placeholder="example@mail.com"
              required={true}
            />
          </label>
          <label className="block">
            <span className="after:content-['*'] after:ml-0.5 after:text-red-500">
              個人情報提供への同意
            </span>
            <br />
            同意する
            <input type="checkbox" {...register('agreement')} required={true} />
          </label>
          <ImagePreview />
          <ImageInput
            id="image"
            fileInputRef={{ current: null }}
            {...register('image')}
          />
          <br />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            type="submit"
          >
            確認画面へ
          </button>
        </div>
      </form>
    </>
  )
}

function handleConfirm() {
  window.location.href = '/upload/confirm'
}

function handleMoveHome() {
  window.location.href = '/'
}

function handleBack() {
  window.location.href = '../'
}
