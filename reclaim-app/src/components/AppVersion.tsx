import versionInfo from "../version.json"

export default function AppVersion() {
  // Prefer semantic version from version.json, fallback to env/CI commit
  const semver = versionInfo && typeof versionInfo === 'object'
    ? `${versionInfo.major}.${versionInfo.minor}.${versionInfo.patch}+${versionInfo.build}`
    : ''

  const explicit = process.env.NEXT_PUBLIC_APP_VERSION
  const vercel = process.env.VERCEL_GIT_COMMIT_SHA
  const netlify = process.env.COMMIT_REF || process.env.NETLIFY_COMMIT_REF
  const sha = (explicit || vercel || netlify || '').toString()
  const short = sha ? sha.substring(0, 7) : 'dev'

  const versionLabel = semver || short

  // Build time: prefer version.json timestamp, then envs, else now
  const tJson = (versionInfo as any)?.timestamp as string | undefined
  const tExplicit = process.env.NEXT_PUBLIC_BUILD_TIME
  const tVercel = process.env.VERCEL_GIT_COMMIT_TIMESTAMP
  const tNetlify = process.env.DEPLOY_ID || process.env.DEPLOY_TIMESTAMP
  const iso = (tJson || tExplicit || tVercel || tNetlify || new Date().toISOString()).toString()
  const displayTime = iso.replace('T', ' ').replace('Z', '')

  return (
    <footer className="w-full py-4 text-center text-xs text-gray-500 select-none">
      <span className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2.5 py-1">
        <span>Reclaim</span>
        <span className="text-gray-300">•</span>
        <span>version</span>
        <code className="font-mono">{versionLabel}</code>
        <span className="text-gray-300">•</span>
        <span>{displayTime}</span>
      </span>
    </footer>
  )
}
