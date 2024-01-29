export default function Upload() {
  return (
    <main className="flex min-h-screen flex-col p-24">
      <h2 className={'mb-3 text-2xl font-semibold'}>
        <div>入力事項を確認して下さい</div>
        <div>お名前：</div>
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          -&gt;
        </span>
      </h2>
    </main>
  )
}
