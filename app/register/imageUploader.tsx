"use client"

import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid"
import Image from "next/image"
import {
  type ChangeEvent,
  type Dispatch,
  type DragEvent,
  type JSX,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { AlertContext } from "@/app/components/layout/alertBox"
import type { Alert } from "@/app/lib/types/alert"
import type { RegisterFormApi } from "@/app/register/page"

export function ImageUploader({
  form,
  onPreviewChange,
}: Readonly<{
  form: RegisterFormApi
  onPreviewChange: (url: string) => void
}>): JSX.Element {
  const maxUploadSize: number = 5 * 1024 * 1024
  const acceptedImages: { name: string; mimeType: string }[] = [
    { name: "AVIF", mimeType: "image/avif" },
    { name: "JPG", mimeType: "image/jpeg" },
    { name: "PNG", mimeType: "image/png" },
    { name: "WEBP", mimeType: "image/webp" },
  ] as const
  const setAlert: Dispatch<SetStateAction<Alert>> = useContext(AlertContext)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [image, setImage] = useState<FileList | undefined>()
  const [previewUrl, setPreviewUrl] = useState<string>("")

  // Revoke the previous object URL when it changes or on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  function validateFile(file: Readonly<File>): string {
    if (file.size > maxUploadSize) {
      return `ファイルサイズは最大${maxUploadSize / 1024 / 1024}MBです`
    }
    if (!acceptedImages.some((image) => image.mimeType === file.type)) {
      return "不正なファイル形式です"
    }
    return ""
  }

  function handleFiles(files: FileList): void {
    const result = validateFile(files[0])
    if (result) {
      onUploadCancel("error", result)
      return
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    const newUrl = URL.createObjectURL(files[0])
    setImage(files)
    setPreviewUrl(newUrl)
    form.setFieldValue("image", files)
    onPreviewChange(newUrl)
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>): void {
    if (!e.target.files?.[0]) {
      return
    }
    handleFiles(e.target.files)
  }

  function onUploadCancel(eventType: string, message: string): void {
    if (inputRef.current) {
      inputRef.current.value = ""
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setImage(undefined)
    setPreviewUrl("")
    form.setFieldValue("image", undefined)
    onPreviewChange("")
    setAlert({
      eventType: eventType,
      message: message,
    })
  }

  return (
    <>
      {image?.[0] && previewUrl && (
        <Image
          src={previewUrl}
          width={100}
          height={100}
          alt="Uploaded File"
          className="w-full"
        />
      )}
      <DropImageZone image={image} onDropFiles={handleFiles}>
        <PhotoIcon
          className="mx-auto size-12 text-gray-300"
          aria-hidden="true"
        />
        <div className="flex leading-6 mt-4 text-sm text-gray-600">
          <label className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500 focus-within:outline-hidden focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2">
            <span>アップロード</span>
            <input
              type="file"
              className="sr-only"
              accept="image/*"
              name="image"
              onChange={onInputChange}
              ref={inputRef}
              alt="Upload Image"
              required={true}
            />
          </label>
          <p className="pl-1">又は、ドラッグ＆ドロップ</p>
        </div>
        <p className="leading-5 text-gray-600 text-xs">
          {acceptedImages.map((image) => image.name).join(", ")} のファイルを
          {maxUploadSize / 1024 / 1024}MB まで
        </p>
      </DropImageZone>
      <button
        type="button"
        onClick={() => onUploadCancel("success", "キャンセルしました")}
        className="btn btn-error place-self-center w-max"
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
  onDropFiles,
}: Readonly<{
  children: ReactNode
  image: FileList | undefined
  onDropFiles: (files: FileList) => void
}>): JSX.Element {
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

    if (e.dataTransfer.files.length === 0 || e.dataTransfer.files.length > 1) {
      return
    }
    onDropFiles(e.dataTransfer.files)
  }

  return (
    <div
      role="img"
      onDragEnter={() => setIsHoverd(true)}
      onDragLeave={(e) => onDragLeave(e)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e)}
      className={`border border-dashed justify-center mt-2 rounded-lg px-6 py-10 text-center ${
        isHoverd ? "border-indigo-600" : "border-gray-900/25"
      }`}
      hidden={!!image}
    >
      {children}
    </div>
  )
}
