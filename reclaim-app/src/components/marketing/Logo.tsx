interface LogoProps {
  className?: string
}

export default function Logo({ className = 'h-9 w-9' }: LogoProps) {
  return (
    <span className={`inline-block ${className}`} aria-label="Reclaim">
      <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logo-bg" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#7c3aed" />
            <stop offset="1" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="112" fill="url(#logo-bg)" />
        <path d="M140 360 C140 360 140 230 256 160 C372 230 372 360 372 360" stroke="white" strokeWidth="52" strokeLinecap="round" />
        <circle cx="256" cy="360" r="24" fill="white" />
      </svg>
    </span>
  )
}
