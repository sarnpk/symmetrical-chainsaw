'use client'

import { useState, useEffect } from 'react'
import {
  Shield,
  Phone,
  MapPin,
  AlertTriangle,
  Edit,
  Plus,
  Trash2,
  X,
  ExternalLink
} from 'lucide-react'
import ProtectedInformation from '@/components/ProtectedInformation'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface EmergencyContact {
  id: string
  name: string
  phone: string
  relationship: string
  available_times: string
}

interface SafeLocation {
  id: string
  name: string
  address: string
  contact_person: string
  phone: string
  notes: string
}

const emergencyResources = [
  {
    name: 'National Domestic Violence Hotline',
    phone: '1-800-799-7233',
    description: '24/7 confidential support',
    website: 'thehotline.org'
  },
  {
    name: 'Crisis Text Line',
    phone: 'Text HOME to 741741',
    description: '24/7 crisis support via text',
    website: 'crisistextline.org'
  },
  {
    name: 'National Suicide Prevention Lifeline',
    phone: '988',
    description: '24/7 suicide prevention support',
    website: 'suicidepreventionlifeline.org'
  },
  {
    name: 'Emergency Services',
    phone: '911',
    description: 'Immediate emergency assistance',
    website: null
  }
]

interface SafetyPlanContentProps {
  userId: string
}

