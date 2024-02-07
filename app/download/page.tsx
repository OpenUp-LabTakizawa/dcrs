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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="hoge">
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                name
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                company
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                employeeId
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                download
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                なんか入れられる
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            <tr className="hover:bg-gray-50">
              localFormDataなし
              {formdata === undefined ? (
                <th className="px-6 py-4 font-medium text-gray-900">
                  localFormDataなし
                </th>
              ) : (
                // localFormDataあり
                <th className="px-6 py-4 font-medium text-gray-900">
                  {formdata.name}
                </th>
              )}
              {/* localFormDataなし */}
              {formdata === undefined ? (
                <td className="px-6 py-4 font-medium text-gray-900">
                  localFormDataなし
                </td>
              ) : (
                // localFormDataあり
                <td className="px-6 py-4">{formdata.company}</td>
              )}
              {/* localFormDataなし */}
              {formdata === undefined ? (
                <td className="px-6 py-4">localFormDataなし</td>
              ) : (
                // localFormDataあり
                <td className="px-6 py-4">{formdata.employeeId}</td>
              )}
              <td className="px-6 py-4">
                <div className="flex h-5 items-center">
                  <input
                    type="checkbox"
                    id="example12"
                    name="checkGroup1"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400"
                  />
                </div>
              </td>
              <td className="flex justify-end gap-4 px-6 py-4 font-medium">
                <button type="button" className="text-primary-700">
                  clearLocalstrage
                </button>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <th className="px-6 py-4 font-medium text-gray-900">
                Helen Howard
              </th>
              <td className="px-6 py-4">Nov.4 2022</td>
              <td className="px-6 py-4">helen@sailboatui.com</td>
              <td className="flex justify-end gap-4 px-6 py-4 font-medium">
                <a href="hoge">Delete</a>
                <a href="hoge" className="text-primary-700">
                  Edit
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  )
}
