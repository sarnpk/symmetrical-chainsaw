import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://reclaimyourlife.app'
  const routes: { path: string; priority: number; weekly?: boolean }[] = [
    { path: '', priority: 1 },
    { path: '/free-assessment', priority: 0.9 },
    { path: '/relationship-health-check', priority: 0.9 },
    { path: '/free-narcissist-test', priority: 0.9 },
    { path: '/discard-stage-test', priority: 0.9 },
    { path: '/gaslighting-reality-check', priority: 0.9 },
    { path: '/crisis-reframe', priority: 0.8 },
    { path: '/narcissist-detector', priority: 0.8 },
    { path: '/narcissist-simulator', priority: 0.8 },
    { path: '/pricing', priority: 0.8 },
    { path: '/faq', priority: 0.7 },
    { path: '/learn-more', priority: 0.6 },
    { path: '/donate', priority: 0.6 },
    { path: '/blog', priority: 0.6, weekly: true },
    { path: '/privacy', priority: 0.4 },
    { path: '/terms', priority: 0.4 },
  ]

  return routes.map(({ path, priority, weekly }) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: weekly ? 'weekly' : 'monthly',
    priority,
  }))
}