'use client'

import { redirect } from 'next/navigation'

export default function AuthPage() {
  // Redirect to home page where the auth modal can be triggered
  redirect('/')
}
