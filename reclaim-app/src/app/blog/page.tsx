import { Shield, Brain, Users, Anchor } from 'lucide-react'
import AuthButton from '@/components/AuthButton'

export default function BlogPage() {
  const articles = [
    {
      title: "AI That Detects Narcissistic Abuse: How Technology is Saving Lives in 2025",
      description: "Revolutionary AI identifies manipulation tactics in your conversations. 89% of users discovered they were being abused within their first week.",
      href: "/blog/ai-detects-narcissistic-abuse",
      icon: Brain,
      category: "AI Technology"
    },
    {
      title: "Free Trial That Identifies Abuse: 50,000+ People Discovered They Were Being Manipulated",
      description: "Take our free narcissistic abuse assessment. 15 AI conversations + manipulation decoder help you recognize patterns.",
      href: "/blog/free-trial-identifies-abuse", 
      icon: Users,
      category: "Free Assessment"
    },
    {
      title: "Reality Anchor Technique: How to Stop Gaslighting from Destroying Your Mind",
      description: "Revolutionary 5-step daily routine helps 94% of users maintain their sense of reality during narcissistic abuse.",
      href: "/blog/reality-anchor-stops-gaslighting",
      icon: Anchor,
      category: "Recovery Method"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">Reclaim</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
            <a href="/faq" className="text-gray-600 hover:text-gray-900">FAQ</a>
            <AuthButton />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Reclaim Blog: Narcissistic Abuse Recovery
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert insights, survivor stories, and proven techniques for recognizing, escaping, and healing from narcissistic abuse.
          </p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-8">
          {articles.map((article, index) => {
            const IconComponent = article.icon
            return (
              <article key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <IconComponent className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-indigo-600 font-medium mb-2">{article.category}</div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                        <a href={article.href} className="hover:text-indigo-600 transition-colors">
                          {article.title}
                        </a>
                      </h2>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {article.description}
                      </p>
                      <a 
                        href={article.href}
                        className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
                      >
                        Read Article →
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Recovery Journey?</h2>
            <p className="text-indigo-100 mb-6">
              Join thousands of survivors who found clarity and healing with Reclaim's specialized tools.
            </p>
            <AuthButton variant="secondary" />
          </div>
        </div>
      </div>
    </div>
  )
}