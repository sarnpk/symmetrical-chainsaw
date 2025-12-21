import Link from 'next/link'

interface SignInButtonProps {
  variant?: 'primary' | 'secondary'
}

export default function SignInButton({ variant = 'secondary' }: SignInButtonProps) {
  if (variant === 'primary') {
    return (
      <Link 
        href="/auth" 
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-block"
      >
        Sign In
      </Link>
    )
  }

  return (
    <Link 
      href="/auth" 
      className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
    >
      Sign In
    </Link>
  )
}
