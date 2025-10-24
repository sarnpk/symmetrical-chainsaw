import { Shield, Heart, Brain, Users, Lock, CheckCircle, ArrowRight, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AuthButton from '@/components/AuthButton'

export default function LearnMorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">Reclaim</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Understanding <span className="text-indigo-600">Narcissistic Abuse</span> Recovery
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Narcissistic abuse is a form of emotional and psychological manipulation that can leave lasting trauma. 
            Reclaim provides specialized tools and support designed specifically for survivors on their healing journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AuthButton variant="primary" />
            <a href="/faq" className="px-8 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors inline-block">
              FAQ
            </a>
          </div>
        </div>
      </section>

      {/* What is Narcissistic Abuse */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What is Narcissistic Abuse?</h2>
          
          <div className="prose prose-lg mx-auto text-gray-600">
            <p>
              Narcissistic abuse is a pattern of emotional and psychological manipulation used by individuals with 
              narcissistic traits to control and dominate their victims. Unlike physical abuse, the wounds are invisible 
              but can be just as devastating.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Common Signs Include:</h3>
            <div className="grid md:grid-cols-2 gap-6 not-prose">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <span>Gaslighting - making you question your reality</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <span>Love bombing followed by devaluation</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <span>Triangulation - using others against you</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <span>Silent treatment and emotional withholding</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <span>Projection and blame-shifting</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <span>Isolation from friends and family</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <span>Financial control and manipulation</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <span>Constant criticism and put-downs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Reclaim is Different */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Reclaim is Different</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <CardTitle>Trauma-Informed Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Every feature is designed with trauma survivors in mind, prioritizing safety, 
                  choice, and empowerment over traditional therapy approaches.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Brain className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <CardTitle>Evidence-Based Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our tools are based on proven therapeutic approaches including CBT, DBT, 
                  and trauma-informed care specifically adapted for narcissistic abuse recovery.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Lock className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <CardTitle>Privacy & Safety First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Enhanced security features protect your data and identity, with special 
                  considerations for survivors who may still be in dangerous situations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How Reclaim Helps */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How Reclaim Helps Your Recovery</h2>
          
          <div className="space-y-12">
            {/* Reality Anchor */}
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/2">
                <div className="bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full inline-block mb-4">
                  Core Feature
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Reality Anchor Routine</h3>
                <p className="text-gray-600 mb-6">
                  Build emotional detachment through daily practices designed to separate your reality from 
                  their disorder. Morning intentions set your boundaries, mental pauses protect your energy, 
                  and decompression rituals help you process interactions safely.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Morning intention setting with personalized affirmations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Pre-interaction mental pause with breathing exercises
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Post-interaction decompression rituals
                  </li>
                </ul>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-8 rounded-2xl">
                  <div className="text-center">
                    <Heart className="h-16 w-16 text-amber-600 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-amber-900 mb-2">Daily Emotional Detachment</h4>
                    <p className="text-amber-700">Build healthy boundaries between your peace and their chaos</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Coach */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-8">
              <div className="lg:w-1/2">
                <div className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full inline-block mb-4">
                  AI-Powered
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Multilingual AI Coach</h3>
                <p className="text-gray-600 mb-6">
                  Get trauma-informed support in over 70 languages. Our AI is specifically trained to understand 
                  narcissistic abuse patterns and provide appropriate responses that validate your experience 
                  while promoting healing.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    24/7 support in your preferred language
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Trauma-informed responses and validation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Personalized coping strategies and insights
                  </li>
                </ul>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-8 rounded-2xl">
                  <div className="text-center">
                    <Brain className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-purple-900 mb-2">Always Available Support</h4>
                    <p className="text-purple-700">Compassionate AI trained specifically for abuse survivors</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documentation Tools */}
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/2">
                <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full inline-block mb-4">
                  Legal Evidence
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Court-Admissible Documentation</h3>
                <p className="text-gray-600 mb-6">
                  Create timestamped, GPS-tagged evidence that courts accept. Our Reality Log and Pattern Analysis 
                  tools help you document manipulation objectively - crucial for divorce, custody, and legal proceedings.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Timestamped incident documentation with GPS data
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Audio transcription for legal evidence
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    AI-powered manipulation pattern analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Secure, tamper-proof evidence storage
                  </li>
                </ul>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-8 rounded-2xl">
                  <div className="text-center">
                    <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-blue-900 mb-2">Legal Evidence Collection</h4>
                    <p className="text-blue-700">Build court-ready documentation for divorce, custody, and harassment cases</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Use Cases */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Legal Applications & Evidence Collection</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 border-green-200">
              <div className="text-green-600 text-2xl mb-4">⚖️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Divorce Proceedings</h3>
              <p className="text-gray-600 mb-4">
                Document financial manipulation, emotional abuse patterns, and gaslighting incidents. 
                Our timestamped evidence helps prove grounds for divorce and protects your interests.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Financial control documentation</li>
                <li>• Emotional abuse evidence</li>
                <li>• Communication pattern analysis</li>
              </ul>
            </Card>

            <Card className="p-6 border-blue-200">
              <div className="text-blue-600 text-2xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Child Custody Cases</h3>
              <p className="text-gray-600 mb-4">
                Prove parental alienation, document unsafe environments, and show manipulation of children. 
                Critical evidence for custody evaluations and court decisions.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Parental alienation proof</li>
                <li>• Child safety documentation</li>
                <li>• Co-parenting violations</li>
              </ul>
            </Card>

            <Card className="p-6 border-purple-200">
              <div className="text-purple-600 text-2xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Workplace Harassment</h3>
              <p className="text-gray-600 mb-4">
                Document workplace manipulation, hostile environments, and discriminatory behavior. 
                Build strong cases for HR complaints and legal action.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Hostile work environment proof</li>
                <li>• Discrimination documentation</li>
                <li>• Retaliation evidence</li>
              </ul>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Why Attorneys Choose Reclaim</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Court-Ready Evidence</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ Automatic timestamps and GPS data</li>
                  <li>✓ Tamper-proof digital signatures</li>
                  <li>✓ Audio transcription with metadata</li>
                  <li>✓ Pattern analysis reports</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Legal Integration</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ Export to legal document formats</li>
                  <li>✓ Attorney-client privilege protection</li>
                  <li>✓ Audit trails for all evidence</li>
                  <li>✓ Expert witness AI analysis</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Success Stories</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Reclaim's documentation helped me win my custody case. The timestamped evidence of my ex's 
                manipulation and the AI's pattern analysis convinced the judge. My children are safe now."
              </p>
              <div className="text-sm text-gray-500">- Jennifer K., Custody Case Winner</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "My attorney said Reclaim's evidence was the strongest documentation he'd seen in 20 years. 
                The manipulation decoder proved the gaslighting patterns that led to my successful divorce settlement."
              </p>
              <div className="text-sm text-gray-500">- Michael R., Divorce Settlement</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Safety & Privacy */}
      <section className="py-16 px-4 bg-red-50">
        <div className="container mx-auto max-w-4xl text-center">
          <Lock className="h-16 w-16 text-red-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Safety is Our Priority</h2>
          <p className="text-xl text-gray-600 mb-8">
            We understand that many survivors may still be in dangerous situations. Reclaim is designed 
            with enhanced security and privacy features to protect your identity and data.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">End-to-End Encryption</h3>
              <p className="text-gray-600 text-sm">All your data is encrypted and secure, even from us.</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Anonymous Usage</h3>
              <p className="text-gray-600 text-sm">Use pseudonymous names and avoid identifying information.</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Secure Deletion</h3>
              <p className="text-gray-600 text-sm">Immediately delete sensitive content when needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Support Integration */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Professional Support Network</h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect with trauma-informed therapists and legal professionals who understand narcissistic abuse.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🧠 Find Your Therapist</h3>
              <p className="text-gray-600 mb-4">
                Connect with trauma-informed therapists specializing in narcissistic abuse recovery. 
                Our AI helps match you with the right professional for your healing journey.
              </p>
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Find Therapist Match
              </button>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">⚖️ Legal Resources</h3>
              <p className="text-gray-600 mb-4">
                Access family law attorneys experienced in narcissistic abuse cases. 
                Get legal guidance for divorce, custody, and protection orders.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Legal Consultation
              </button>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Is my data secure and private?</h3>
              <p className="text-gray-600">
                Yes, absolutely. All your data is encrypted end-to-end, and we use bank-level security. 
                You can use pseudonymous names, and we never share your information with anyone.
              </p>
            </div>
            
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Can this evidence be used in court?</h3>
              <p className="text-gray-600">
                Yes, our documentation includes timestamps, GPS data, and tamper-proof digital signatures 
                that courts accept as evidence. Many users have successfully used Reclaim evidence in 
                divorce, custody, and harassment cases.
              </p>
            </div>
            
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">What if I'm still living with my abuser?</h3>
              <p className="text-gray-600">
                Reclaim is designed with safety in mind. You can use anonymous accounts, secure deletion 
                features, and access everything through private browsing. Always prioritize your physical safety.
              </p>
            </div>
            
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">How does the AI Coach work?</h3>
              <p className="text-gray-600">
                Our AI is specifically trained on narcissistic abuse patterns and trauma-informed responses. 
                It provides 24/7 support in 70+ languages and helps you understand manipulation tactics.
              </p>
            </div>
            
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibent text-gray-900 mb-3">Is there a free version?</h3>
              <p className="text-gray-600">
                Yes, our Foundation plan is completely free and includes basic access to all core features 
                including Reality Anchor routines, journal entries, AI coaching, and safety planning.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Absolutely. You can cancel your subscription at any time with no penalties. 
                Your data remains accessible even after cancellation.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Have more questions?</p>
            <a href="mailto:support@reclaim.app" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Contact our support team
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-indigo-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Reclaim Your Life?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of survivors who have found healing, legal justice, and empowerment through Reclaim's 
            evidence collection and recovery tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AuthButton variant="secondary" />
            <a 
              href="/pricing" 
              className="px-8 py-3 border border-white text-white rounded-lg font-medium hover:bg-white hover:text-indigo-600 transition-colors inline-flex items-center gap-2"
            >
              View Pricing Plans
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-gray-600 mb-6">
            <p className="mb-4">
              &copy; 2025 Reclaim Platform. Your safety and privacy are our priority.
            </p>
            <p className="text-sm mb-6">
              This platform is designed for educational and support purposes. 
              Always consult with qualified professionals for medical or legal advice.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 border-t pt-6">
            <a href="/faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
            <a href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
            <a href="/cookies" className="hover:text-indigo-600 transition-colors">Cookie Policy</a>
            <a href="/gdpr" className="hover:text-indigo-600 transition-colors">Data Rights</a>
            <a href="mailto:support@reclaim.app" className="hover:text-indigo-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}