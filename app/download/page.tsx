// https://sailboatui.com/docs/components/table/
'use client'

export default function Download() {
  const localFormData = JSON.parse(localStorage.getItem('FormData') || '{}')
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
                {}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            <tr className="hover:bg-gray-50">
              <th className="px-6 py-4 font-medium text-gray-900">
                {localFormData.agreement}
              </th>
              <td className="px-6 py-4">{localFormData.company}</td>
              <td className="px-6 py-4">{localFormData.employeeId}</td>
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

              {/* <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                  <svg
                    role="img"
                    aria-label="title"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-3 w-3"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Paid
                </span>
              </td> */}
              <td className="flex justify-end gap-4 px-6 py-4 font-medium">
                <a href="hoge">Delete</a>
                <a href="hoge" className="text-primary-700">
                  Edit
                </a>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <th className="px-6 py-4 font-medium text-gray-900">
                Helen Howard
              </th>
              <td className="px-6 py-4">Nov.4 2022</td>
              <td className="px-6 py-4">helen@sailboatui.com</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                  <svg
                    role="img"
                    aria-label="title"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-3 w-3"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Paid
                </span>
              </td>
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
