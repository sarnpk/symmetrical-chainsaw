import Link from 'next/link'

export default function DonationAsk() {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
      <div className="flex items-start gap-3">
        <div className="text-3xl">💜</div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Did this tool help you?</h3>
          <p className="text-sm text-gray-700 mb-3">
            This free AI analysis costs us money to run. If it helped you gain clarity, consider donating to keep it free for others.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/donate" className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 text-sm">
              💜 Donate $5
            </Link>
            <Link href="/donate" className="px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 text-sm">
              Learn More
            </Link>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Your donation helps 10,000+ survivors access free tools like this.
          </p>
        </div>
      </div>
    </div>
  )
}
