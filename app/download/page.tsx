// https://sailboatui.com/docs/components/table/
'use client'

import { useFormData } from '@/components/useFormData'

// デバッグ用
// localstrageをクリア
// const clearLocalstrage = () => {
//   localStorage.clear()
//   console.log('localStorageをクリアしました')
// }

export default function Download() {
  // const localFormData = JSON.parse(localStorage.getItem('FormData') || '{}')
  const { formdata, loading } = useFormData()
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>読み込み中・・・</h1>
      </main>
    )
  }
  // if (formdata === undefined) {
  //   return (
  //     <main className="flex min-h-screen flex-col items-center justify-between p-24">
  //       <h1>FormDataはありません</h1>
  //     </main>
  //   )
  // }

  return (
    <main className="flex min-h-screen flex-col p-24">
      <p>Loading...</p>
      {/* // <JsonView /> */}
    </main>
  )
}