export default function SafetyPlanContentSimplified({ userId }: SafetyPlanContentProps) {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([])
  const [safeLocations, setSafeLocations] = useState<SafeLocation[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const [showContactForm, setShowContactForm] = useState(false)
  const [showLocationForm, setShowLocationForm] = useState(false)
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null)
  const [editingLocation, setEditingLocation] = useState<SafeLocation | null>(null)

  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    relationship: '',
    available_times: ''
  })

  const [locationForm, setLocationForm] = useState({
    name: '',
    address: '',
    contact_person: '',
    phone: '',
    notes: ''
  })

  // Additional safety plan fields
  const [importantDocsInput, setImportantDocsInput] = useState('') // comma-separated
  interface FinancialResources {
    emergency_fund?: number
    trusted_contact?: { name?: string; phone?: string }
    accounts?: Array<{ institution?: string; last4?: string }>
    notes?: string
  }
  interface EscapePlan { code_word?: string; safe_bag_location?: string; steps?: string[] }
  interface SupportContact { role?: string; name: string; organization?: string; phone?: string; email?: string; notes?: string }
  const [financialResources, setFinancialResources] = useState<FinancialResources>({})
  const [escapePlan, setEscapePlan] = useState<EscapePlan>({ steps: [] })
  const [professionalSupport, setProfessionalSupport] = useState<SupportContact[]>([])
  // transient inputs
  const [newAccount, setNewAccount] = useState<{ institution: string; last4: string }>({ institution: '', last4: '' })
  const [newStep, setNewStep] = useState('')
  const [newSupport, setNewSupport] = useState<SupportContact>({ role: 'Therapist', name: '', phone: '', email: '' })
  const [lastReviewed, setLastReviewed] = useState<string | null>(null)
  const [reviewFrequencyDays, setReviewFrequencyDays] = useState<number>(30)
  const [showFinancialHelp, setShowFinancialHelp] = useState(false)
  const [showEscapeHelp, setShowEscapeHelp] = useState(false)
  const [showReminder, setShowReminder] = useState(true)

  // Derived reminder state
  const nowMs = Date.now()
  const lastMs = lastReviewed ? new Date(lastReviewed).getTime() : null
  const nextDueMs = (lastMs !== null && Number.isFinite(reviewFrequencyDays))
    ? lastMs + reviewFrequencyDays * 24 * 60 * 60 * 1000
    : null
  const isOverdue = lastMs === null || (nextDueMs !== null && nowMs > nextDueMs)
  const overdueDays = (isOverdue && nextDueMs !== null)
    ? Math.max(0, Math.floor((nowMs - nextDueMs) / (24 * 60 * 60 * 1000)))
    : null

  // Helpers for Financial Resources
  const addAccount = () => {
    if (!newAccount.institution.trim() || !newAccount.last4.trim()) return
    setFinancialResources(fr => ({
      ...fr,
      accounts: [...(fr.accounts || []), { ...newAccount }],
    }))
    setNewAccount({ institution: '', last4: '' })
  }
  const removeAccount = (idx: number) => {
    setFinancialResources(fr => ({
      ...fr,
      accounts: (fr.accounts || []).filter((_, i) => i !== idx),
    }))
  }

  // Helpers for Escape Plan
  const addStep = () => {
    if (!newStep.trim()) return
    setEscapePlan(ep => ({ ...ep, steps: [ ...(ep.steps || []), newStep.trim() ] }))
    setNewStep('')
  }
  const removeStep = (idx: number) => {
    setEscapePlan(ep => ({ ...ep, steps: (ep.steps || []).filter((_, i) => i !== idx) }))
  }

  // Helpers for Professional Support
  const addSupport = () => {
    if (!newSupport.name?.trim()) return
    setProfessionalSupport(list => ([ ...list, { ...newSupport } ]))
    setNewSupport({ role: 'Therapist', name: '', phone: '', email: '' })
  }
  const removeSupport = (idx: number) => {
    setProfessionalSupport(list => list.filter((_, i) => i !== idx))
  }

  const addOrUpdateContact = async () => {
    try {
      let next: EmergencyContact[]
      if (editingContact) {
        next = emergencyContacts.map(c => c.id === editingContact.id ? { ...contactForm, id: editingContact.id } as EmergencyContact : c)
      } else {
        const newItem: EmergencyContact = { id: crypto.randomUUID(), ...contactForm }
        next = [...emergencyContacts, newItem]
      }
      const { error } = await supabase
        .from('safety_plans')
        .update({ emergency_contacts: next })
        .eq('user_id', userId)
      if (error) throw error
      setEmergencyContacts(next)
      toast.success(editingContact ? 'Contact updated' : 'Contact added')
      resetContactForm()
    } catch (e: any) {
      toast.error(e.message || 'Failed to save contact')
    }
  }

  const addOrUpdateLocation = async () => {
    try {
      let next: SafeLocation[]
      if (editingLocation) {
        next = safeLocations.map(l => l.id === editingLocation.id ? { ...locationForm, id: editingLocation.id } as SafeLocation : l)
      } else {
        const newItem: SafeLocation = { id: crypto.randomUUID(), ...locationForm }
        next = [...safeLocations, newItem]
      }
      const { error } = await supabase
        .from('safety_plans')
        .update({ safe_locations: next })
        .eq('user_id', userId)
      if (error) throw error
      setSafeLocations(next)
      toast.success(editingLocation ? 'Location updated' : 'Location added')
      resetLocationForm()
    } catch (e: any) {
      toast.error(e.message || 'Failed to save location')
    }
  }

  const resetContactForm = () => {
    setContactForm({ name: '', phone: '', relationship: '', available_times: '' })
    setEditingContact(null)
    setShowContactForm(false)
  }

  const resetLocationForm = () => {
    setLocationForm({ name: '', address: '', contact_person: '', phone: '', notes: '' })
    setEditingLocation(null)
    setShowLocationForm(false)
  }

  const editContact = (contact: EmergencyContact) => {
    setContactForm({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      available_times: contact.available_times
    })
    setEditingContact(contact)
    setShowContactForm(true)
  }

  const editLocation = (location: SafeLocation) => {
    setLocationForm({
      name: location.name,
      address: location.address,
      contact_person: location.contact_person,
      phone: location.phone,
      notes: location.notes
    })
    setEditingLocation(location)
    setShowLocationForm(true)
  }

  const deleteContact = async (id: string) => {
    try {
      const next = emergencyContacts.filter(c => c.id !== id)
      const { error } = await supabase
        .from('safety_plans')
        .update({ emergency_contacts: next })
        .eq('user_id', userId)
      if (error) throw error
      setEmergencyContacts(next)
      toast.success('Contact deleted')
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete contact')
    }
  }

  const deleteLocation = async (id: string) => {
    try {
      const next = safeLocations.filter(l => l.id !== id)
      const { error } = await supabase
        .from('safety_plans')
        .update({ safe_locations: next })
        .eq('user_id', userId)
      if (error) throw error
      setSafeLocations(next)
      toast.success('Location deleted')
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete location')
    }
  }

  // Load existing data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Ensure a row exists
        const { data, error } = await supabase
          .from('safety_plans')
          .select('id, user_id, emergency_contacts, safe_locations, important_documents, financial_resources, escape_plan, professional_support, last_reviewed, review_frequency_days')
          .eq('user_id', userId)
          .maybeSingle()
        if (error) throw error

        if (!data) {
          const { data: created, error: insertErr } = await supabase
            .from('safety_plans')
            .insert({ user_id: userId, emergency_contacts: [], safe_locations: [], important_documents: [], financial_resources: {}, escape_plan: {}, professional_support: [], last_reviewed: new Date().toISOString(), review_frequency_days: 30 })
            .select('id, emergency_contacts, safe_locations, important_documents, financial_resources, escape_plan, professional_support, last_reviewed, review_frequency_days')
            .single()
          if (insertErr) throw insertErr
          setEmergencyContacts((created?.emergency_contacts || []) as EmergencyContact[])
          setSafeLocations((created?.safe_locations || []) as SafeLocation[])
          setImportantDocsInput(((created?.important_documents || []) as string[]).join(', '))
          setFinancialResources((created?.financial_resources || {}) as FinancialResources)
          setEscapePlan((created?.escape_plan || {}) as EscapePlan)
          setProfessionalSupport(Array.isArray(created?.professional_support) ? (created?.professional_support as SupportContact[]) : (created?.professional_support && typeof created?.professional_support === 'object' ? Object.values(created?.professional_support as Record<string, any>) as SupportContact[] : []))
          setLastReviewed(created?.last_reviewed || null)
          setReviewFrequencyDays((created?.review_frequency_days as number) ?? 30)
        } else {
          setEmergencyContacts((data.emergency_contacts || []) as EmergencyContact[])
          setSafeLocations((data.safe_locations || []) as SafeLocation[])
          setImportantDocsInput(((data.important_documents || []) as string[]).join(', '))
          setFinancialResources((data.financial_resources || {}) as FinancialResources)
          setEscapePlan((data.escape_plan || {}) as EscapePlan)
          setProfessionalSupport(Array.isArray(data.professional_support) ? (data.professional_support as SupportContact[]) : (data.professional_support && typeof data.professional_support === 'object' ? Object.values(data.professional_support as Record<string, any>) as SupportContact[] : []))
          setLastReviewed(data.last_reviewed || null)
          setReviewFrequencyDays((data.review_frequency_days as number) ?? 30)
        }
      } catch (e: any) {
        toast.error(e.message || 'Failed to load safety plan data')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [supabase, userId])

  // Save handlers for additional fields
  const saveImportantDocuments = async () => {
    try {
      const docs = importantDocsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
      const { error } = await supabase
        .from('safety_plans')
        .update({ important_documents: docs })
        .eq('user_id', userId)
      if (error) throw error
      toast.success('Important documents updated')
    } catch (e: any) {
      toast.error(e.message || 'Failed to save documents')
    }
  }

  const saveFinancialResources = async () => {
    try {
      const { error } = await supabase
        .from('safety_plans')
        .update({ financial_resources: financialResources })
        .eq('user_id', userId)
      if (error) throw error
      toast.success('Financial resources saved')
    } catch (e: any) {
      toast.error(e.message || 'Failed to save financial resources')
    }
  }

  const saveEscapePlan = async () => {
    try {
      const { error } = await supabase
        .from('safety_plans')
        .update({ escape_plan: escapePlan })
        .eq('user_id', userId)
      if (error) throw error
      toast.success('Escape plan saved')
    } catch (e: any) {
      toast.error(e.message || 'Failed to save escape plan')
    }
  }

  const saveProfessionalSupport = async () => {
    try {
      const { error } = await supabase
        .from('safety_plans')
        .update({ professional_support: professionalSupport })
        .eq('user_id', userId)
      if (error) throw error
      toast.success('Professional support saved')
    } catch (e: any) {
      toast.error(e.message || 'Failed to save professional support')
    }
  }

  const markReviewed = async () => {
    try {
      const now = new Date().toISOString()
      const { error } = await supabase
        .from('safety_plans')
        .update({ last_reviewed: now })
        .eq('user_id', userId)
      if (error) throw error
      setLastReviewed(now)
      toast.success('Marked as reviewed')
    } catch (e: any) {
      toast.error(e.message || 'Failed to mark reviewed')
    }
  }

  const saveReviewFrequency = async () => {
    try {
      const { error } = await supabase
        .from('safety_plans')
        .update({ review_frequency_days: reviewFrequencyDays })
        .eq('user_id', userId)
      if (error) throw error
      toast.success('Review frequency saved')
    } catch (e: any) {
      toast.error(e.message || 'Failed to save review frequency')
    }
  }

  const generatePDF = () => {
    const docs = importantDocsInput.split(',').map(s => s.trim()).filter(Boolean)
    
    let content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Safety Plan</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #dc2626; border-bottom: 3px solid #dc2626; padding-bottom: 10px; }
    h2 { color: #1f2937; margin-top: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
    h3 { color: #374151; margin-top: 20px; }
    .section { margin-bottom: 30px; page-break-inside: avoid; }
    .resource { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; margin: 10px 0; border-radius: 8px; }
    .contact { background: #f9fafb; border: 1px solid #e5e7eb; padding: 15px; margin: 10px 0; border-radius: 8px; }
    .location { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; margin: 10px 0; border-radius: 8px; }
    ul { margin: 10px 0; padding-left: 20px; }
    li { margin: 5px 0; }
    .phone { font-family: monospace; font-weight: bold; color: #2563eb; }
    .label { font-weight: bold; color: #4b5563; }
    .step { background: #f3f4f6; padding: 10px; margin: 5px 0; border-left: 4px solid #6366f1; }
  </style>
</head>
<body>
  <h1>🛡️ Safety Plan</h1>
  <p><em>Generated: ${new Date().toLocaleString()}</em></p>
  
  <div class="section">
    <h2>🚨 Crisis Resources</h2>
    ${emergencyResources.map(r => `
      <div class="resource">
        <h3>${r.name}</h3>
        <p class="phone">${r.phone}</p>
        <p>${r.description}</p>
        ${r.website ? `<p>Website: ${r.website}</p>` : ''}
      </div>
    `).join('')}
  </div>

  ${emergencyContacts.length > 0 ? `
  <div class="section">
    <h2>📞 Emergency Contacts</h2>
    ${emergencyContacts.map(c => `
      <div class="contact">
        <h3>${c.name}</h3>
        <p class="phone">${c.phone}</p>
        <p><span class="label">Relationship:</span> ${c.relationship}</p>
        <p><span class="label">Available:</span> ${c.available_times}</p>
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${safeLocations.length > 0 ? `
  <div class="section">
    <h2>📍 Safe Locations</h2>
    ${safeLocations.map(l => `
      <div class="location">
        <h3>${l.name}</h3>
        <p><span class="label">Address:</span> ${l.address}</p>
        <p><span class="label">Contact:</span> ${l.contact_person} • ${l.phone}</p>
        ${l.notes ? `<p><span class="label">Notes:</span> ${l.notes}</p>` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${docs.length > 0 ? `
  <div class="section">
    <h2>📄 Important Documents</h2>
    <ul>
      ${docs.map(d => `<li>${d}</li>`).join('')}
    </ul>
  </div>
  ` : ''}

  ${(financialResources.emergency_fund || financialResources.trusted_contact?.name || (financialResources.accounts && financialResources.accounts.length > 0)) ? `
  <div class="section">
    <h2>💰 Financial Resources</h2>
    ${financialResources.emergency_fund ? `<p><span class="label">Emergency Fund:</span> $${financialResources.emergency_fund}</p>` : ''}
    ${financialResources.trusted_contact?.name ? `
      <p><span class="label">Trusted Contact:</span> ${financialResources.trusted_contact.name}
      ${financialResources.trusted_contact.phone ? ` • ${financialResources.trusted_contact.phone}` : ''}</p>
    ` : ''}
    ${financialResources.accounts && financialResources.accounts.length > 0 ? `
      <h3>Accounts</h3>
      <ul>
        ${financialResources.accounts.map(a => `<li>${a.institution} • ****${a.last4}</li>`).join('')}
      </ul>
    ` : ''}
    ${financialResources.notes ? `<p><span class="label">Notes:</span> ${financialResources.notes}</p>` : ''}
  </div>
  ` : ''}

  ${(escapePlan.code_word || escapePlan.safe_bag_location || (escapePlan.steps && escapePlan.steps.length > 0)) ? `
  <div class="section">
    <h2>🚪 Escape Plan</h2>
    ${escapePlan.code_word ? `<p><span class="label">Code Word:</span> ${escapePlan.code_word}</p>` : ''}
    ${escapePlan.safe_bag_location ? `<p><span class="label">Safe Bag Location:</span> ${escapePlan.safe_bag_location}</p>` : ''}
    ${escapePlan.steps && escapePlan.steps.length > 0 ? `
      <h3>Steps</h3>
      ${escapePlan.steps.map((s, i) => `<div class="step">${i + 1}. ${s}</div>`).join('')}
    ` : ''}
  </div>
  ` : ''}

  ${professionalSupport.length > 0 ? `
  <div class="section">
    <h2>👥 Professional Support</h2>
    ${professionalSupport.map(ps => `
      <div class="contact">
        <h3>${ps.role || 'Support'} — ${ps.name}</h3>
        ${ps.organization ? `<p><span class="label">Organization:</span> ${ps.organization}</p>` : ''}
        ${ps.phone ? `<p class="phone">${ps.phone}</p>` : ''}
        ${ps.email ? `<p>${ps.email}</p>` : ''}
        ${ps.notes ? `<p><span class="label">Notes:</span> ${ps.notes}</p>` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="section">
    <h2>📅 Review Information</h2>
    <p><span class="label">Last Reviewed:</span> ${lastReviewed ? new Date(lastReviewed).toLocaleString() : 'Never'}</p>
    <p><span class="label">Review Frequency:</span> Every ${reviewFrequencyDays} days</p>
  </div>

  <p style="margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px;">
    Keep this document in a secure location. Update regularly.
  </p>
</body>
</html>
    `

    const blob = new Blob([content], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `safety-plan-${new Date().toISOString().split('T')[0]}.html`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Safety plan exported! Open the file and use your browser to print as PDF.')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-red-600" />
          Safety Plan
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Essential safety resources and contacts for crisis situations. Keep this information easily accessible.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={generatePDF}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100"
            aria-label="Export this safety plan as PDF"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          /* Hide everything except safety plan content */
          body { background: #fff !important; }
          nav, header, footer, aside { display: none !important; }
          .no-print { display: none !important; }
          button { display: none !important; }
          
          /* Hide navigation, sidebar, and UI elements */
          [class*="sidebar"] { display: none !important; }
          [class*="nav"] { display: none !important; }
          [class*="menu"] { display: none !important; }
          [role="navigation"] { display: none !important; }
          
          /* Clean up styling for print */
          .shadow-sm, .shadow-md, .shadow-lg { box-shadow: none !important; }
          .bg-red-50, .bg-blue-50, .bg-green-50, .bg-amber-50, .bg-yellow-50, .bg-indigo-50 { 
            background: #fff !important; 
          }
          .border { border-color: #ddd !important; }
          a[href^="#"] { display: none !important; }
          
          /* Ensure content takes full width */
          .max-w-6xl, .max-w-4xl, .max-w-3xl { max-width: 100% !important; }
          .container { max-width: 100% !important; padding: 0 !important; }
          
          /* Page breaks */
          .space-y-8 > div { page-break-inside: avoid; }
          h1, h2, h3 { page-break-after: avoid; }
        }
      `}</style>

      {/* Review Reminder Banner */}
      {showReminder && isOverdue && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 no-print">
          <div className="text-sm text-amber-900">
            {lastReviewed ? (
              <>
                <span className="font-medium">Reminder:</span> Your safety plan review is overdue{overdueDays !== null && overdueDays > 0 ? ` by ${overdueDays} day${overdueDays === 1 ? '' : 's'}` : ''}.
              </>
            ) : (
              <>
                <span className="font-medium">Reminder:</span> You haven’t marked this plan as reviewed yet. Set your cadence and mark it reviewed.
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <a href="#review-cadence" className="px-3 py-2 text-amber-900 border border-amber-300 rounded-lg hover:bg-amber-100 text-sm">Review settings</a>
            <button onClick={markReviewed} className="px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm">Mark Reviewed</button>
            <button onClick={() => setShowReminder(false)} className="px-3 py-2 text-amber-900 hover:text-amber-950 text-sm">Dismiss</button>
          </div>
        </div>
      )}

      {/* Important Documents */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Important Documents</h2>
        <p className="text-sm text-gray-600 mb-2">Comma-separated list (e.g., ID, Passport, Insurance Card)</p>
        <input
          type="text"
          value={importantDocsInput}
          onChange={(e) => setImportantDocsInput(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
          placeholder="ID, Insurance, Legal Order"
        />
        <div className="flex flex-col md:flex-row md:justify-end gap-2 mt-3">
          <button onClick={saveImportantDocuments} className="bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-black w-full md:w-auto">Save</button>
        </div>
      </div>

      {/* Financial Resources */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">Financial Resources</h2>
          <button
            type="button"
            onClick={() => setShowFinancialHelp(v => !v)}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >{showFinancialHelp ? 'Hide help' : 'Show help'}</button>
        </div>
        {showFinancialHelp && (
          <div className="mb-4 rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
            <p className="mb-2"><span className="font-medium">Tips:</span> Plan access to funds and accounts you may need quickly.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Emergency fund amount (e.g., 200)</li>
              <li>Trusted person who can hold or transfer money</li>
              <li>Key accounts (bank, prepaid cards) and last 4 digits</li>
              <li>Notes: ATM locations, daily limits, backup cash spots</li>
            </ul>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Emergency Fund (amount)</label>
            <input
              type="number"
              min={0}
              value={financialResources.emergency_fund ?? ''}
              onChange={(e) => setFinancialResources(fr => ({ ...fr, emergency_fund: Number(e.target.value || 0) }))}
              placeholder="e.g., 200"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Trusted Contact Name</label>
            <input
              type="text"
              value={financialResources.trusted_contact?.name ?? ''}
              onChange={(e) => setFinancialResources(fr => ({ ...fr, trusted_contact: { ...(fr.trusted_contact || {}), name: e.target.value } }))}
              placeholder="e.g., Aunt Sarah"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <label className="block text-sm text-gray-700 mb-1 mt-2">Trusted Contact Phone</label>
            <input
              type="tel"
              value={financialResources.trusted_contact?.phone ?? ''}
              onChange={(e) => setFinancialResources(fr => ({ ...fr, trusted_contact: { ...(fr.trusted_contact || {}), phone: e.target.value } }))}
              placeholder="e.g., (555) 123-4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">Accounts</label>
            <div className="flex gap-2 mb-2 flex-col sm:flex-row">
              <input
                type="text"
                placeholder="Institution (e.g., Chase)"
                value={newAccount.institution}
                onChange={(e) => setNewAccount(a => ({ ...a, institution: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Last 4 digits (e.g., 1234)"
                value={newAccount.last4}
                onChange={(e) => setNewAccount(a => ({ ...a, last4: e.target.value }))}
                className="w-full sm:w-36 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button onClick={addAccount} className="bg-gray-800 text-white px-4 py-3 rounded-lg w-full sm:w-auto">Add</button>
            </div>
            <ul className="space-y-2">
              {(financialResources.accounts || []).map((acc, idx) => (
                <li key={idx} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm text-gray-700 break-words">{acc.institution} • ****{acc.last4}</span>
                  <button onClick={() => removeAccount(idx)} className="text-red-600 hover:text-red-700 p-1"><Trash2 className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">Notes</label>
            <textarea
              value={financialResources.notes ?? ''}
              onChange={(e) => setFinancialResources(fr => ({ ...fr, notes: e.target.value }))}
              placeholder="ATM nearby: 123 Main St. Daily limit $300. Keep $20 cash in wallet."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:justify-end gap-2 mt-3">
          <button onClick={saveFinancialResources} className="bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-black w-full md:w-auto">Save</button>
        </div>
      </div>

      {/* Escape Plan */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">Escape Plan</h2>
          <button
            type="button"
            onClick={() => setShowEscapeHelp(v => !v)}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >{showEscapeHelp ? 'Hide help' : 'Show help'}</button>
        </div>
        {showEscapeHelp && (
          <div className="mb-4 rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
            <p className="mb-2"><span className="font-medium">Tips:</span> Make concrete, easy-to-follow steps.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Choose a code word (e.g., "Sunrise")</li>
              <li>Decide where your go-bag is stored</li>
              <li>Steps: grab bag, text code word, go to safe location, call support</li>
            </ul>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Code word</label>
            <input
              type="text"
              value={escapePlan.code_word ?? ''}
              onChange={(e) => setEscapePlan(ep => ({ ...ep, code_word: e.target.value }))}
              placeholder="e.g., Sunrise"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Safe bag location</label>
            <input
              type="text"
              value={escapePlan.safe_bag_location ?? ''}
              onChange={(e) => setEscapePlan(ep => ({ ...ep, safe_bag_location: e.target.value }))}
              placeholder="e.g., Closet top shelf"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">Steps</label>
            <div className="flex gap-2 mb-2 flex-col sm:flex-row">
              <input
                type="text"
                placeholder="Add a step (e.g., Text code word to Jane)"
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button onClick={addStep} className="bg-gray-800 text-white px-4 py-3 rounded-lg w-full sm:w-auto">Add</button>
            </div>
            <ul className="space-y-2">
              {(escapePlan.steps || []).map((s, idx) => (
                <li key={idx} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm text-gray-700 break-words">{s}</span>
                  <button onClick={() => removeStep(idx)} className="text-red-600 hover:text-red-700 p-1"><Trash2 className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:justify-end gap-2 mt-3">
          <button onClick={saveEscapePlan} className="bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-black w-full md:w-auto">Save</button>
        </div>
      </div>

      {/* Professional Support */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Support</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Role (Therapist, Advocate)"
              value={newSupport.role || ''}
              onChange={(e) => setNewSupport(s => ({ ...s, role: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Name"
              value={newSupport.name}
              onChange={(e) => setNewSupport(s => ({ ...s, name: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Organization"
              value={newSupport.organization || ''}
              onChange={(e) => setNewSupport(s => ({ ...s, organization: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={newSupport.phone || ''}
              onChange={(e) => setNewSupport(s => ({ ...s, phone: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="email"
              placeholder="Email"
              value={newSupport.email || ''}
              onChange={(e) => setNewSupport(s => ({ ...s, email: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Notes"
              value={newSupport.notes || ''}
              onChange={(e) => setNewSupport(s => ({ ...s, notes: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <div className="md:col-span-3 flex flex-col md:flex-row md:justify-end gap-2">
              <button onClick={addSupport} className="bg-gray-800 text-white px-4 py-3 rounded-lg w-full md:w-auto">Add</button>
            </div>
          </div>

          <ul className="space-y-2">
            {professionalSupport.map((ps, idx) => (
              <li key={idx} className="p-3 border rounded flex items-start justify-between gap-3">
                <div className="text-sm text-gray-700 break-words">
                  <div className="font-medium">{ps.role || 'Support'} — {ps.name}</div>
                  <div>{ps.organization}</div>
                  <div className="text-gray-600 break-words">{ps.phone} {ps.email && `• ${ps.email}`}</div>
                  {ps.notes && <div className="text-gray-500 break-words">{ps.notes}</div>}
                </div>
                <button onClick={() => removeSupport(idx)} className="text-red-600 hover:text-red-700 p-1"><Trash2 className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col md:flex-row md:justify-end gap-2 mt-3">
          <button onClick={saveProfessionalSupport} className="bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-black w-full md:w-auto">Save</button>
        </div>
      </div>

      {/* Review cadence */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        <h2 id="review-cadence" className="text-xl font-semibold text-gray-900 mb-4">Review Cadence</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Last reviewed</label>
            <input
              type="text"
              value={lastReviewed ? new Date(lastReviewed).toLocaleString() : 'Never'}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Review frequency (days)</label>
            <input
              type="number"
              min={1}
              value={reviewFrequencyDays}
              onChange={(e) => setReviewFrequencyDays(parseInt(e.target.value || '0', 10))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={saveReviewFrequency} className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black">Save Frequency</button>
            <button onClick={markReviewed} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Mark Reviewed</button>
          </div>
        </div>
      </div>

      {/* Crisis Resources */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 md:p-6">
        <div className="flex items-center mb-6">
          <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
          <h2 className="text-xl font-semibold text-red-900">Crisis Resources</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyResources.map((resource, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-red-200">
              <h3 className="font-semibold text-red-900 mb-1">{resource.name}</h3>
              <p className="text-red-700 font-mono text-lg mb-1">{resource.phone}</p>
              <p className="text-red-600 text-sm mb-2">{resource.description}</p>
              {resource.website && (
                <a 
                  href={`https://${resource.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  {resource.website}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Phone className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Emergency Contacts</h2>
          </div>
          <button
            onClick={() => setShowContactForm(true)}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Contact
          </button>
        </div>

        <div className="space-y-4">
          {emergencyContacts.map((contact) => (
            <div key={contact.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                <p className="text-blue-600 font-mono">{contact.phone}</p>
                <p className="text-sm text-gray-600">{contact.relationship} • Available: {contact.available_times}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => editContact(contact)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteContact(contact.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safe Locations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Safe Locations</h2>
          </div>
          <button
            onClick={() => setShowLocationForm(true)}
            className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Location
          </button>
        </div>

        <div className="space-y-4">
          {safeLocations.map((location) => (
            <div key={location.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">{location.name}</h3>
                <p className="text-gray-600 break-words">{location.address}</p>
                <p className="text-sm text-gray-600">Contact: {location.contact_person} • {location.phone}</p>
                {location.notes && <p className="text-sm text-gray-500 mt-1">{location.notes}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => editLocation(location)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteLocation(location.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingContact ? 'Edit Contact' : 'Add Emergency Contact'}
              </h3>
              <button
                onClick={resetContactForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                <input
                  type="text"
                  value={contactForm.relationship}
                  onChange={(e) => setContactForm({...contactForm, relationship: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Friend, Family, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Times</label>
                <input
                  type="text"
                  value={contactForm.available_times}
                  onChange={(e) => setContactForm({...contactForm, available_times: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Anytime, 9 AM - 5 PM, etc."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={resetContactForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addOrUpdateContact}
                  disabled={!contactForm.name.trim() || !contactForm.phone.trim()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {editingContact ? 'Update' : 'Add'} Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Form Modal */}
      {showLocationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingLocation ? 'Edit Location' : 'Add Safe Location'}
              </h3>
              <button
                onClick={resetLocationForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location Name</label>
                <input
                  type="text"
                  value={locationForm.name}
                  onChange={(e) => setLocationForm({...locationForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Friend's house, shelter, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={locationForm.address}
                  onChange={(e) => setLocationForm({...locationForm, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Full address"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                <input
                  type="text"
                  value={locationForm.contact_person}
                  onChange={(e) => setLocationForm({...locationForm, contact_person: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Person at this location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={locationForm.phone}
                  onChange={(e) => setLocationForm({...locationForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={locationForm.notes}
                  onChange={(e) => setLocationForm({...locationForm, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Special instructions, key location, etc."
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={resetLocationForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addOrUpdateLocation}
                  disabled={!locationForm.name.trim() || !locationForm.address.trim()}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {editingLocation ? 'Update' : 'Add'} Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Professional Support Integration */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200 p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            👥 Professional Support Available
          </h2>
          <p className="text-gray-700 text-sm">
            Your safety plan is comprehensive. Consider connecting with professionals 
            who can provide specialized support for your situation.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* Therapy Referral */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">🧠 Mental Health Support</h3>
            <p className="text-blue-700 mb-3 text-sm">
              Connect with trauma-informed therapists who understand narcissistic abuse recovery.
            </p>
            <button
              onClick={() => {
                const referralUrl = 'https://www.betterhelp.com/rpc/track/referral/?ref=reclaim_safety_plan&source=reclaim_app&specialty=trauma&utm_source=reclaim&utm_medium=referral&utm_campaign=safety_plan';
                window.open(referralUrl, '_blank', 'noopener,noreferrer');
              }}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 justify-center bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600 shadow-md hover:shadow-lg hover:scale-105 w-full text-sm"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              Find Therapist
            </button>
          </div>

          {/* Legal Referral */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
            <h3 className="font-semibold text-amber-900 mb-2">⚖️ Legal Protection</h3>
            <p className="text-amber-700 mb-3 text-sm">
              Your documented evidence can support legal action. Connect with family law attorneys.
            </p>
            <button
              onClick={() => {
                const referralUrl = 'https://www.avvo.com/find-a-lawyer/referral/?ref=reclaim_safety_plan&source=reclaim_app&specialty=domestic_violence&practice_area=family_law&utm_source=reclaim&utm_medium=legal_referral&utm_campaign=safety_plan&evidence_available=true';
                window.open(referralUrl, '_blank', 'noopener,noreferrer');
              }}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 justify-center bg-amber-600 hover:bg-amber-700 text-white border-2 border-amber-600 shadow-md hover:shadow-lg hover:scale-105 w-full text-sm"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Legal Consultation
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          Secure referrals • Specialized professionals • Confidential consultations
        </div>
      </div>

      {/* Protected Information Section */}
      <ProtectedInformation userId={userId} />
    </div>
  )
}
