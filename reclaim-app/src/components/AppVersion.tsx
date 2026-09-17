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
    <div className="text-[11px] text-gray-400 select-none px-3 py-1">
      v{versionLabel}
    </div>
  )
}
