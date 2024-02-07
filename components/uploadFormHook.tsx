'use client'

import type { FC } from 'react'
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

  return (
    <>
      <p className="mb-3 text-2xl font-semibold">アップロードフォーム</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="mb-5">
            <p>お名前</p>
            <input
              className="w-80"
              {...register('name')}
              placeholder="オープン太郎"
              required={true}
            />
            <label />
          </div>

          <div className="mb-5">
            <p>所属会社</p>
            {/* フォームのサイズを調整すべき */}
            {/* <input {...register('company')} placeholder="株式会社オープンアップグループ" required /> */}
            <input
              className="w-80"
              {...register('company')}
              placeholder="オープンアップグループ"
              required={true}
            />
            <label />
          </div>

          <div className="mb-5">
            <p>社員番号</p>
            <input
              className="w-80"
              {...register('employeeId')}
              placeholder="123456"
              required={true}
            />
            <label />
          </div>

          <div className="mb-5">
            <p>連絡可能な個人電話番号</p>
            <input
              className="w-80"
              {...register('phone')}
              placeholder="090-1234-5678"
              required={true}
            />
            <label />
          </div>

          <div className="mb-5">
            <p>メールアドレス</p>
            <input
              className="w-80"
              {...register('mail')}
              placeholder="example@mail.com"
              required={true}
            />
            <label />
          </div>

          <div className="mb-5">
            <p>個人情報提供に同意いただけますか?</p>
            <p>
              <input type="radio" {...register('agreement')} required={true} />
              <label />
              同意する
            </p>
          </div>

          <div>
            <ImagePreview />
            <ImageInput
              id="image"
              fileInputRef={{ current: null }}
              {...register('image')}
            />
          </div>
        </div>
        <br />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          type="submit"
        >
          確認画面へ
        </button>
      </form>
    </>
  )
}
