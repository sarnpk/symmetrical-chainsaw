'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, Eye, ArrowRight, Search, Filter, Youtube, Instagram, Twitter, Facebook, Music } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image?: string
  category: {
    name: string
    slug: string
    color: string
  }
  author_name: string
  reading_time: number
  view_count: number
  published_at: string
  tags: { name: string; slug: string }[]
}

interface BlogCategory {
  id: string
  name: string
  slug: string
  color: string
}

interface SocialLink {
  platform: string
  url: string
  icon: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        // Fetch posts, categories, and social links
        const [postsRes, categoriesRes, socialRes] = await Promise.all([
          fetch('/api/blog/posts'),
          fetch('/api/blog/categories'),
          fetch('/api/blog/social-links')
        ])

        const [postsData, categoriesData, socialData] = await Promise.all([
          postsRes.json(),
          categoriesRes.json(),
          socialRes.json()
        ])

        if (postsData.posts) setPosts(postsData.posts)
        if (categoriesData.categories) setCategories(categoriesData.categories)
        if (socialData.links) setSocialLinks(socialData.links)
      } catch (error) {
        console.error('Failed to fetch blog data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogData()
  }, [])

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category.slug === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredPost = posts.find(post => post.id === posts[0]?.id)

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'youtube': return Youtube
      case 'instagram': return Instagram
      case 'twitter': return Twitter
      case 'facebook': return Facebook
      case 'music': return Music
      default: return ArrowRight
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-xl font-bold text-gray-900">Reclaim</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-indigo-600 hover:underline">Pricing</Link>
            <Link href="/auth" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Recovery Stories & Resources</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Evidence-based insights, survivor stories, and practical tools for your healing journey.
            </p>
            
            {/* Social Media Links */}
            <div className="flex justify-center gap-4 mb-8">
              {socialLinks.map((link) => {
                const IconComponent = getSocialIcon(link.icon)
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="text-sm font-medium">{link.platform}</span>
                  </a>
                )
              })}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-indigo-300'
                }`}
              >
                All Posts
              </button>
              {categories.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.slug
                      ? 'text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-indigo-300'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.slug ? category.color : undefined
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <div className="mb-16">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Article</h2>
                  <Card className="overflow-hidden border-0 shadow-lg">
                    <div className="md:flex">
                      {featuredPost.featured_image && (
                        <div className="md:w-1/2">
                          <img
                            src={featuredPost.featured_image}
                            alt={featuredPost.title}
                            className="w-full h-64 md:h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="md:w-1/2 p-8">
                        <div className="flex items-center gap-2 mb-4">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: featuredPost.category.color }}
                          >
                            {featuredPost.category.name}
                          </span>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {featuredPost.reading_time} min read
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {featuredPost.view_count} views
                            </div>
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{featuredPost.title}</h3>
                        <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-indigo-600">
                                {featuredPost.author_name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{featuredPost.author_name}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(featuredPost.published_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Link
                            href={`/blog/${featuredPost.slug}`}
                            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                          >
                            Read More <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Blog Posts Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.slice(1).map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {post.featured_image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: post.category.color }}
                        >
                          {post.category.name}
                        </span>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.reading_time}m
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.view_count}
                          </div>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-indigo-600">
                              {post.author_name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-900">{post.author_name}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(post.published_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                          Read →
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No articles found matching your criteria.</p>
                </div>
              )}
            </>
          )}

          {/* Newsletter Signup */}
          <div className="mt-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Stay Updated on Your Recovery Journey</h3>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
              Get weekly insights, recovery tips, and inspiring stories delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
              />
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}