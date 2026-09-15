export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      <div className="flex gap-4 mt-6">
        <div className="h-40 flex-1 bg-gray-200 rounded-xl"></div>
        <div className="h-40 flex-1 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  )
}
