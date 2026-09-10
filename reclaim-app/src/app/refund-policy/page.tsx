import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy - Reclaim',
  description: 'Refund policy for Reclaim subscriptions.',
}

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Refund Policy</h1>
        <p className="text-sm text-gray-600 mb-8">Last updated: September 10, 2026</p>

        <div className="prose prose-gray max-w-none">
          <h2>1. Overview</h2>
          <p>
            Reclaim is a digital subscription service. This refund policy explains when and how you can request a refund for your subscription.
          </p>

          <h2>2. Subscription Refunds</h2>
          <h3>2.1 Monthly Subscriptions</h3>
          <p>
            Monthly subscriptions can be cancelled at any time. You will continue to have access until the end of your current billing period. We do not offer partial refunds for unused portions of a monthly subscription.
          </p>

          <h3>2.2 Annual Subscriptions</h3>
          <p>
            Annual subscriptions can be cancelled at any time. You will continue to have access until the end of your current billing period. We do not offer partial refunds for unused portions of an annual subscription.
          </p>

          <h2>3. Refund Eligibility</h2>
          <p>You may be eligible for a full refund if:</p>
          <ul>
            <li>You accidentally purchased a subscription and contact us within 14 days of purchase</li>
            <li>You were charged for a subscription you did not authorize</li>
            <li>The service is materially different from what was described</li>
          </ul>

          <h2>4. How to Request a Refund</h2>
          <p>
            To request a refund, contact us at{' '}
            <a href="mailto:support@reclaimyourlife.app" className="text-emerald-600 hover:underline">
              support@reclaimyourlife.app
            </a>{' '}
            with your account email and reason for the refund request.
          </p>

          <h2>5. Processing Refunds</h2>
          <p>
            Approved refunds will be processed within 5-10 business days. Refunds are issued to the original payment method.
          </p>

          <h2>6. Contact</h2>
          <p>
            If you have questions about this refund policy, please contact us at{' '}
            <a href="mailto:support@reclaimyourlife.app" className="text-emerald-600 hover:underline">
              support@reclaimyourlife.app
            </a>.
          </p>
        </div>
      </div>
    </div>
  )
}
