'use client'

import type { FC } from 'react'
// import { ImageInput } from './imageInput'
// import { ImagePreview } from './imagePreview'
import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

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

// 確定ボタンを押したときの処理
const onSubmit: SubmitHandler<FormData> = (data) => {
  alert(JSON.stringify(data, null, 2))
  // デモ版仮でlocalStorageに保存
  // ホントはAPI送信してDBに投げたい。
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('FormData', JSON.stringify(data))
    console.log('localStorageに保存しました')
    console.log(data.image)
  } else {
    console.log('localStorageがありません')
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
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // 選択されたファイルを state 変数にセットする
      setFile(e.target.files[0])
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
              {...register('company')}
              placeholder="オープンアップグループ"
              required={true}
            />
            <label />
          </div>

          <div className="mb-5">
            <p>社員番号</p>
            <input
              {...register('employeeId')}
              placeholder="123456"
              required={true}
            />
            <label />
          </div>

          <div className="mb-5">
            <p>連絡可能な個人電話番号</p>
            <input
              {...register('phone')}
              placeholder="090-1234-5678"
              required={true}
            />
            <label />
          </div>

          <div className="mb-5">
            <p>メールアドレス</p>
            <input
              {...register('mail')}
              placeholder="example@mail.com"
              required={true}
            />
            <label />
          </div>

          <div className="mb-5">
            <p>個人情報提供に同意いただけますか?</p>
            <p>
              <input
                type="checkbox"
                {...register('agreement')}
                // required={true}
              />
              <label />
              同意する
            </p>
          </div>

          <label className="mb-5" htmlFor="update">
            写真を撮影してアップロードする
          </label>
          <br />
          <input
            className="mb-5"
            id="upload"
            type="file"
            accept="image/*"
            capture="environment"
            {...register('image')}
            onChange={handleFileChange}
            required={true}
          />
          <p>ファイル名: {file && file.name}</p>
          <img
            src={file && URL.createObjectURL(file)}
            alt="アップロードした画像"
          />
          <label />
        </div>
        <div>
          <button
            onClick={handleConfirm}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-2"
            type="submit"
          >
            確認画面へ
          </button>
        </div>
        <div>
          <button
            onClick={handleMoveHome}
            className="bg-yellow-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded-full mb-2"
            type="submit"
          >
            ホーム画面へ
          </button>
        </div>
        <div>
          <button
            onClick={handleBack}
            className="bg-yellow-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded-full mb-2"
            type="submit"
          >
            前の画面へ
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
