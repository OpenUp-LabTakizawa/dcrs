import { Step } from '@/app/components/step'
import type { Checklist } from '@/app/interfaces/checklist'
import type { Profile } from '@/app/interfaces/profile'
import {
  ArrowUturnLeftIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/solid'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type React from 'react'
import type { Path } from 'react-hook-form'
import { STEPS } from '../page'

export function ConfirmDialog({
  checkList,
  dialog,
  image,
  values,
}: {
  checkList: Checklist[]
  dialog: React.RefObject<HTMLDialogElement>
  image: HTMLImageElement
  values: Profile
}): React.JSX.Element {
  const router = useRouter()

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
    <dialog ref={dialog} className="modal modal-bottom sm:modal-middle">
      <div className="grid gap-4 modal-box text-center">
        <Step steps={[...STEPS]} targetStep={1} />
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
                    (values[name as Path<Profile>] as string)
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
