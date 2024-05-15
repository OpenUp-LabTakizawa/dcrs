import { Stepper } from '@/app/components/stepper'
import type { FormItem } from '@/app/interfaces/formItem'
import {
  ArrowUturnLeftIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/solid'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { useEffect, useRef } from 'react'
import { STEPS } from '../page'

export function ConfirmDialog({
  checkList,
}: {
  checkList: FormItem[]
}): React.JSX.Element {
  const router = useRouter()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal()
    }
  })

  async function onSubmit(
    event: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> {
    event.currentTarget.disabled = true
    event.currentTarget.innerHTML =
      '<span class="loading loading-ring loading-lg"></span>送信中...'

    const formElement = document.querySelector('form') as HTMLFormElement
    const formData: FormData = new FormData(formElement)

    fetch('/api/users', {
      method: 'POST',
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          alert(res.statusText)
          return
        }
        router.push('/register/success')
      })
      .catch((error) => {
        alert(error)
      })
  }

  return (
    <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
      <div className="grid gap-4 modal-box text-center">
        <Stepper steps={[...STEPS]} targetStep={1} />
        <table className="table">
          <tbody>
            {checkList.map(({ name, value }) => (
              <tr key={name}>
                <th>{value}</th>
                <td>
                  {name === 'agreement' && '同意する'}
                  {name === 'image' ? (
                    <Image
                      src={document.getElementsByTagName('img')[0].src}
                      width={100}
                      height={100}
                      alt="Uploaded File"
                      className="w-full"
                    />
                  ) : (
                    'あり'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="modal-action justify-center gap-4">
          <button type="submit" className="btn btn-info" onClick={onSubmit}>
            <PaperAirplaneIcon className="size-6" />
            送信
          </button>
          <button
            type="button"
            className="btn btn-error"
            onClick={() => dialogRef.current?.close()}
          >
            <ArrowUturnLeftIcon className="size-6" />
            戻る
          </button>
        </div>
      </div>
      <div className="modal-backdrop">
        <button type="button" onClick={() => dialogRef.current?.close()} />
      </div>
    </dialog>
  )
}
