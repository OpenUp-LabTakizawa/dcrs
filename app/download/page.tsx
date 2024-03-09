'use client'
// https://sailboatui.com/docs/components/table/
import Link from 'next/link'

// デバッグ用
// localstrageをクリア
// const clearLocalstrage = () => {
//   localStorage.clear()
//   console.log('localStorageをクリアしました')
// }

export default function Download() {
  if (typeof window !== 'undefined') {
    const profile = JSON.parse(localStorage.getItem('profile') || '{}')

    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <table className="w-full border-collapse bg-white text-left text-gray-500 text-sm">
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
          <tbody className="divide-y divide-gray-100 border-gray-100 border-t">
            <tr className="hover:bg-gray-50">
              <th className="px-6 py-4">
                <div className="flex h-5 items-center">
                  <input
                    type="checkbox"
                    name="checkGroup1"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 shadow-sm disabled:cursor-not-allowed focus:border-primary-300 disabled:text-gray-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0"
                  />
                </div>
              </th>
              {/* localprofileなし */}
              {profile === undefined ? (
                <td className="px-6 py-4 font-medium text-gray-900">
                  localprofileなし
                </td>
              ) : (
                // localprofileあり
                <th className="px-6 py-4 font-medium text-gray-900">
                  {profile.name}
                </th>
              )}
              {/* localprofileなし */}
              {profile === undefined ? (
                <td className="px-6 py-4 font-medium text-gray-900">
                  localprofileなし
                </td>
              ) : (
                // localprofileあり
                <td className="px-6 py-4">{profile.company}</td>
              )}
              {/* localprofileなし */}
              {profile === undefined ? (
                <td className="px-6 py-4">localprofileなし</td>
              ) : (
                // localprofileあり
                <td className="px-6 py-4">{profile.employeeId}</td>
              )}
              {/* localprofileなし */}
              {profile === undefined ? (
                <td className="px-6 py-4">localprofileなし</td>
              ) : (
                // localprofileあり
                <td className="px-6 py-4">{profile.phoneNumber}</td>
              )}
              {/* localprofileなし */}
              {profile === undefined ? (
                <td className="px-6 py-4">localprofileなし</td>
              ) : (
                // localprofileあり
                <td className="px-6 py-4">{profile.mail}</td>
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
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 shadow-sm disabled:cursor-not-allowed focus:border-primary-300 disabled:text-gray-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0"
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
          className="group relative flex w-1/8 justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          ホームに戻る
        </Link>
      </main>
    )
  }
}
