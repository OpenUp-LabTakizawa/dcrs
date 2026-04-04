"use client"

import {
  ArrowUturnLeftIcon,
  CheckIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid"
import { useForm, useStore } from "@tanstack/react-form"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  type Dispatch,
  type JSX,
  type RefObject,
  type SetStateAction,
  useActionState,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { PingAnimation } from "@/app/components/animation/pingAnimation"
import { AlertContext } from "@/app/components/layout/alertBox"
import { useNavigationBlocker } from "@/app/components/layout/navigationBlocker"
import { Stepper } from "@/app/components/layout/stepper"
import {
  AGREEMENT,
  COMPANY,
  EMAIL,
  EMPLOYEE_ID,
  IMAGE,
  NAME,
  TELEPHONE,
} from "@/app/lib/constant"
import type { Alert } from "@/app/lib/types/alert"
import type { ProfileForm, ProfileFormItem } from "@/app/lib/types/form"
import { ImageUploader } from "@/app/register/imageUploader"

// Type helper: extracts the form API type (never called at runtime)
// eslint-disable-next-line
function useFormTypeHelper() {
  const defaultValues: ProfileForm = {
    agreement: false,
    company: "",
    email: "",
    employeeId: "",
    image: undefined,
    name: "",
    telephone: "",
  }
  return useForm({ defaultValues })
}
export type RegisterFormApi = ReturnType<typeof useFormTypeHelper>

export default function Register(): JSX.Element {
  const companies: string[] = [
    "オープンアップグループ",
    "ビーネックステクノロジーズ",
  ] as const
  const defaultValues: ProfileForm = {
    agreement: false,
    company: "",
    email: "",
    employeeId: "",
    image: undefined,
    name: "",
    telephone: "",
  }
  const form = useForm({ defaultValues })
  const dialogRef: RefObject<HTMLDialogElement | null> =
    useRef<HTMLDialogElement | null>(null)
  const setAlert: Dispatch<SetStateAction<Alert>> = useContext(AlertContext)
  const { isBlocked, setIsBlocked } = useNavigationBlocker()
  const router = useRouter()
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("")
  const [_state, formAction, isPending] = useActionState(
    sendData,
    new FormData(),
  )
  const isValid = useStore(form.store, (state) => {
    const v = state.values
    return (
      Boolean(v.name) &&
      Boolean(v.company) &&
      Boolean(v.employeeId) &&
      Boolean(v.telephone) &&
      Boolean(v.email) &&
      Boolean(v.agreement) &&
      Boolean(v.image)
    )
  })

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
        if (res.ok) {
          setAlert({ eventType: "success", message: "送信に成功しました" })
          setIsBlocked(false)
          router.push("/register/success")
        } else {
          setAlert({ eventType: "error", message: res.statusText })
        }
      })
      .catch((error) => {
        dialogRef.current?.close()
        setAlert({ eventType: "error", message: error })
      })
    return formData
  }

  useEffect(() => {
    function beforeUnloadhandler(e: BeforeUnloadEvent): void {
      if (isBlocked) {
        e.preventDefault()
      } else {
        setIsBlocked(false)
      }
    }

    window.addEventListener("beforeunload", beforeUnloadhandler)
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadhandler)
    }
  }, [isBlocked, setIsBlocked])

  return (
    <>
      <Stepper targetStep={0} />
      <form
        action={formAction}
        onChange={() => setIsBlocked(true)}
        className="flex flex-col gap-6 max-w-xs"
      >
        <p className="text-center before:ml-0.5 before:text-red-500 before:content-['*']">
          は必須項目
        </p>
        <Input item={NAME} form={form} />
        <form.Field name="company">
          {(field) => (
            <label className="form-control w-full">
              <div className="label">
                <p className="label-text after:ml-0.5 after:text-red-500 after:content-['*']">
                  {COMPANY.label}
                </p>
              </div>
              <select
                className="select select-bordered"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
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
          )}
        </form.Field>
        <Input item={EMPLOYEE_ID} form={form} />
        <Input item={TELEPHONE} form={form} />
        <Input item={EMAIL} form={form} />
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body overflow-y-auto max-h-72">
            <p className="mb-2 after:ml-0.5 after:text-red-500 after:content-['*']">
              {AGREEMENT.label}
            </p>
            <p className="text-sm">
              お預かりした個人情報は、
              <br />
              株式会社オープンアップグループ
              <br />
              （以下「当社」）が
              <br />
              業務に利用するほか、
              <br />
              当社のグループ企業において、
              <br />
              以下の利用目的で共同利用します。
              <br />
              <br />
              共同利用についての公表事項及び
              <br />
              共同利用者の範囲に含まれる
              <br />
              グループ企業の一覧は、
              <br />
              以下の個人情報保護方針の
              <br />
              記載をご覧下さい。
              <br />
              <br />
              株式会社オープンアップグループは、
              <br />
              提供頂いた個人情報を法令及び
              <br />
              個人情報保護方針に従って
              <br />
              安全且つ適切に取り扱います。
              <br />
              <br />
              個人情報に関する問い合わせ・
              <br />
              請求方法等につきましては、
              <br />
              「個人情報について」をご覧下さい。
              <br />
              <br />
              上記の内容について同意頂ける方は、
              <br />
              以下の「同意する」にチェックを
              <br />
              お願い致します。
              <br />
            </p>
            <form.Field name="agreement">
              {(field) => (
                <label className="label cursor-pointer self-center">
                  <span className="label-text mr-2">
                    {AGREEMENT.placeholder}
                  </span>
                  <input
                    type="checkbox"
                    className="checkbox"
                    name={field.name}
                    checked={field.state.value as boolean}
                    onChange={(e) =>
                      field.handleChange(e.target.checked as never)
                    }
                    onBlur={field.handleBlur}
                    value={AGREEMENT.placeholder}
                    required={true}
                  />
                </label>
              )}
            </form.Field>
          </div>
        </div>
        <p className="after:ml-0.5 after:text-red-500 after:content-['*']">
          {IMAGE.label}
        </p>
        <ImageUploader form={form} onPreviewChange={setImagePreviewUrl} />
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
        <ConfirmDialog
          isPending={isPending}
          ref={dialogRef}
          form={form}
          imagePreviewUrl={imagePreviewUrl}
        />
      </form>
    </>
  )
}

