"use client"

import { PingAnimation } from "@/app/components/animation/pingAnimation"
import { AlertContext } from "@/app/components/layout/alertBox"
import { Stepper } from "@/app/components/layout/stepper"
import type { Alert } from "@/app/interfaces/alert"
import type { Form, FormItem } from "@/app/interfaces/form"
import {
  AGREEMENT,
  COMPANY,
  EMAIL,
  EMPLOYEE_ID,
  IMAGE,
  NAME,
  TELEPHONE,
} from "@/app/lib/constant"
import {
  ArrowUturnLeftIcon,
  CheckIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type React from "react"
import { useActionState, useContext, useRef } from "react"
import {
  type UseFormRegister,
  type UseFormWatch,
  useForm,
} from "react-hook-form"
import { ImageUploader } from "./imageUploader"

export default function Register(): React.JSX.Element {
  const companies: string[] = [
    "オープンアップグループ",
    "ビーネックステクノロジーズ",
  ] as const
  const {
    formState: { isValid },
    register,
    unregister,
    watch,
  } = useForm<Form>()
  const dialogRef: React.RefObject<HTMLDialogElement> =
    useRef<HTMLDialogElement>(null)
  const setAlert: React.Dispatch<React.SetStateAction<Alert>> =
    useContext(AlertContext)
  const router = useRouter()
  const [_state, formAction, isPending] = useActionState(
    sendData,
    new FormData(),
  )

  async function sendData(
    _prevState: FormData,
    formData: FormData,
  ): Promise<FormData> {
    fetch("/api/users", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        dialogRef.current?.close()
        if (!res.ok) {
          setAlert({ eventType: "error", message: res.statusText })
          return formData
        }
        setAlert({ eventType: "success", message: "送信に成功しました" })
        router.push("/register/success")
      })
      .catch((error) => {
        dialogRef.current?.close()
        setAlert({ eventType: "error", message: error })
      })
    return formData
  }

  return (
    <>
      <Stepper targetStep={0} />
      <form action={formAction} className="flex flex-col gap-6 max-w-xs">
        <p className="text-center before:ml-0.5 before:text-red-500 before:content-['*']">
          は必須項目
        </p>
        <Input item={NAME} register={register} />
        <label className="form-control w-full">
          <div className="label">
            <p className="label-text after:ml-0.5 after:text-red-500 after:content-['*']">
              {COMPANY.value}
            </p>
          </div>
          <select
            className="select select-bordered"
            {...register("company", { required: true })}
            defaultValue=""
            required={true}
          >
            <option value="" disabled={true}>
              以下から１つ選択
            </option>
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </label>
        <Input item={EMPLOYEE_ID} register={register} />
        <Input item={TELEPHONE} register={register} />
        <Input item={EMAIL} register={register} />
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body overflow-y-auto max-h-72">
            <p className="mb-2 after:ml-0.5 after:text-red-500 after:content-['*']">
              {AGREEMENT.value}
            </p>
            <p className="text-sm whitespace-pre">
              {
                "お預かりした個人情報は、\n株式会社オープンアップグループ\n（以下「当社」）が業務に利用するほか、\n当社のグループ企業において、\n以下の利用目的で共同利用します。\n\n共同利用についての公表事項及び\n共同利用者の範囲に含まれる\nグループ企業の一覧は、\n以下の個人情報保護方針の\n記載をご覧下さい。\n\n株式会社オープンアップグループは、\n提供頂いた個人情報を法令及び\n個人情報保護方針に従って\n安全且つ適切に取り扱います。\n\n個人情報に関する問い合わせ・\n請求方法等につきましては、\n「個人情報について」をご覧下さい。\n\n上記の内容について同意頂ける方は、\n以下の「同意する」にチェックを\nお願い致します。\n"
              }
            </p>
            <label className="label cursor-pointer self-center">
              <span className="label-text mr-2">同意する</span>
              <input
                type="checkbox"
                className="checkbox"
                {...register("agreement", { required: true })}
                value="同意する"
                required={true}
              />
            </label>
          </div>
        </div>
        <p className="after:ml-0.5 after:text-red-500 after:content-['*']">
          {IMAGE.value}
        </p>
        <ImageUploader register={register} unregister={unregister} />
        <button
          className={`btn btn-warning w-max place-self-center${
            isValid ? " [&:not(:hover)]:animate-bounce" : ""
          }`}
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          disabled={!isValid}
        >
          <CheckIcon className="size-6" />
          確認画面へ
        </button>
        <ConfirmDialog ref={dialogRef} watch={watch} isPending={isPending} />
      </form>
    </>
  )
}

function Input({
  item,
  register,
}: Readonly<{
  item: FormItem
  register: UseFormRegister<Form>
}>): React.JSX.Element {
  const Icon = item.icon as React.ElementType

  return (
    <label className="input input-bordered flex flex-row items-center gap-2">
      <span className="flex flex-row items-center text-sm whitespace-nowrap after:ml-0.5 after:text-red-500 after:content-['*']">
        <Icon className="mr-2 size-4 opacity-70" />
        {item.value}
      </span>
      <input
        type={item.type}
        {...register(item.name, { required: true })}
        placeholder={item.placeholder}
        required={true}
      />
    </label>
  )
}

function ConfirmDialog({
  ref,
  watch,
  isPending,
}: Readonly<{
  ref: React.RefObject<HTMLDialogElement>
  watch: UseFormWatch<Form>
  isPending: boolean
}>): React.JSX.Element {
  const form: FormItem[] = [
    NAME,
    COMPANY,
    EMPLOYEE_ID,
    TELEPHONE,
    EMAIL,
    AGREEMENT,
    IMAGE,
  ] as const

  return (
    <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
      <div className="grid gap-4 modal-box text-center">
        <button
          type="button"
          onClick={() => ref.current?.close()}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 hover:scale-110"
          aria-label="閉じる"
        >
          <XMarkIcon />
        </button>
        <Stepper targetStep={1} />
        <table className="table">
          <tbody>
            {form.map((item) => (
              <tr key={item.name} className="grid grid-cols-2">
                <th>{item.value}</th>
                <td className="text-center">
                  {item.name === "image" && watch(item.name) ? (
                    <Image
                      src={document.getElementsByTagName("img")[0].src}
                      width={100}
                      height={100}
                      alt="Uploaded File"
                      className="w-full"
                    />
                  ) : (
                    (watch(item.name) as string)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="modal-action justify-center gap-4">
          <button
            type="submit"
            className={`btn btn-info ${
              isPending ? "indicator" : "[&:not(:hover)]:animate-bounce"
            }`}
            disabled={isPending}
          >
            {isPending && <PingAnimation />}
            <PaperAirplaneIcon className="size-6" />
            送信
          </button>
          <button
            type="button"
            className="btn btn-error hover:scale-110"
            onClick={() => ref.current?.close()}
          >
            <ArrowUturnLeftIcon className="size-6" />
            戻る
          </button>
        </div>
      </div>
      <div className="modal-backdrop">
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="戻る"
        />
      </div>
    </dialog>
  )
}
