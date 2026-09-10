'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Trash2, Save, X, Users, BarChart3, MessageSquare, Ban, Shield, Search, Filter, CreditCard, DollarSign, LogOut, Home, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface SubscriptionPlan {
  id: string
  plan_name: string
  plan_tier: string
  display_name: string
  description: string
  price_monthly: number
  price_yearly: number
  is_active: boolean
  sort_order: number
}

interface FeatureLimit {
  id: string
  subscription_tier: string
  feature_name: string
  limit_type: string
  limit_value: number
}

interface User {
  id: string
  email: string
  display_name: string | null
  subscription_tier: string
  created_at: string
  updated_at: string
  is_active: boolean
  timezone: string | null
}

interface UserFeedback {
  id: string
  user_id: string
  feature: string
  rating: number
  feedback: string
  suggestion: string
  created_at: string
  user_email?: string
}

interface Stats {
  total_users: number
  active_users: number
  foundation_users: number
  recovery_users: number
  empowerment_users: number
  total_feedback: number
  avg_rating: number
}

interface Payment {
  id: string
  user_id: string
  user_email: string
  amount: number
  currency: string
  status: string
  subscription_tier: string
  stripe_payment_id: string
  created_at: string
}

export default function AdminDashboard() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [features, setFeatures] = useState<FeatureLimit[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [feedback, setFeedback] = useState<UserFeedback[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [editingPlan, setEditingPlan] = useState<string | null>(null)
  const [editingFeature, setEditingFeature] = useState<string | null>(null)
  const [newPlan, setNewPlan] = useState<Partial<SubscriptionPlan>>({})
  const [newFeature, setNewFeature] = useState<Partial<FeatureLimit>>({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [userFilter, setUserFilter] = useState('')
  const [tierFilter, setTierFilter] = useState('')
  const [feedbackFilter, setFeedbackFilter] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [featureFilter, setFeatureFilter] = useState('')
  const [featureTierFilter, setFeatureTierFilter] = useState('')
  const [payments, setPayments] = useState<Payment[]>([])
  const [paymentFilter, setPaymentFilter] = useState('')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('')
  const [newCode, setNewCode] = useState({
    code: '',
    target_tier: 'recovery',
    trial_duration_days: 7,
    max_uses: 100,
    campaign_name: '',
    description: '',
    expires_at: ''
  })
  const [redeemCodes, setRedeemCodes] = useState<any[]>([])
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [editingPost, setEditingPost] = useState<any>(null)
  const [newPost, setNewPost] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category_id: '',
    status: 'draft',
    meta_title: '',
    meta_description: '',
    reading_time: 5
  })
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [socialLinks, setSocialLinks] = useState<any[]>([])
  const [editingSocial, setEditingSocial] = useState<any>(null)
  const [newSocial, setNewSocial] = useState({ platform: '', url: '', icon: 'link', sort_order: 0 })
  const [newsletters, setNewsletters] = useState<any[]>([])
  const [newsletterFilter, setNewsletterFilter] = useState('')

  const deleteRedeemCode = async (codeId: string, codeName: string) => {
    if (!confirm(`Delete code ${codeName}? This action cannot be undone.`)) return
    
    try {
      const { error } = await supabase.from('redeem_codes').delete().eq('id', codeId)
      if (error) throw error
      toast.success('Code deleted successfully')
      loadRedeemCodes()
    } catch (error) {
      toast.error('Failed to delete code')
    }
  }

  const loadRedeemCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('redeem_codes')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setRedeemCodes(data || [])
    } catch (error) {
      console.error('Failed to load redeem codes:', error)
    }
  }

  const loadBlogData = async () => {
    try {
      const [postsRes, categoriesRes, tagsRes, socialRes] = await Promise.all([
        supabase.from('blog_posts').select('*, category:blog_categories(id, name, slug), tags:blog_post_tags(tag:blog_tags(id, name, slug))').order('created_at', { ascending: false }),
        supabase.from('blog_categories').select('*').order('sort_order'),
        supabase.from('blog_tags').select('*').order('name'),
        supabase.from('social_media_links').select('*').order('sort_order')
      ])

      if (postsRes.data) {
        const transformedPosts = postsRes.data.map(post => ({
          ...post,
          tags: post.tags?.map((t: any) => t.tag) || []
        }))
        setBlogPosts(transformedPosts)
      }
      if (categoriesRes.data) setCategories(categoriesRes.data)
      if (tagsRes.data) setTags(tagsRes.data)
      if (socialRes.data) setSocialLinks(socialRes.data)
    } catch (error) {
      console.error('Failed to load blog data:', error)
    }
  }

  const createBlogPost = async () => {
    try {
      const slug = newPost.slug || newPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const postData = {
        ...newPost,
        slug,
        published_at: newPost.status === 'published' ? new Date().toISOString() : null
      }

      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ post: postData, tagIds: selectedTags })
      })

      if (!res.ok) throw new Error('Failed to create post')
      
      toast.success('Blog post created')
      setNewPost({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category_id: '',
        status: 'draft',
        meta_title: '',
        meta_description: '',
        reading_time: 5
      })
      setSelectedTags([])
      loadBlogData()
    } catch (error) {
      toast.error('Failed to create blog post')
    }
  }

  const updateBlogPost = async (post: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/admin/blog', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ 
          id: post.id, 
          post: {
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            category_id: post.category_id,
            status: post.status,
            meta_title: post.meta_title,
            meta_description: post.meta_description,
            reading_time: post.reading_time,
            published_at: post.status === 'published' && !post.published_at ? new Date().toISOString() : post.published_at
          },
          tagIds: post.selectedTags
        })
      })

      if (!res.ok) throw new Error('Failed to update post')
      
      toast.success('Blog post updated')
      setEditingPost(null)
      loadBlogData()
    } catch (error) {
      toast.error('Failed to update blog post')
    }
  }

  const deleteBlogPost = async (id: string) => {
    if (!confirm('Delete this blog post?')) return
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`/api/admin/blog?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      })

      if (!res.ok) throw new Error('Failed to delete post')
      
      toast.success('Blog post deleted')
      loadBlogData()
    } catch (error) {
      toast.error('Failed to delete blog post')
    }
  }

  const createSocialLink = async () => {
    try {
      const { error } = await supabase.from('social_media_links').insert([newSocial])
      if (error) throw error
      toast.success('Social link created')
      setNewSocial({ platform: '', url: '', icon: 'link', sort_order: 0 })
      loadBlogData()
    } catch (error) {
      toast.error('Failed to create social link')
    }
  }

  const updateSocialLink = async (link: any) => {
    try {
      const { error } = await supabase.from('social_media_links').update(link).eq('id', link.id)
      if (error) throw error
      toast.success('Social link updated')
      setEditingSocial(null)
      loadBlogData()
    } catch (error) {
      toast.error('Failed to update social link')
    }
  }

  const deleteSocialLink = async (id: string) => {
    if (!confirm('Delete this social link?')) return
    try {
      const { error } = await supabase.from('social_media_links').delete().eq('id', id)
      if (error) throw error
      toast.success('Social link deleted')
      loadBlogData()
    } catch (error) {
      toast.error('Failed to delete social link')
    }
  }

  const loadNewsletters = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('subscribed_at', { ascending: false })
      
      if (error) throw error
      setNewsletters(data || [])
    } catch (error) {
      console.error('Failed to load newsletters:', error)
    }
  }

  const deleteNewsletter = async (id: string) => {
    if (!confirm('Delete this subscription?')) return
    try {
      const { error } = await supabase.from('newsletter_subscriptions').delete().eq('id', id)
      if (error) throw error
      toast.success('Subscription deleted')
      loadNewsletters()
    } catch (error) {
      toast.error('Failed to delete subscription')
    }
  }

  const createRedeemCode = async () => {
    try {
      const codeData = {
        ...newCode,
        code: newCode.code || `CODE${Date.now()}`,
        expires_at: newCode.expires_at ? new Date(newCode.expires_at).toISOString() : null
      }
      
      const { error } = await supabase.from('redeem_codes').insert([codeData])
      if (error) throw error
      
      toast.success('Code created successfully')
      setNewCode({ code: '', target_tier: 'recovery', trial_duration_days: 7, max_uses: 100, campaign_name: '', description: '', expires_at: '' })
      loadRedeemCodes()
    } catch (error) {
      toast.error('Failed to create code')
    }
  }
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadData()
    loadRedeemCodes()
    loadBlogData()
    loadNewsletters()
  }, [])

  const loadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const [plansRes, featuresRes, adminDataRes] = await Promise.all([
        supabase.from('subscription_plans').select('*').order('sort_order'),
        supabase.from('feature_limits').select('*').order('subscription_tier, feature_name'),
        fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        })
      ])

      if (plansRes.data) setPlans(plansRes.data)
      if (featuresRes.data) setFeatures(featuresRes.data)
      
      if (adminDataRes.ok) {
        const adminData = await adminDataRes.json()
        console.log('Admin data received:', adminData)
        setUsers(adminData.users || [])
        setFeedback(adminData.feedback || [])
        setPayments(adminData.payments || [])
        setStats(adminData.stats || null)
      } else {
        const errorText = await adminDataRes.text()
        console.error('Admin API error:', adminDataRes.status, errorText)
        toast.error(`Failed to load admin data: ${adminDataRes.status}`)
      }
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const savePlan = async (plan: SubscriptionPlan) => {
    try {
      const { error } = await supabase.from('subscription_plans').update(plan).eq('id', plan.id)
      if (error) throw error
      toast.success('Plan updated')
      setEditingPlan(null)
      loadData()
    } catch (error) {
      toast.error('Failed to update plan')
    }
  }

  const createPlan = async () => {
    try {
      const { error } = await supabase.from('subscription_plans').insert([newPlan])
      if (error) throw error
      toast.success('Plan created')
      setNewPlan({})
      loadData()
    } catch (error) {
      toast.error('Failed to create plan')
    }
  }

  const deletePlan = async (id: string) => {
    if (!confirm('Delete this plan?')) return
    try {
      const { error } = await supabase.from('subscription_plans').delete().eq('id', id)
      if (error) throw error
      toast.success('Plan deleted')
      loadData()
    } catch (error) {
      toast.error('Failed to delete plan')
    }
  }

  const saveFeature = async (feature: FeatureLimit) => {
    try {
      const { error } = await supabase.from('feature_limits').update(feature).eq('id', feature.id)
      if (error) throw error
      toast.success('Feature updated')
      setEditingFeature(null)
      loadData()
    } catch (error) {
      toast.error('Failed to update feature')
    }
  }

  const createFeature = async () => {
    try {
      const { error } = await supabase.from('feature_limits').insert([newFeature])
      if (error) throw error
      toast.success('Feature created')
      setNewFeature({})
      loadData()
    } catch (error) {
      toast.error('Failed to create feature')
    }
  }

  const deleteFeature = async (id: string) => {
    if (!confirm('Delete this feature limit?')) return
    try {
      const { error } = await supabase.from('feature_limits').delete().eq('id', id)
      if (error) throw error
      toast.success('Feature deleted')
      loadData()
    } catch (error) {
      toast.error('Failed to delete feature')
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from('profiles').update({ is_active: !currentStatus }).eq('id', userId)
      if (error) throw error
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`)
      loadData()
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  const updateUserTier = async (userId: string, newTier: string) => {
    try {
      const { error } = await supabase.from('profiles').update({ subscription_tier: newTier }).eq('id', userId)
      if (error) throw error
      toast.success('User tier updated')
      loadData()
    } catch (error) {
      toast.error('Failed to update user tier')
    }
  }

  const deleteFeedback = async (feedbackId: string) => {
    if (!confirm('Delete this feedback?')) return
    try {
      const { error } = await supabase.from('user_feedback').delete().eq('id', feedbackId)
      if (error) throw error
      toast.success('Feedback deleted')
      loadData()
    } catch (error) {
      toast.error('Failed to delete feedback')
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  const handleReturnHome = () => {
    router.push('/')
  }

  if (loading) {
    return <div className="p-8">Loading admin dashboard...</div>
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(userFilter.toLowerCase()) ||
                         (user.display_name || '').toLowerCase().includes(userFilter.toLowerCase())
    const matchesTier = !tierFilter || user.subscription_tier === tierFilter
    return matchesSearch && matchesTier
  })

  const filteredFeedback = feedback.filter(f => {
    const matchesFeature = !feedbackFilter || f.feature.toLowerCase().includes(feedbackFilter.toLowerCase())
    const matchesRating = !ratingFilter || f.rating.toString() === ratingFilter
    return matchesFeature && matchesRating
  })

  const filteredFeatures = features.filter(f => {
    const matchesName = !featureFilter || f.feature_name.toLowerCase().includes(featureFilter.toLowerCase())
    const matchesTier = !featureTierFilter || f.subscription_tier === featureTierFilter
    return matchesName && matchesTier
  })

  const filteredPayments = payments.filter(p => {
    const matchesUser = !paymentFilter || p.user_email.toLowerCase().includes(paymentFilter.toLowerCase())
    const matchesStatus = !paymentStatusFilter || p.status === paymentStatusFilter
    return matchesUser && matchesStatus
  })

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={handleReturnHome}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'users', name: 'Users', icon: Users },
            { id: 'payments', name: 'Payments', icon: CreditCard },
            { id: 'redeem-codes', name: 'Redeem Codes', icon: DollarSign },
            { id: 'blog', name: 'Blog', icon: FileText },
            { id: 'newsletter', name: 'Newsletter', icon: MessageSquare },
            { id: 'feedback', name: 'Feedback', icon: MessageSquare },
            { id: 'plans', name: 'Plans', icon: Shield },
            { id: 'features', name: 'Features', icon: Edit }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_users}</div>
              <p className="text-xs text-gray-500">{stats.active_users} active</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Revenue Estimate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(stats.recovery_users * 15 + stats.empowerment_users * 24.99).toFixed(0)}
              </div>
              <p className="text-xs text-gray-500">Monthly recurring</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_feedback}</div>
              <p className="text-xs text-gray-500">Avg rating: {stats.avg_rating}/5</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Total Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payments.length}</div>
              <p className="text-xs text-gray-500">
                ${payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)} total
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="border rounded px-3 py-2 text-sm"
                />
              </div>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
              >
                <option value="">All Tiers</option>
                <option value="foundation">Foundation</option>
                <option value="recovery">Recovery</option>
                <option value="empowerment">Empowerment</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No users found</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Tier</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{user.email}</td>
                        <td className="p-2">{user.display_name || 'N/A'}</td>
                        <td className="p-2">
                          <select
                            value={user.subscription_tier}
                            onChange={(e) => updateUserTier(user.id, e.target.value)}
                            className="border rounded px-2 py-1 text-xs"
                          >
                            <option value="foundation">Foundation</option>
                            <option value="recovery">Recovery</option>
                            <option value="empowerment">Empowerment</option>
                          </select>
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-2">
                          <button
                            onClick={() => toggleUserStatus(user.id, user.is_active)}
                            className={`px-3 py-1 rounded text-xs ${
                              user.is_active 
                                ? 'bg-red-600 text-white hover:bg-red-700' 
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {user.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'payments' && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Management</CardTitle>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by user email..."
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="border rounded px-3 py-2 text-sm"
                />
              </div>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
              >
                <option value="">All Status</option>
                <option value="succeeded">Succeeded</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {filteredPayments.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No payments found</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">User</th>
                      <th className="text-left p-2">Amount</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map(payment => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{payment.user_email}</td>
                        <td className="p-2">${payment.amount.toFixed(2)}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            payment.status === 'succeeded' ? 'bg-green-100 text-green-800' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="p-2 text-xs">{new Date(payment.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'feedback' && (
        <Card>
          <CardHeader>
            <CardTitle>User Feedback</CardTitle>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter by feature..."
                  value={feedbackFilter}
                  onChange={(e) => setFeedbackFilter(e.target.value)}
                  className="border rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredFeedback.map(f => (
                <div key={f.id} className="border rounded p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">{f.feature}</div>
                      <div className="text-sm text-gray-600">{f.user_email}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-sm ${
                            i < f.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}>â˜…</span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteFeedback(f.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-700">{f.feedback}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'plans' && (
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plans.map((plan) => (
                <div key={plan.id} className="border rounded p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{plan.display_name}</h3>
                      <p className="text-gray-600">{plan.description}</p>
                      <p className="text-sm">Monthly: ${plan.price_monthly} | Yearly: ${plan.price_yearly}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingPlan(plan.id)} className="bg-blue-600 text-white px-4 py-2 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'redeem-codes' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Redeem Codes Management</h2>
            <button
              onClick={createRedeemCode}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Create New Code
            </button>
          </div>

          {/* Create New Code Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Redeem Code</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <input
                  type="text"
                  value={newCode.code}
                  onChange={(e) => setNewCode({...newCode, code: e.target.value})}
                  placeholder="AUTO-GENERATED"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Tier</label>
                <select
                  value={newCode.target_tier}
                  onChange={(e) => setNewCode({...newCode, target_tier: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="recovery">Recovery</option>
                  <option value="empowerment">Empowerment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trial Days</label>
                <input
                  type="number"
                  value={newCode.trial_duration_days}
                  onChange={(e) => setNewCode({...newCode, trial_duration_days: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses (-1 = unlimited)</label>
                <input
                  type="number"
                  value={newCode.max_uses}
                  onChange={(e) => setNewCode({...newCode, max_uses: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                <input
                  type="text"
                  value={newCode.campaign_name}
                  onChange={(e) => setNewCode({...newCode, campaign_name: e.target.value})}
                  placeholder="YouTube Launch"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
                <input
                  type="date"
                  value={newCode.expires_at}
                  onChange={(e) => setNewCode({...newCode, expires_at: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newCode.description}
                  onChange={(e) => setNewCode({...newCode, description: e.target.value})}
                  placeholder="7-day Recovery trial for YouTube subscribers"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Active Redeem Codes */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Active Redeem Codes</h3>
              <p className="text-sm text-gray-600">Manage all redeem codes and track their usage</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">YOUTUBE7DAY</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">YouTube Launch</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Recovery</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">7 days</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0/100</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          if (confirm('Delete code YOUTUBE7DAY?')) {
                            console.log('Delete YOUTUBE7DAY')
                          }
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">INSTAGRAM7</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Instagram Promo</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Recovery</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">7 days</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0/150</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          if (confirm('Delete code INSTAGRAM7?')) {
                            console.log('Delete INSTAGRAM7')
                          }
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">RECOVERY30</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Influencer Partnership</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">Empowerment</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">30 days</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0/25</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          if (confirm('Delete code RECOVERY30?')) {
                            console.log('Delete RECOVERY30')
                          }
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">SURVIVOR7</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Survivor Support</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Recovery</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">7 days</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0/âˆž</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          if (confirm('Delete code SURVIVOR7?')) {
                            console.log('Delete SURVIVOR7')
                          }
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                  {redeemCodes.map((code) => (
                    <tr key={code.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{code.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{code.campaign_name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          code.target_tier === 'recovery' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {code.target_tier === 'recovery' ? 'Recovery' : 'Empowerment'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{code.trial_duration_days} days</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {code.current_uses}/{code.max_uses === -1 ? 'âˆž' : code.max_uses}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          code.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {code.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => deleteRedeemCode(code.id, code.code)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete code"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {redeemCodes.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        No redeem codes found. Create your first code above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Marketing Tips */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Marketing Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-indigo-900 mb-2">YouTube Strategy</h4>
                <ul className="text-sm text-indigo-700 space-y-1">
                  <li>⬢ Use codes in video descriptions</li>
                  <li>⬢ Mention in video content</li>
                  <li>⬢ Pin comments with codes</li>
                  <li>⬢ Create urgency with limited uses</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-purple-900 mb-2">Social Media Tips</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>⬢ Share in Instagram stories</li>
                  <li>⬢ Use in TikTok captions</li>
                  <li>⬢ Facebook group exclusives</li>
                  <li>⬢ Twitter thread promotions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'blog' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Blog Post</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="Title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    placeholder="Slug (auto-generated if empty)"
                    value={newPost.slug}
                    onChange={(e) => setNewPost({...newPost, slug: e.target.value})}
                    className="border rounded px-3 py-2"
                  />
                </div>
                <textarea
                  placeholder="Excerpt"
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                  className="border rounded px-3 py-2 w-full h-20"
                />
                <textarea
                  placeholder="Content (Markdown supported)"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className="border rounded px-3 py-2 w-full h-40"
                />
                <div className="grid grid-cols-3 gap-4">
                  <select
                    value={newPost.category_id}
                    onChange={(e) => setNewPost({...newPost, category_id: e.target.value})}
                    className="border rounded px-3 py-2"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <select
                    value={newPost.status}
                    onChange={(e) => setNewPost({...newPost, status: e.target.value})}
                    className="border rounded px-3 py-2"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Reading time (min)"
                    value={newPost.reading_time}
                    onChange={(e) => setNewPost({...newPost, reading_time: parseInt(e.target.value)})}
                    className="border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <label key={tag.id} className="flex items-center gap-1 border rounded px-2 py-1 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTags([...selectedTags, tag.id])
                            } else {
                              setSelectedTags(selectedTags.filter(t => t !== tag.id))
                            }
                          }}
                        />
                        {tag.name}
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  onClick={createBlogPost}
                  className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
                >
                  Create Post
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Blog Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blogPosts.map(post => (
                  <div key={post.id} className="border rounded p-4">
                    {editingPost?.id === post.id ? (
                      <div className="space-y-4">
                        <input
                          value={editingPost.title}
                          onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                          className="border rounded px-3 py-2 w-full font-semibold"
                        />
                        <textarea
                          value={editingPost.excerpt}
                          onChange={(e) => setEditingPost({...editingPost, excerpt: e.target.value})}
                          className="border rounded px-3 py-2 w-full h-20"
                        />
                        <textarea
                          value={editingPost.content}
                          onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                          className="border rounded px-3 py-2 w-full h-40"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <select
                            value={editingPost.category_id}
                            onChange={(e) => setEditingPost({...editingPost, category_id: e.target.value})}
                            className="border rounded px-3 py-2"
                          >
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                          <select
                            value={editingPost.status}
                            onChange={(e) => setEditingPost({...editingPost, status: e.target.value})}
                            className="border rounded px-3 py-2"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateBlogPost(editingPost)}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingPost(null)}
                            className="bg-gray-600 text-white px-4 py-2 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{post.title}</h3>
                            <p className="text-sm text-gray-600">{post.excerpt}</p>
                            <div className="flex gap-2 mt-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                post.status === 'published' ? 'bg-green-100 text-green-800' :
                                post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {post.status}
                              </span>
                              {post.category && (
                                <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                  {post.category.name}
                                </span>
                              )}
                              <span className="text-xs text-gray-500">
                                {post.view_count} views
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingPost({...post, selectedTags: post.tags?.map((t: any) => t.id) || []})}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteBlogPost(post.id)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-4 gap-4">
                  <input
                    placeholder="Platform (e.g., YouTube)"
                    value={newSocial.platform}
                    onChange={(e) => setNewSocial({...newSocial, platform: e.target.value})}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    placeholder="URL"
                    value={newSocial.url}
                    onChange={(e) => setNewSocial({...newSocial, url: e.target.value})}
                    className="border rounded px-3 py-2"
                  />
                  <select
                    value={newSocial.icon}
                    onChange={(e) => setNewSocial({...newSocial, icon: e.target.value})}
                    className="border rounded px-3 py-2"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter</option>
                    <option value="facebook">Facebook</option>
                    <option value="music">TikTok</option>
                  </select>
                  <button
                    onClick={createSocialLink}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  >
                    Add Link
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {socialLinks.map(link => (
                  <div key={link.id} className="border rounded p-3">
                    {editingSocial?.id === link.id ? (
                      <div className="grid grid-cols-5 gap-2">
                        <input
                          value={editingSocial.platform}
                          onChange={(e) => setEditingSocial({...editingSocial, platform: e.target.value})}
                          className="border rounded px-2 py-1"
                        />
                        <input
                          value={editingSocial.url}
                          onChange={(e) => setEditingSocial({...editingSocial, url: e.target.value})}
                          className="border rounded px-2 py-1 col-span-2"
                        />
                        <select
                          value={editingSocial.icon}
                          onChange={(e) => setEditingSocial({...editingSocial, icon: e.target.value})}
                          className="border rounded px-2 py-1"
                        >
                          <option value="youtube">YouTube</option>
                          <option value="instagram">Instagram</option>
                          <option value="twitter">Twitter</option>
                          <option value="facebook">Facebook</option>
                          <option value="music">TikTok</option>
                        </select>
                        <div className="flex gap-2">
                          <button onClick={() => updateSocialLink(editingSocial)} className="bg-green-600 text-white px-3 py-1 rounded">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingSocial(null)} className="bg-gray-600 text-white px-3 py-1 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{link.platform}</span>
                          <span className="text-sm text-gray-600 ml-2">({link.icon})</span>
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 ml-2 hover:underline">
                            {link.url}
                          </a>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingSocial(link)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteSocialLink(link.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'newsletter' && (
        <Card>
          <CardHeader>
            <CardTitle>Newsletter Subscriptions</CardTitle>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={newsletterFilter}
                  onChange={(e) => setNewsletterFilter(e.target.value)}
                  className="border rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="text-sm text-gray-600 flex items-center">
                Total: {newsletters.filter(n => n.status === 'active').length} active subscribers
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {newsletters.filter(n => n.email.toLowerCase().includes(newsletterFilter.toLowerCase())).length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No newsletter subscriptions yet</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Source</th>
                      <th className="text-left p-2">Subscribed</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newsletters
                      .filter(n => n.email.toLowerCase().includes(newsletterFilter.toLowerCase()))
                      .map(sub => (
                      <tr key={sub.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{sub.email}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="p-2">{sub.source}</td>
                        <td className="p-2 text-xs">{new Date(sub.subscribed_at).toLocaleDateString()}</td>
                        <td className="p-2">
                          <button
                            onClick={() => deleteNewsletter(sub.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'features' && (
        <Card>
          <CardHeader>
            <CardTitle>Feature Limits (Monthly Basis)</CardTitle>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search features..."
                  value={featureFilter}
                  onChange={(e) => setFeatureFilter(e.target.value)}
                  className="border rounded px-3 py-2 text-sm"
                />
              </div>
              <select
                value={featureTierFilter}
                onChange={(e) => setFeatureTierFilter(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
              >
                <option value="">All Tiers</option>
                <option value="foundation">Foundation</option>
                <option value="recovery">Recovery</option>
                <option value="empowerment">Empowerment</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredFeatures.map((feature) => (
                <div key={feature.id} className="border rounded p-4">
                  {editingFeature === feature.id ? (
                    <div className="grid grid-cols-4 gap-4">
                      <select
                        value={feature.subscription_tier}
                        onChange={(e) => setFeatures(features.map(f => f.id === feature.id ? {...f, subscription_tier: e.target.value} : f))}
                        className="border rounded px-3 py-2"
                      >
                        <option value="foundation">Foundation</option>
                        <option value="recovery">Recovery</option>
                        <option value="empowerment">Empowerment</option>
                      </select>
                      <input
                        value={feature.feature_name}
                        onChange={(e) => setFeatures(features.map(f => f.id === feature.id ? {...f, feature_name: e.target.value} : f))}
                        className="border rounded px-3 py-2"
                        placeholder="Feature Name"
                      />
                      <select
                        value={feature.limit_type}
                        onChange={(e) => setFeatures(features.map(f => f.id === feature.id ? {...f, limit_type: e.target.value} : f))}
                        className="border rounded px-3 py-2"
                      >
                        <option value="monthly_count">Monthly Count</option>
                        <option value="storage_mb">Storage MB</option>
                        <option value="file_storage_mb">File Storage MB</option>
                      </select>
                      <input
                        type="number"
                        value={feature.limit_value}
                        onChange={(e) => setFeatures(features.map(f => f.id === feature.id ? {...f, limit_value: parseInt(e.target.value)} : f))}
                        className="border rounded px-3 py-2"
                        placeholder="Limit (-1 = unlimited)"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => saveFeature(feature)} className="bg-green-600 text-white px-4 py-2 rounded">
                          <Save className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingFeature(null)} className="bg-gray-600 text-white px-4 py-2 rounded">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold">{feature.subscription_tier}</span> - 
                        <span className="ml-2">{feature.feature_name}</span>
                        <span className="ml-2 text-gray-600">
                          ({feature.limit_type}: {feature.limit_value === -1 ? 'Unlimited' : 
                            feature.limit_type === 'storage_mb' || feature.limit_type === 'file_storage_mb' ? 
                              `${feature.limit_value} MB` : feature.limit_value})
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingFeature(feature.id)} className="bg-blue-600 text-white px-4 py-2 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteFeature(feature.id)} className="bg-red-600 text-white px-4 py-2 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}