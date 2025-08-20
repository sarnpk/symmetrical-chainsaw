'use client'

import { useState } from 'react'
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Shield, 
  Star,
  Calendar,
  Clock,
  MapPin,
  Video,
  Lock,
  Globe,
  Plus,
  Search
} from 'lucide-react'

interface CommunityPost {
  id: string
  author: string
  title: string
  content: string
  timestamp: string
  replies: number
  likes: number
  isAnonymous: boolean
  category: string
}

interface SupportGroup {
  id: string
  name: string
  description: string
  members: number
  nextMeeting: string
  isPrivate: boolean
  category: string
}

const mockPosts: CommunityPost[] = [
  {
    id: '1',
    author: 'Anonymous',
    title: 'Finding strength after leaving',
    content: 'It\'s been 6 months since I left, and some days are still really hard. But I wanted to share that it does get easier. The fog lifts, and you start to remember who you are.',
    timestamp: '2 hours ago',
    replies: 12,
    likes: 28,
    isAnonymous: true,
    category: 'recovery'
  },
  {
    id: '2',
    author: 'Sarah M.',
    title: 'Grey rock method success story',
    content: 'I\'ve been practicing the grey rock method for co-parenting situations, and it\'s been a game changer. The drama has decreased significantly.',
    timestamp: '5 hours ago',
    replies: 8,
    likes: 15,
    isAnonymous: false,
    category: 'strategies'
  },
  {
    id: '3',
    author: 'Anonymous',
    title: 'Rebuilding self-trust',
    content: 'How do you learn to trust your own perceptions again? I find myself second-guessing everything, even in healthy relationships.',
    timestamp: '1 day ago',
    replies: 24,
    likes: 42,
    isAnonymous: true,
    category: 'healing'
  }
]

const mockGroups: SupportGroup[] = [
  {
    id: '1',
    name: 'New Beginnings',
    description: 'Support group for those who have recently left narcissistic relationships',
    members: 24,
    nextMeeting: 'Tomorrow at 7 PM EST',
    isPrivate: true,
    category: 'recovery'
  },
  {
    id: '2',
    name: 'Co-Parenting Warriors',
    description: 'Strategies and support for co-parenting with a narcissistic ex',
    members: 18,
    nextMeeting: 'Friday at 6 PM EST',
    isPrivate: true,
    category: 'parenting'
  },
  {
    id: '3',
    name: 'Healing Circle',
    description: 'Long-term healing and personal growth focused group',
    members: 31,
    nextMeeting: 'Sunday at 3 PM EST',
    isPrivate: true,
    category: 'healing'
  }
]

export default function CommunityContent() {
  const [activeTab, setActiveTab] = useState<'posts' | 'groups' | 'resources'>('posts')
  const [searchTerm, setSearchTerm] = useState('')

  const tabs = [
    { id: 'posts', name: 'Community Posts', icon: MessageCircle },
    { id: 'groups', name: 'Support Groups', icon: Users },
    { id: 'resources', name: 'Resources', icon: Star }
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'recovery': return 'bg-green-100 text-green-800 border-green-200'
      case 'strategies': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'healing': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'parenting': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const renderPosts = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-semibold text-gray-900">Community Posts</h2>
        <button className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
          <Plus className="h-4 w-4" />
          New Post
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search posts..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-4">
        {mockPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  {post.isAnonymous ? (
                    <Shield className="h-5 w-5 text-indigo-600" />
                  ) : (
                    <span className="text-indigo-600 font-medium">
                      {post.author.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{post.author}</h3>
                  <p className="text-sm text-gray-500">{post.timestamp}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
            </div>

            <h4 className="text-lg font-semibold text-gray-900 mb-3">{post.title}</h4>
            <p className="text-gray-600 mb-4">{post.content}</p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">{post.replies} replies</span>
                </button>
              </div>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                Read more
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderGroups = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-semibold text-gray-900">Support Groups</h2>
        <button className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
          <Plus className="h-4 w-4" />
          Request to Join
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{group.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{group.members} members</span>
                    {group.isPrivate && (
                      <>
                        <span>•</span>
                        <Lock className="h-3 w-3" />
                        <span>Private</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(group.category)}`}>
                {group.category}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{group.description}</p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{group.nextMeeting}</span>
              </div>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                Join Group
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderResources = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Community Resources</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Crisis Resources</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Emergency contacts and crisis helplines for immediate support.
          </p>
          <button className="text-red-600 hover:text-red-700 font-medium text-sm">
            View Resources →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Star className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Recommended Reading</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Books, articles, and resources recommended by the community.
          </p>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            Browse Library →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Video className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Workshops</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Live and recorded workshops on healing and recovery topics.
          </p>
          <button className="text-green-600 hover:text-green-700 font-medium text-sm">
            View Schedule →
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-4">
          <Users className="h-8 w-8 text-indigo-600" />
          Community
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Connect with others who understand your journey. Share experiences, find support, and build meaningful connections in a safe space.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-px-4 overscroll-x-contain">
          <div className="flex gap-2 py-2 md:p-0 md:gap-0 md:grid md:grid-cols-3 snap-x snap-mandatory">
            {tabs.map(tab => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-none md:flex-1 snap-start inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors rounded-md md:rounded-none ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {tab.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'posts' && renderPosts()}
        {activeTab === 'groups' && renderGroups()}
        {activeTab === 'resources' && renderResources()}
      </div>
    </div>
  )
}
