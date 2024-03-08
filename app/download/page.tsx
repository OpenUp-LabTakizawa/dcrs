// https://sailboatui.com/docs/components/table/
'use client'

import { useFormData } from '@/components/useFormData'
import Link from 'next/link'

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
      <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900" />
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
              phone number
            </th>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              mail
            </th>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              operation
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
          <tr className="hover:bg-gray-50">
            <th className="px-6 py-4">
              <div className="flex h-5 items-center">
                <input
                  type="checkbox"
                  name="checkGroup1"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400"
                />
              </div>
            </th>
            {/* localFormDataなし */}
            {formdata === undefined ? (
              <td className="px-6 py-4 font-medium text-gray-900">
                localFormDataなし
              </td>
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
            {/* localFormDataなし */}
            {formdata === undefined ? (
              <td className="px-6 py-4">localFormDataなし</td>
            ) : (
              // localFormDataあり
              <td className="px-6 py-4">{formdata.phone}</td>
            )}
            {/* localFormDataなし */}
            {formdata === undefined ? (
              <td className="px-6 py-4">localFormDataなし</td>
            ) : (
              // localFormDataあり
              <td className="px-6 py-4">{formdata.mail}</td>
            )}

            <td className="flex justify-end gap-4 px-6 py-4 font-medium">
              <button type="button" className="text-primary-700">
                clearLocalstrage
              </button>
            </td>
          </tr>
          <tr className="hover:bg-gray-50">
            <th className="px-6 py-4">
              <div className="flex h-5 items-center">
                <input
                  type="checkbox"
                  id="example12"
                  name="checkGroup1"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400"
                />
              </div>
            </th>
            <td className="px-6 py-4 font-medium text-gray-900">
              Helen Howard
            </td>
            <td className="px-6 py-4">samplecompany</td>
            <td className="px-6 py-4">999999</td>
            <td className="px-6 py-4">999-999-888</td>
            <td className="px-6 py-4">samplemail@samplemail.com</td>
            <td className="flex justify-end gap-4 px-6 py-4 font-medium">
              <button type="button">Delete</button>
              <button type="button">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
      <Link
        href="/"
        className="group relative w-1/8 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        ホームに戻る
      </Link>
    </main>
  )
}
