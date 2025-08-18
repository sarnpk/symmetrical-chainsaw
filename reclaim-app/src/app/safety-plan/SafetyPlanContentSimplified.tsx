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
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      phone: '(555) 123-4567',
      relationship: 'Best Friend',
      available_times: 'Anytime'
    }
  ])

  const [safeLocations, setSafeLocations] = useState<SafeLocation[]>([
    {
      id: '1',
      name: 'Sarah\'s House',
      address: '123 Safe Street, City, State',
      contact_person: 'Sarah Johnson',
      phone: '(555) 123-4567',
      notes: 'Has spare key, knows situation'
    }
  ])

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

  const addOrUpdateContact = () => {
    if (editingContact) {
      setEmergencyContacts(contacts => 
        contacts.map(c => c.id === editingContact.id ? { ...contactForm, id: editingContact.id } : c)
      )
    } else {
      const newContact: EmergencyContact = {
        id: Date.now().toString(),
        ...contactForm
      }
      setEmergencyContacts(contacts => [...contacts, newContact])
    }
    resetContactForm()
  }

  const addOrUpdateLocation = () => {
    if (editingLocation) {
      setSafeLocations(locations => 
        locations.map(l => l.id === editingLocation.id ? { ...locationForm, id: editingLocation.id } : l)
      )
    } else {
      const newLocation: SafeLocation = {
        id: Date.now().toString(),
        ...locationForm
      }
      setSafeLocations(locations => [...locations, newLocation])
    }
    resetLocationForm()
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

  const deleteContact = (id: string) => {
    setEmergencyContacts(contacts => contacts.filter(c => c.id !== id))
  }

  const deleteLocation = (id: string) => {
    setSafeLocations(locations => locations.filter(l => l.id !== id))
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
      </div>

      {/* Crisis Resources */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Phone className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Emergency Contacts</h2>
          </div>
          <button
            onClick={() => setShowContactForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Safe Locations</h2>
          </div>
          <button
            onClick={() => setShowLocationForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
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
                <p className="text-gray-600">{location.address}</p>
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

      {/* Protected Information Section */}
      <ProtectedInformation userId={userId} />
    </div>
  )
}
