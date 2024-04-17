import { Step } from '@/app/components/step'
import type { Checklist } from '@/app/interfaces/checklist'
import {
  ArrowUturnLeftIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/solid'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { STEP } from '../page'

export function ConfirmDialog({
  checkList,
  dialog,
  image,
}: {
  checkList: Checklist[]
  dialog: React.RefObject<HTMLDialogElement>
  image: HTMLImageElement
}) {
  const router = useRouter()

  async function onSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    event.currentTarget.disabled = true
    event.currentTarget.innerHTML =
      '<span class="loading loading-ring loading-lg"></span>送信中...'

    const formElement = document.querySelector('form')
    const formData = new FormData(formElement as HTMLFormElement)

    fetch('/api/user', {
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
        event.currentTarget.disabled = false
      })
  }

  return (
    <dialog ref={dialog} className="modal modal-bottom sm:modal-middle">
      <div className="grid gap-4 modal-box text-center">
        <Step step={STEP} targetStep={1} />
        <table className="table">
          <tbody>
            {checkList.map(({ name, value }) => (
              <tr key={name}>
                <th>{value}</th>
                <td>
                  {name === 'agreement' && '同意する'}
                  {name === 'image' && image ? (
                    <Image
                      src={image.src}
                      width={100}
                      height={100}
                      alt="Uploaded File"
                      className="w-full"
                    />
                  ) : (
                    ''
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
            onClick={() => dialog.current?.close()}
          >
            <ArrowUturnLeftIcon className="size-6" />
            戻る
          </button>
        </div>
      </div>
      <div className="modal-backdrop">
        <button type="button" onClick={() => dialog.current?.close()} />
      </div>
    </dialog>
  )
}
