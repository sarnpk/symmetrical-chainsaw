import Link from 'next/link'
import { UserPlus } from 'lucide-react'

interface AuthButtonProps {
  variant?: 'primary' | 'secondary'
}

export default function AuthButton({ variant = 'secondary' }: AuthButtonProps) {
  const primaryClasses = "bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg"
  const secondaryClasses = "text-gray-700 hover:text-indigo-600 font-medium flex items-center gap-2 transition-colors"

  return (
    <Link
      href="/auth"
      className={variant === 'primary' ? primaryClasses : secondaryClasses}
    >
      <UserPlus className="h-4 w-4" />
      Get Started
    </Link>
  )
}