'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Download, Trash2, Shield, FileText, Clock, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function GDPRPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [exportRequests, setExportRequests] = useState<any[]>([])
  const [retentionRequests, setRetentionRequests] = useState<any[]>([])
  const [consents, setConsents] = useState<any>({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }
      setUser(user)
      await loadGDPRData()
      setLoading(false)
    }
    init()
  }, [router, supabase])

  const loadGDPRData = async () => {
    try {
      // Load export requests
      const { data: exports } = await supabase
        .from('data_exports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      
      setExportRequests(exports || [])

      // Load retention requests
      const { data: retention } = await supabase
        .from('data_retention_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      
      setRetentionRequests(retention || [])

      // Load consents
      const { data: consentData } = await supabase
        .from('gdpr_consents')
        .select('*')
      
      const consentMap = (consentData || []).reduce((acc: any, consent: any) => {
        acc[consent.consent_type] = consent.consented
        return acc
      }, {})
      
      setConsents(consentMap)
    } catch (error) {
      console.error('Failed to load GDPR data:', error)
    }
  }

  const requestDataExport = async () => {
    try {
      const { error } = await supabase
        .from('data_exports')
        .insert({
          user_id: user.id,
          export_type: 'full',
          status: 'pending'
        })
      
      if (error) throw error
      
      toast.success('Data export requested. You will receive an email when ready.')
      await loadGDPRData()
    } catch (error) {
      console.error('Export request failed:', error)
      toast.error('Failed to request data export')
    }
  }

  const requestAccountDeletion = async () => {
    try {
      const { error } = await supabase
        .from('data_retention_requests')
        .insert({
          user_id: user.id,
          request_type: 'deletion',
          status: 'pending'
        })
      
      if (error) throw error
      
      toast.success('Account deletion requested. This will be processed within 30 days.')
      setShowDeleteConfirm(false)
      await loadGDPRData()
    } catch (error) {
      console.error('Deletion request failed:', error)
      toast.error('Failed to request account deletion')
    }
  }

  const updateConsent = async (consentType: string, consented: boolean) => {
    try {
      const { error } = await supabase
        .from('gdpr_consents')
        .upsert({
          user_id: user.id,
          consent_type: consentType,
          consented,
          consent_date: new Date().toISOString(),
          ip_address: '0.0.0.0', // Would be actual IP in production
          user_agent: navigator.userAgent
        })
      
      if (error) throw error
      
      setConsents(prev => ({ ...prev, [consentType]: consented }))
      toast.success('Consent preferences updated')
    } catch (error) {
      console.error('Consent update failed:', error)
      toast.error('Failed to update consent')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Data Rights & Privacy</h1>
          </div>
          <p className="text-gray-600">
            Manage your data rights under GDPR and other privacy regulations. 
            You have full control over your personal information.
          </p>
        </div>

        {/* Data Export Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Download className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Data Export</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Download a complete copy of all your data in JSON format.
          </p>
          
          <button
            onClick={requestDataExport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Request Data Export
          </button>

          {exportRequests.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-3">Recent Export Requests</h3>
              <div className="space-y-2">
                {exportRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {new Date(request.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === 'ready' ? 'bg-green-100 text-green-800' :
                      request.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Consent Management */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Consent Management</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Control how we process your data for different purposes.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Data Processing</h3>
                <p className="text-sm text-gray-600">Essential for providing core platform features</p>
              </div>
              <div className="text-sm text-gray-500">Required</div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">Help us improve the platform with usage analytics</p>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={consents.analytics || false}
                  onChange={(e) => updateConsent('analytics', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Allow</span>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Marketing Communications</h3>
                <p className="text-sm text-gray-600">Receive helpful tips and platform updates</p>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={consents.marketing || false}
                  onChange={(e) => updateConsent('marketing', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Allow</span>
              </label>
            </div>
          </div>
        </div>

        {/* Account Deletion */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">Account Deletion</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Request Account Deletion
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-medium text-red-900 mb-2">Confirm Account Deletion</h3>
              <p className="text-sm text-red-700 mb-4">
                This will permanently delete your account and all data within 30 days. 
                Are you sure you want to proceed?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={requestAccountDeletion}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Yes, Delete My Account
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {retentionRequests.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-3">Deletion Requests</h3>
              <div className="space-y-2">
                {retentionRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {request.request_type} - {new Date(request.requested_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === 'completed' ? 'bg-green-100 text-green-800' :
                      request.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Legal Links */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            For more information, see our{' '}
            <a href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a>
            {' '}and{' '}
            <a href="/terms" className="text-indigo-600 hover:underline">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  )
}