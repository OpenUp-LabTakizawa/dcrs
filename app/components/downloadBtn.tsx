'use client'

import { FolderArrowDownIcon } from '@heroicons/react/24/solid'

export function DownloadBtn() {
  function download() {
    const image = document.getElementsByTagName('img')?.[0]
    const link = document.createElement('a')
    link.href = image.src
    link.download = image.id
    link.click()
  }

  return (
    <button
      type="button"
      onClick={download}
      className="btn btn-secondary justify-self-end"
    >
      <FolderArrowDownIcon className="size-6" />
      ダウンロード
    </button>
  )
}
