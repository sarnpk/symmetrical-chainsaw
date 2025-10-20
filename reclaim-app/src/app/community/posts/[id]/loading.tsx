export default function LoadingPostDetail() {
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />

      <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
            <div className="h-3 w-32 rounded bg-gray-100 animate-pulse" />
          </div>
          <div className="h-6 w-24 rounded-full bg-gray-100 animate-pulse" />
        </div>
        <div className="h-6 w-3/4 rounded bg-gray-200 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
          <div className="h-4 w-[92%] rounded bg-gray-100 animate-pulse" />
          <div className="h-4 w-[86%] rounded bg-gray-100 animate-pulse" />
        </div>
      </article>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
        <div className="mt-4 space-y-3">
          <div className="h-24 w-full rounded-lg bg-gray-50 border border-gray-100 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
            <div className="h-4 w-[88%] rounded bg-gray-100 animate-pulse" />
            <div className="h-4 w-[72%] rounded bg-gray-100 animate-pulse" />
          </div>
        </div>
      </section>
    </div>
  )
}
