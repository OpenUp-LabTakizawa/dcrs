'use client'

import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { type DragEvent, useState } from 'react'
import type React from 'react'

const MAX_UPLOAD_FILE_SIZE: number = 5 * 1024 * 1024

export function ImageUploader(): React.JSX.Element {
  const [image, setImage] = useState<FileList>()

  function onClickUpload(e: React.ChangeEvent<HTMLInputElement>): void {
    if (isFileTooLarge(e.target.files?.[0].size as number)) {
      return
    }
    setImage(e.target.files as FileList)
  }

  function onClickCancel(): void {
    setImage(undefined)

    const imageInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement
    imageInput.value = ''
  }

  return (
    <>
      {image?.[0] && (
        <Image
          src={encodeURI(URL.createObjectURL(image[0]))}
          width={100}
          height={100}
          alt="Uploaded File"
          className="w-full"
        />
      )}
      <DropImageZone
        image={image as FileList}
        setImage={setImage as React.Dispatch<React.SetStateAction<FileList>>}
      >
        <PhotoIcon
          className="mx-auto size-12 text-gray-300"
          aria-hidden="true"
        />
        <div className="mt-4 flex text-gray-600 text-sm leading-6">
          <label className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2">
            <span>アップロード</span>
            <input
              type="file"
              className="sr-only"
              accept="image/*"
              alt="Upload Image"
              onChange={(e) => onClickUpload(e)}
              required={true}
              name="image"
            />
          </label>
          <p className="pl-1">又は、ドラッグ＆ドロップ</p>
        </div>
        <p className="text-gray-600 text-xs leading-5">
          PNG, JPG, GIF, WEBP のファイルを 5MB まで
        </p>
      </DropImageZone>
      <button
        type="button"
        onClick={onClickCancel}
        className="btn btn-error w-max place-self-center"
        disabled={!image}
      >
        <XMarkIcon className="size-6" />
        アップロードキャンセル
      </button>
    </>
  )
}

function DropImageZone({
  children,
  image,
  setImage,
}: {
  children: React.ReactNode
  image: FileList
  setImage: React.Dispatch<React.SetStateAction<FileList>>
}): React.JSX.Element {
  const [isHoverd, setIsHoverd] = useState<boolean>(false)

  function onDragLeave(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault()
    if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget as Node)) {
      return
    }
    setIsHoverd(false)
  }

  function onDrop(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault()
    setIsHoverd(false)

    if (isFileTooLarge(e.dataTransfer.files[0].size)) {
      return
    }
    setImage(e.dataTransfer.files)
  }

  return (
    <div
      onDragEnter={() => setIsHoverd(true)}
      onDragLeave={(e) => onDragLeave(e)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e)}
      className={`mt-2 justify-center rounded-lg border border-dashed px-6 py-10 text-center${
        isHoverd ? ' border-indigo-600' : ' border-gray-900/25'
      }`}
      hidden={!!image}
    >
      {children}
    </div>
  )
}

function isFileTooLarge(size: number): boolean {
  if (size > MAX_UPLOAD_FILE_SIZE) {
    alert('5MB以下でアップロードして下さい')
    return true
  }
  return false
}
