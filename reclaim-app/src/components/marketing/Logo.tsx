interface LogoProps {
  className?: string
}

export default function Logo({ className = 'h-9 w-9' }: LogoProps) {
  return (
    <span className={`inline-block ${className}`} aria-hidden="true">
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="reclaim-mark" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4f46e5" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="12" fill="url(#reclaim-mark)" />
        <path d="M10 27a10 10 0 0 1 20 0" stroke="#ffffff" strokeWidth="2.75" strokeLinecap="round" />
        <path d="M14.5 27a5.5 5.5 0 0 1 11 0" stroke="#c7d2fe" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="15.5" r="3" fill="#ffffff" />
      </svg>
    </span>
  )
}