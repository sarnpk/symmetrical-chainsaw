export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
        <p className="text-sm text-gray-600 mb-8">Last updated: January 27, 2025</p>

        <div className="prose prose-gray max-w-none">
          <h2>1. What Are Cookies</h2>
          <p>
            Cookies are small text files that are stored on your device when you visit our website. 
            They help us provide you with a better experience by remembering your preferences and 
            keeping you logged in securely.
          </p>

          <h2>2. How We Use Cookies</h2>
          
          <h3>2.1 Essential Cookies (Always Active)</h3>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
            <p className="font-semibold text-blue-900 mb-2">These cookies are necessary for the website to function:</p>
            <ul className="text-blue-800">
              <li><strong>Authentication:</strong> Keep you logged in securely (Supabase auth tokens)</li>
              <li><strong>Security:</strong> Prevent cross-site request forgery attacks</li>
              <li><strong>Session Management:</strong> Maintain your session across pages</li>
              <li><strong>Language Preference:</strong> Remember your selected language for AI responses</li>
            </ul>
          </div>

          <h3>2.2 Functional Cookies (Optional)</h3>
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
            <p className="font-semibold text-green-900 mb-2">These cookies enhance your experience:</p>
            <ul className="text-green-800">
              <li><strong>Theme Preferences:</strong> Remember your dark/light mode choice</li>
              <li><strong>Dashboard Layout:</strong> Save your preferred dashboard configuration</li>
              <li><strong>Form Data:</strong> Temporarily save form inputs to prevent data loss</li>
              <li><strong>Cookie Consent:</strong> Remember your cookie preferences</li>
            </ul>
          </div>

          <h3>2.3 Analytics Cookies (Optional)</h3>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
            <p className="font-semibold text-yellow-900 mb-2">Help us improve the platform (only with your consent):</p>
            <ul className="text-yellow-800">
              <li><strong>Usage Analytics:</strong> Understand which features are most helpful</li>
              <li><strong>Performance Monitoring:</strong> Identify and fix technical issues</li>
              <li><strong>Feature Usage:</strong> See how different tools are being used</li>
              <li><strong>Error Tracking:</strong> Monitor and resolve bugs quickly</li>
            </ul>
          </div>

          <h2>3. Cookies We Use</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Cookie Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Purpose</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Duration</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">sb-access-token</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Authentication token for secure login</td>
                  <td className="px-4 py-3 text-sm text-gray-600">1 hour</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Essential</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">sb-refresh-token</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Refresh authentication automatically</td>
                  <td className="px-4 py-3 text-sm text-gray-600">30 days</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Essential</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">reclaim-theme</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Remember dark/light mode preference</td>
                  <td className="px-4 py-3 text-sm text-gray-600">1 year</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Functional</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">reclaim-consent</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Store your cookie consent choices</td>
                  <td className="px-4 py-3 text-sm text-gray-600">1 year</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Essential</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">reclaim-analytics</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Anonymous usage analytics (if consented)</td>
                  <td className="px-4 py-3 text-sm text-gray-600">30 days</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Analytics</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>4. Third-Party Cookies</h2>
          <p>We use minimal third-party services that may set cookies:</p>
          
          <h3>4.1 Supabase (Authentication & Database)</h3>
          <ul>
            <li><strong>Purpose:</strong> Secure authentication and data storage</li>
            <li><strong>Cookies:</strong> Authentication tokens only</li>
            <li><strong>Privacy Policy:</strong> <a href="https://supabase.com/privacy" className="text-indigo-600 hover:underline" target="_blank" rel="noopener">Supabase Privacy Policy</a></li>
          </ul>

          <h3>4.2 Google AI (AI Processing)</h3>
          <ul>
            <li><strong>Purpose:</strong> Process AI chat requests (no cookies set on our domain)</li>
            <li><strong>Data:</strong> Only anonymized chat content for processing</li>
            <li><strong>Privacy Policy:</strong> <a href="https://policies.google.com/privacy" className="text-indigo-600 hover:underline" target="_blank" rel="noopener">Google Privacy Policy</a></li>
          </ul>

          <h2>5. Managing Your Cookie Preferences</h2>
          
          <h3>5.1 Cookie Banner</h3>
          <p>
            When you first visit our site, you'll see a cookie banner where you can:
          </p>
          <ul>
            <li>Accept all cookies</li>
            <li>Accept only essential cookies</li>
            <li>Customize your preferences</li>
          </ul>

          <h3>5.2 Browser Settings</h3>
          <p>You can also manage cookies through your browser settings:</p>
          <ul>
            <li><strong>Chrome:</strong> Settings â†’ Privacy and Security â†’ Cookies</li>
            <li><strong>Firefox:</strong> Settings â†’ Privacy & Security â†’ Cookies</li>
            <li><strong>Safari:</strong> Preferences â†’ Privacy â†’ Cookies</li>
            <li><strong>Edge:</strong> Settings â†’ Cookies and Site Permissions</li>
          </ul>

          <h3>5.3 Update Preferences</h3>
          <p>
            You can change your cookie preferences anytime by:
          </p>
          <ul>
            <li>Visiting your <a href="/gdpr" className="text-indigo-600 hover:underline">Data Rights</a> page</li>
            <li>Clearing your browser cookies and revisiting our site</li>
            <li>Contacting us at <a href="mailto:privacy@reclaimyourlife.app" className="text-indigo-600">privacy@reclaimyourlife.app</a></li>
          </ul>

          <h2>6. Impact of Disabling Cookies</h2>
          
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <h3 className="font-semibold text-amber-900 mb-2">If you disable cookies:</h3>
            <ul className="text-amber-800">
              <li><strong>Essential Cookies:</strong> The platform will not function properly</li>
              <li><strong>Functional Cookies:</strong> You'll lose personalization features</li>
              <li><strong>Analytics Cookies:</strong> No impact on functionality</li>
            </ul>
          </div>

          <h2>7. Data Protection</h2>
          <p>
            All cookies are handled in accordance with:
          </p>
          <ul>
            <li>GDPR (General Data Protection Regulation)</li>
            <li>CCPA (California Consumer Privacy Act)</li>
            <li>Our <a href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a></li>
          </ul>

          <h2>8. Sensitive Data Protection</h2>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="font-semibold text-red-900 mb-2">Important for Abuse Survivors:</p>
            <ul className="text-red-800">
              <li>No tracking cookies that could compromise your safety</li>
              <li>No third-party advertising or social media cookies</li>
              <li>All cookies are encrypted and secure</li>
              <li>You can clear all cookies anytime for privacy</li>
            </ul>
          </div>

          <h2>9. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy periodically. We'll notify you of significant 
            changes via email or in-app notification. The "Last updated" date at the top 
            shows when this policy was last revised.
          </p>

          <h2>10. Contact Us</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p>If you have questions about our use of cookies:</p>
            <ul className="mt-2">
              <li><strong>Email:</strong> <a href="mailto:privacy@reclaimyourlife.app" className="text-indigo-600">privacy@reclaimyourlife.app</a></li>
              <li><strong>Data Rights:</strong> <a href="/gdpr" className="text-indigo-600 hover:underline">Visit GDPR Page</a></li>
              <li><strong>General Support:</strong> <a href="mailto:support@reclaimyourlife.app" className="text-indigo-600">support@reclaimyourlife.app</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}