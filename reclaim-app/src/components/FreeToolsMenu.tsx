import Link from 'next/link'

export default function FreeToolsMenu({ currentTool }: { currentTool?: string }) {
  const tools = [
    { href: '/free-narcissist-test', label: 'ðŸ” Free Narcissist Test', id: 'narcissist-test' },
    { href: '/gaslighting-reality-check', label: 'ðŸ‘ï¸ Gaslighting Reality Check', id: 'gaslighting' },
    { href: '/discard-stage-test', label: 'ðŸ’” Discard Stage Test', id: 'discard' },
    { href: '/relationship-health-check', label: 'â¤ï¸ Relationship Health Check', id: 'relationship-health' },
  ]

  return (
    <div className="relative group">
      <button className="text-gray-700 hover:text-indigo-600 font-medium flex items-center gap-1">
        Try Our Other Free Tools
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-2">
          {tools.map(tool => (
            <Link
              key={tool.id}
              href={tool.href}
              className={`block px-3 py-2 text-sm rounded ${
                currentTool === tool.id
                  ? 'bg-indigo-50 text-indigo-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tool.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
