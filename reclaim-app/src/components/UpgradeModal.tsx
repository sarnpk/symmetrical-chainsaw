'use client'

import Link from 'next/link'
import { X, Crown, Mic, Brain, Shield, Download, FileText, Lock } from 'lucide-react'

interface UpgradeModalProps {
  open: boolean
  onClose: () => void
  feature?: string
  requiredTier?: 'recovery' | 'empowerment'
}

const tierDetails = {
  recovery: {
    name: 'Recovery',
    price: '$14.99',
    period: '/month',
    yearlyPrice: '$150',
    yearlyPeriod: '/year',
    color: 'from-blue-600 to-indigo-600',
    highlight: 'Most popular for healing',
    features: [
      { icon: Brain, text: '25 AI coach chats/day', note: 'vs 2 on Free' },
      { icon: Mic, text: '60 min audio transcription/month', note: '' },
      { icon: Shield, text: '25 boundary builder/month', note: 'vs 5 on Free' },
      { icon: Download, text: '5 PDF exports/month', note: 'vs 1 on Free' },
      { icon: FileText, text: '1 GB file storage', note: 'vs 100 MB on Free' },
    ],
  },
  empowerment: {
    name: 'Empowerment',
    price: '$24.99',
    period: '/month',
    yearlyPrice: '$250',
    yearlyPeriod: '/year',
    color: 'from-purple-600 to-pink-600',
    highlight: 'Complete recovery suite',
    features: [
      { icon: Brain, text: '50 AI coach chats/day', note: '' },
      { icon: Mic, text: '300 min audio transcription/month', note: '' },
      { icon: Shield, text: 'Unlimited boundary builder', note: '' },
      { icon: Download, text: 'Unlimited PDF exports', note: '' },
      { icon: FileText, text: '5 GB file storage', note: '' },
    ],
  },
}

export default function UpgradeModal({ open, onClose, feature, requiredTier = 'recovery' }: UpgradeModalProps) {
  if (!open) return null
  const tier = tierDetails[requiredTier]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className={`bg-gradient-to-br ${tier.color} px-6 pt-6 pb-8 text-white relative`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white rounded-full" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Crown className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium bg-white/20 px-2.5 py-1 rounded-full">{tier.highlight}</span>
            </div>
            <h3 className="text-xl font-bold mb-1">Upgrade to {tier.name}</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold">{tier.price}</span>
              <span className="text-white/70 text-sm">{tier.period}</span>
              <span className="text-white/50 text-xs ml-2">or {tier.yearlyPrice}{tier.yearlyPeriod}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          {feature && (
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              <span className="font-semibold text-gray-900">{feature}</span> requires the {tier.name} plan.
            </p>
          )}

          <ul className="space-y-3 mb-5">
            {tier.features.map((f) => (
              <li key={f.text} className="flex items-start gap-2.5">
                <div className="mt-0.5 p-1 bg-indigo-50 rounded-md shrink-0">
                  <f.icon className="h-3.5 w-3.5 text-indigo-600" />
                </div>
                <div>
                  <span className="text-sm text-gray-800 font-medium">{f.text}</span>
                  {f.note && <span className="text-xs text-gray-400 ml-1">{f.note}</span>}
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2">
            <Link
              href="/pricing"
              className={`block w-full text-center bg-gradient-to-r ${tier.color} text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity`}
            >
              View Plans & Upgrade
            </Link>
            <button
              onClick={onClose}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}