import Link from 'next/link'
import { RotateCcw, Target, RefreshCw, Shield, Heart } from 'lucide-react'

export default function HealingContent() {
  const tools = [
    {
      name: 'Mind Reset',
      href: '/mind-reset',
      description: 'Quick exercises to calm, ground, and reset your nervous system.',
      icon: RotateCcw,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      name: 'Boundary Builder',
      href: '/boundary-builder',
      description: 'Craft clear boundaries and practice healthy communication.',
      icon: Target,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      name: 'Grey Rock',
      href: '/grey-rock',
      description: 'Learn and apply the grey rock technique to reduce conflict.',
      icon: RefreshCw,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      name: 'Safety Plan',
      href: '/safety-plan',
      description: 'Prepare an actionable plan for moments when safety is a concern.',
      icon: Shield,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center">
        <Heart className="h-8 w-8 text-indigo-600" />
        <h1 className="ml-3 text-3xl font-bold text-gray-900">Healing</h1>
      </div>
      <p className="text-gray-600">
        A focused space for your recovery tools. Explore practices and plans that help you
        stabilize, heal, and move forward.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.name}
            href={tool.href}
            className="group rounded-2xl border border-gray-200 bg-white p-5 hover:border-gray-300 hover:shadow-sm transition"
          >
            <div className={`inline-flex items-center justify-center h-10 w-10 rounded-lg ${tool.bg} ${tool.color}`}>
              <tool.icon className="h-5 w-5" />
            </div>
            <h2 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-gray-800">
              {tool.name}
            </h2>
            <p className="mt-1 text-sm text-gray-600">{tool.description}</p>
            <div className="mt-4 text-sm font-medium text-indigo-600">
              Open
              <span aria-hidden className="ml-1">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
