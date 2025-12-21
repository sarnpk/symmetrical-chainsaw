import Link from 'next/link'

export default function UnifiedFooter() {
  return (
    <footer className="border-t bg-white py-8 px-4">
      <div className="container mx-auto text-center text-gray-600 text-sm">
        <p className="mb-4">&copy; 2025 Reclaim. Educational purposes only. Not a substitute for professional advice.</p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <Link href="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link>
          <Link href="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link>
          <Link href="/faq" className="hover:text-indigo-600 transition-colors">FAQ</Link>
          <Link href="/donate" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors">💜 Donate</Link>
          <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms</Link>
          <Link href="/cookies" className="hover:text-indigo-600 transition-colors">Cookies</Link>
          <Link href="mailto:support@reclaim.app" className="hover:text-indigo-600 transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  )
}
