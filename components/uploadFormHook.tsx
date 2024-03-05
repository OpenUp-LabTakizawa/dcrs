'use client'

import type { FC } from 'react'
import React from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { ImageInput } from './imageInput'

// フォームの各要素と型
export type FormData = {
  name: string
  company: string
  employeeId: number
  phone: string
  mail: string
  agreement: boolean
  image: FileList | null
}

// 「確認画面へ」ボタンを押したときの処理
const onSubmit: SubmitHandler<FormData> = (data) => {
  alert(JSON.stringify(data, null, 2))
  // デモ版仮でlocalStorageに保存
  // ホントはAPI送信してDBに投げたい。
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('FormData', JSON.stringify(data))
  }
}

export const UploadFormHook: FC = () => {
  const { handleSubmit, register, setValue } = useForm<FormData>()

  type ImageData = {
    file: File
    name: string
    source: string
  }

  // 添付画像を状態管理
  const [images, setImages] = React.useState<ImageData>({
    file: new File([], ''),
    name: '',
    source: '',
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    // ファイルが無い場合は何もしない
    if (files === null) {
      return
    }
    // FormDataにファイルを入れる
    setValue('image', files)
    // 画像データを抽出する処理
    const file = files[0]
    const fileReader = new FileReader()
    fileReader.onload = () => {
      setImages({
        ...images,
        file: file,
        name: file.name,
        source: fileReader.result as string,
      })
    }
    fileReader.readAsDataURL(file)
  }

  // キャンセルボタンの処理
  const handleClickCancelButton = () => {
    setImages({
      ...images,
      file: new File([], ''),
      name: '',
      source: '',
    })
    setValue('image', null)
    // ファイルinputフォームの初期化
    const fileInput = document.getElementById('image') as HTMLInputElement
    if (fileInput.value) {
      fileInput.value = ''
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
            {images.source && images.name ? (
              <img src={images.source} alt={images.name} />
            ) : (
              <span className="after:content-['*'] after:ml-0.5 after:text-red-500">
                画像をアップロードする
              </span>
            )}
            <ImageInput
              onChange={handleImageChange}
              id="image"
              required={true}
            />
          </label>
          {images.source && images.name && (
            <button
              type="button"
              onClick={handleClickCancelButton}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full mr-2"
            >
              × 画像アップロードキャンセル
            </button>
          )}
          <br />
          <button
            onClick={handleConfirm}
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
