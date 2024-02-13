'use client'

import type { FC } from 'react'
import React from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { ImageInput } from './imageInput'

// フォームの各要素と型
type FormData = {
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

  // 添付画像を状態管理
  const [images, setImages] = React.useState<{
    file: File | null
    name: string
    source: string
  }>({ file: null, name: '', source: '' })

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
      file: null,
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
                '画像をアップロードする'
              )}
              <ImageInput
                onChange={handleImageChange}
                id="image"
                required={true}
              />
            </label>
            <div>
              {images.source && images.name && (
                <button
                  type="button"
                  onClick={handleClickCancelButton}
                  className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2"
                >
                  × 画像アップロードキャンセル
                </button>
              )}
            </div>
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
