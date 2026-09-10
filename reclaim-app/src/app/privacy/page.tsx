export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <p className="text-sm text-gray-600 mb-8">Last updated: January 27, 2025</p>

        <div className="prose prose-gray max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Reclaim ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform designed for survivors of narcissistic abuse.
          </p>

          <div className="bg-green-50 border-2 border-green-600 p-6 rounded-lg my-6">
            <h3 className="text-green-900 font-bold text-lg mb-3">ðŸ”’ WE DO NOT USE YOUR PERSONAL DATA FOR AI TRAINING</h3>
            <p className="text-green-800 mb-3">
              <strong>Your privacy is absolute.</strong> We want to be crystal clear about what we DO NOT do with your data:
            </p>
            <ul className="text-green-800 space-y-2">
              <li><strong>âœ— We DO NOT</strong> use your journal entries to train AI models</li>
              <li><strong>âœ— We DO NOT</strong> use your conversations to improve language models</li>
              <li><strong>âœ— We DO NOT</strong> share your personal stories with third-party AI companies</li>
              <li><strong>âœ— We DO NOT</strong> feed your documentation into machine learning systems</li>
              <li><strong>âœ— We DO NOT</strong> sell or license your data to anyone for any purpose</li>
            </ul>
            <p className="text-green-800 mt-3">
              When we process your content with AI (like analyzing manipulation patterns), it happens in real-time and is never stored or used for training. Your data is yours alone.
            </p>
          </div>

          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Personal Information</h3>
          <ul>
            <li><strong>Account Information:</strong> Email address, display name, password (encrypted)</li>
            <li><strong>Profile Data:</strong> Preferred language, abuser gender (for pronoun personalization), children status, custody arrangements</li>
            <li><strong>Subscription Data:</strong> Billing information, subscription tier, payment history</li>
          </ul>

          <h3>2.2 Content Data</h3>
          <ul>
            <li><strong>Journal Entries:</strong> Text, photos, audio recordings, timestamps, mood ratings</li>
            <li><strong>Reality Log:</strong> Incident documentation, NPD trait identification, pattern analysis</li>
            <li><strong>AI Conversations:</strong> Chat messages, context preferences, conversation history</li>
            <li><strong>Wellness Data:</strong> Mind reset sessions, breathing exercises, coping strategies, mood tracking</li>
            <li><strong>Safety Plans:</strong> Emergency contacts, boundary settings, Grey Rock strategies</li>
          </ul>

          <h3>2.3 Usage Data</h3>
          <ul>
            <li><strong>Analytics:</strong> Feature usage, session duration, interaction patterns</li>
            <li><strong>Technical Data:</strong> IP address, device type, browser information, error logs</li>
            <li><strong>Performance Data:</strong> App performance metrics, crash reports</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          
          <h3>3.1 Core Services</h3>
          <ul>
            <li>Provide journaling and documentation tools</li>
            <li>Deliver AI-powered coaching and support in your preferred language</li>
            <li>Analyze patterns in abusive behavior</li>
            <li>Offer personalized wellness and coping strategies</li>
            <li>Maintain Reality Anchor routines and streak tracking</li>
          </ul>

          <h3>3.2 Platform Improvement</h3>
          <ul>
            <li>Improve AI model accuracy and trauma-informed responses using only aggregated, anonymized data</li>
            <li>Enhance pattern recognition algorithms using statistical analysis (not individual data)</li>
            <li>Develop new features based on usage patterns (anonymized metrics only)</li>
            <li>Optimize app performance and user experience</li>
          </ul>

          <h3>3.3 Communication</h3>
          <ul>
            <li>Send important account and security notifications</li>
            <li>Provide customer support and technical assistance</li>
            <li>Share relevant educational content (with consent)</li>
          </ul>

          <h2>4. Data Security</h2>
          
          <h3>4.1 Encryption</h3>
          <ul>
            <li>All data is encrypted in transit using TLS 1.3</li>
            <li>Sensitive data is encrypted at rest using AES-256</li>
            <li>Database access is restricted and monitored</li>
          </ul>

          <h3>4.2 Access Controls</h3>
          <ul>
            <li>Multi-factor authentication for admin access</li>
            <li>Role-based access permissions</li>
            <li>Regular security audits and penetration testing</li>
            <li>Employee background checks and confidentiality agreements</li>
          </ul>

          <h2>5. Data Sharing and Disclosure</h2>
          
          <h3>5.1 We DO NOT Share</h3>
          <ul>
            <li>Your personal journal entries or documentation</li>
            <li>AI conversation content</li>
            <li>Safety plans or emergency contacts</li>
            <li>Any content that could identify you or your situation</li>
            <li><strong>We DO NOT use your data to train AI models or sell it to third parties</strong></li>
          </ul>

          <h3>5.2 Limited Sharing (With Strict Privacy Controls)</h3>
          <ul>
            <li><strong>Service Providers:</strong> Encrypted data with Supabase (hosting). Google AI processes your requests in real-time but does NOT store or train on your data per our contract</li>
            <li><strong>Legal Requirements:</strong> Only when required by court order or to prevent imminent harm</li>
            <li><strong>Aggregated Data:</strong> Anonymous usage statistics only (e.g., "50% of users use journaling feature") with zero personal identification</li>
          </ul>

          <div className="bg-blue-50 border border-blue-300 p-4 rounded-lg my-4">
            <p className="text-blue-900 font-semibold">How AI Processing Works:</p>
            <p className="text-blue-800 text-sm mt-2">
              When you use AI features, your content is sent to Google AI for real-time processing only. We have contractual agreements ensuring your data is NOT used for training their models. The AI generates a response and immediately discards your input. Nothing is retained by Google.
            </p>
          </div>

          <h2>6. Your Rights (GDPR & CCPA)</h2>
          
          <h3>6.1 Access and Control</h3>
          <ul>
            <li><strong>Access:</strong> Request a copy of all your data</li>
            <li><strong>Rectification:</strong> Correct inaccurate information</li>
            <li><strong>Erasure:</strong> Delete your account and all associated data</li>
            <li><strong>Portability:</strong> Export your data in JSON format</li>
            <li><strong>Restriction:</strong> Limit how we process your data</li>
          </ul>

          <h3>6.2 Exercising Rights</h3>
          <p>Contact us at <a href="mailto:privacy@reclaimyourlife.app" className="text-indigo-600">privacy@reclaimyourlife.app</a> to exercise any of these rights. We will respond within 30 days.</p>

          <h2>7. Data Retention</h2>
          <ul>
            <li><strong>Active Accounts:</strong> Data retained while account is active</li>
            <li><strong>Deleted Accounts:</strong> All personal data deleted within 30 days</li>
            <li><strong>Legal Requirements:</strong> Some data may be retained longer if required by law</li>
            <li><strong>Backups:</strong> Encrypted backups deleted within 90 days of account deletion</li>
          </ul>

          <h2>8. International Transfers</h2>
          <p>
            Your data may be processed in the United States and European Union. We ensure adequate protection through:
          </p>
          <ul>
            <li>Standard Contractual Clauses (SCCs)</li>
            <li>Adequacy decisions where applicable</li>
            <li>Additional safeguards for sensitive data</li>
          </ul>

          <h2>9. Children's Privacy</h2>
          <p>
            Our service is not intended for children under 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. We will notify you of significant changes via email or in-app notification. Continued use of the service constitutes acceptance of the updated policy.
          </p>

          <h2>11. Contact Information</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Data Protection Officer:</strong> privacy@reclaimyourlife.app</p>
            <p><strong>General Inquiries:</strong> support@reclaimyourlife.app</p>
            <p><strong>Mailing Address:</strong> [Company Address]</p>
          </div>

          <h2>12. Specific Protections for Abuse Survivors</h2>
          <p>
            Understanding the sensitive nature of our platform, we implement additional protections:
          </p>
          <ul>
            <li>No data sharing with law enforcement without court order</li>
            <li>Enhanced security monitoring for account access</li>
            <li>Option to use pseudonymous display names</li>
            <li>Secure deletion tools for immediate content removal</li>
            <li>No tracking pixels or third-party analytics in sensitive areas</li>
          </ul>
        </div>
      </div>
    </div>
  )
}