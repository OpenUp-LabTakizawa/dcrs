"use client"

import { AlertContext } from "@/app/components/layout/alertBox"
import type { Alert } from "@/app/interfaces/alert"
import type { ProfileForm } from "@/app/interfaces/form"
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid"
import Image from "next/image"
import {
  type ChangeEvent,
  type Dispatch,
  type DragEvent,
  type JSX,
  type ReactNode,
  type RefObject,
  type SetStateAction,
  useContext,
  useRef,
  useState,
} from "react"
import type { UseFormRegister, UseFormUnregister } from "react-hook-form"

export function ImageUploader({
  register,
  unregister,
}: Readonly<{
  register: UseFormRegister<ProfileForm>
  unregister: UseFormUnregister<ProfileForm>
}>): JSX.Element {
  const { ref, onChange, ...rest } = register("image", {
    required: true,
  })
  const maxUploadSize: number = 5 * 1024 * 1024
  const acceptedImages: { name: string; mimeType: string }[] = [
    { name: "AVIF", mimeType: "image/avif" },
    { name: "JPG", mimeType: "image/jpeg" },
    { name: "PNG", mimeType: "image/png" },
    { name: "WEBP", mimeType: "image/webp" },
  ] as const
  const setAlert: Dispatch<SetStateAction<Alert>> = useContext(AlertContext)
  const inputRef: RefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement | null>(null) as RefObject<HTMLInputElement | null>
  const input: HTMLInputElement = inputRef.current as HTMLInputElement
  const [image, setImage] = useState<FileList>()

  function validateFile(file: Readonly<File>): string {
    if (file.size > maxUploadSize) {
      return `ファイルサイズは最大${maxUploadSize / 1024 / 1024}MBです`
    }
    if (!acceptedImages.some((image) => image.mimeType === file.type)) {
      return "不正なファイル形式です"
    }
    return ""
  }

  function onUpload(e: ChangeEvent<HTMLInputElement>): void {
    const result = validateFile(e.target.files?.[0] as File)
    if (result) {
      onUploadCancel("error", result)
      return
    }
    setImage(e.target.files as FileList)
  }

  function onUploadCancel(eventType: string, message: string): void {
    input.value = ""
    setImage(undefined)
    unregister("image")
    setAlert({
      eventType: eventType,
      message: message,
    })
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
      <DropImageZone image={image as FileList} input={input}>
        <PhotoIcon
          className="mx-auto size-12 text-gray-300"
          aria-hidden="true"
        />
        <div className="flex leading-6 mt-4 text-sm text-gray-600">
          <label className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2">
            <span>アップロード</span>
            <input
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  onChange(e)
                  onUpload(e)
                }
              }}
              ref={(element) => {
                ref(element)
                inputRef.current = element as HTMLInputElement
              }}
              {...rest}
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
  input,
}: Readonly<{
  children: ReactNode
  image: FileList
  input: HTMLInputElement
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

    input.files = e.dataTransfer.files
    input.dispatchEvent(new Event("change", { bubbles: true }))
  }

  return (
    <div
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
