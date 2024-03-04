'use client'

export default function Upload() {
  const localFormData = JSON.parse(localStorage.getItem('FormData') || '{}')

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <h2 className={'mb-3 text-2xl font-semibold'}>
        <div>↓入力項目を確認して下さい</div>
      </h2>
      <div className="mb-5">
        <p>1.お名前：{localFormData.name}</p>
        <p>2.所属会社：{localFormData.company}</p>
        <p>3.社員番号：{localFormData.employeeId}</p>
        <p>4.連絡可能な個人電話番号：{localFormData.phone}</p>
        <p>5.メールアドレス：{localFormData.mail}</p>
        <p>
          6.個人情報提供への同意：
          {String(localFormData.agreement) === 'true'
            ? '既に同意済み'
            : '未だ同意していない'}{' '}
        </p>
      </div>
      <div className="mt-8 space-y-6">
        <a
          href="/"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          [入力事項]を送信する。
        </a>
      </div>
      <div className="mt-8 space-y-6">
        <a
          href="/upload"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          [入力事項]を修正する。
        </a>
      </div>
    </main>
  )
}
