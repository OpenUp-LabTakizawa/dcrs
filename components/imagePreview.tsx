'use client'

import type React from 'react'
import type { FC } from 'react'
import { useRef, useState } from 'react'
import { ImageInput } from './imageInput'

// TODO: create and assign unique id
const IMAGE_ID = 'image'

export const ImagePreview: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 添付画像を状態管理
  const [images, setImages] = useState<{
    file: File | null
    name: string
    source: string
  }>({ file: null, name: '', source: '' })

  // 使うかもしれんから残してる。
  // const selectFile = () => {
  //   if (!fileInputRef.current) {
  //     return
  //   }
  //   // ローカルフォルダから画像選択ダイアログを表示する。
  //   fileInputRef.current.click()
  // }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length <= 0) {
      return
    }

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
  // こいつでは送信する時uploadFormHook.tsxでの「確認画面へ」ボタンを押した時、
  // キャンセルしててもDataFormに残ってるから何とかせなあかん。
  const handleClickCancelButton = () => {
    setImages({
      ...images,
      file: null,
      name: '',
      source: '',
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
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
          fileInputRef={fileInputRef}
          onChange={handleFileChange}
          id={IMAGE_ID}
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
    </>
  )
}