function Input({
  item,
  form,
}: Readonly<{
  item: ProfileFormItem
  form: RegisterFormApi
}>): JSX.Element {
  return (
    <form.Field name={item.name}>
      {(field) => (
        <label className="input input-bordered flex flex-row items-center gap-2">
          <span className="flex flex-row items-center text-sm whitespace-nowrap after:ml-0.5 after:text-red-500 after:content-['*']">
            <item.icon className="mr-2 size-4 opacity-70" />
            {item.label}
          </span>
          <input
            type={item.type}
            name={field.name}
            value={field.state.value as string}
            onChange={(e) => field.handleChange(e.target.value as never)}
            onBlur={field.handleBlur}
            placeholder={item.placeholder}
            required={true}
          />
        </label>
      )}
    </form.Field>
  )
}

function ConfirmDialog({
  isPending,
  ref,
  form,
  imagePreviewUrl,
}: Readonly<{
  isPending: boolean
  ref: RefObject<HTMLDialogElement | null>
  form: RegisterFormApi
  imagePreviewUrl: string
}>): JSX.Element {
  const formItems: ProfileFormItem[] = [
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
          className="absolute btn btn-circle btn-ghost btn-sm right-2 top-2"
        >
          <XMarkIcon />
        </button>
        <Stepper targetStep={1} />
        <table className="table">
          <tbody>
            {formItems.map((item) => (
              <tr key={item.name} className="grid grid-cols-2">
                <th>{item.label}</th>
                <td className="text-center">
                  {item.name === "image" && form.state.values[item.name] ? (
                    <Image
                      src={imagePreviewUrl}
                      width={100}
                      height={100}
                      alt="Uploaded File"
                      className="w-full"
                    />
                  ) : item.name === "agreement" ? (
                    form.state.values[item.name] ? (
                      AGREEMENT.placeholder
                    ) : (
                      ""
                    )
                  ) : (
                    (form.state.values[item.name] as string)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="gap-4 justify-center modal-action">
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
            className="btn btn-error"
            onClick={() => ref.current?.close()}
          >
            <ArrowUturnLeftIcon className="size-6" />
            戻る
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={() => ref.current?.close()}
        className="modal-backdrop"
      />
    </dialog>
  )
}
