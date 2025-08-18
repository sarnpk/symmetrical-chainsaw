# Reclaim Platform - Technical Requirements & Stack

## Project Overview
Reclaim Platform is a specialized digital recovery tool designed specifically for survivors of narcissistic abuse. Think of it as a secure, private journal combined with an AI-powered therapist assistant that helps people document their experiences, understand patterns, and heal from emotional trauma.

## Recommended Tech Stack (Updated)

### Why Progressive Web App (PWA) Instead of Native Android?
- **Faster Development**: Single codebase works on all platforms
- **No App Store Delays**: Direct deployment, no approval process  
- **Native-like Features**: Push notifications, offline support, camera access
- **Easy Updates**: Instant deployment without user downloads
- **Cost Effective**: One team, one codebase

### Frontend Stack
- **Next.js 14** with App Router (React framework)
- **TypeScript** for type safety and better development experience
- **Tailwind CSS** for rapid, responsive styling
- **PWA Configuration** for mobile app-like experience
- **Service Workers** for offline functionality and push notifications

### Backend & Services
- **Supabase** (PostgreSQL database + real-time + auth + storage)
- **Supabase Edge Functions** for serverless API endpoints
- **Google Gemini AI** integration for chat support and pattern analysis
- **Supabase Storage** for secure photo/audio file management

### Mobile Features via Web APIs
- **Camera API** for photo capture
- **MediaRecorder API** for audio recording  
- **Push Notifications** via Service Workers
- **Install Prompt** for home screen installation
- **Offline Support** with cached data 

 i already setup supbase sas database here 
go throu

SUPABASE_URL=https://gstiokcvqmxiaqzmtzmv.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdGlva2N2cW14aWFxem10em12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzODQ0ODYsImV4cCI6MjA3MDk2MDQ4Nn0.HuQueaqGWoU6Hn6Z51HUDspMOZek85aRWgZXxKfPSrM
Access key IDb8db3cfa02ad71d524e84bd6d2e8009ae5b04720f2ebfe54c12a763ab55baecb

secret:b8db3cfa02ad71d524e84bd6d2e8009ae5b04720f2ebfe54c12a763ab55baecb 

end point :https://gstiokcvqmxiaqzmtzmv.storage.supabase.co/storage/v1/s3




Core Features
📝 Experience Documentation
Experience Journal: Users can document potential abusive experience with detailed descriptions, type of beavhior , safty & impact date, and times, a draft mode 
Multiple Photo upload Evidence with timestamp: Upload and caption photos as evidence with secure storage
Multile Audio Recording with Ai Trasncription from Galdia api: Record audio evidence and get automatic transcriptions
 per audio recorded 
 Safety Ratings: Rate how safe you felt during each incident (1-5 scale) with emojis or modes
Behavior Classification: Categorize different types of narcissistic abuse (gaslighting, love bombing, iresposbavukuty,etc
it should also have ability for editing experience and draft mode including a view mode where expeirnce can be seen with picture ,audio convsration trascnription that are assoicated with experiance in a meaning full and impact full way 

Pattern Analysis: AI analyzes your documented incidents to identify abuse patterns and cycles
Mind Reset Tool: AI helps reframe negative thoughts and provides coping strategies
Grey Rock Simulator: Practice the "grey rock" technique (being boring to avoid conflict) with AI feedback

🤖 AI-Powered Support
AI Coach: Chat with an AI trained specifically on narcissistic abuse recovery using google Ai Sutidso Gemmni Free MOdel

🛡️ Safety & Boundaries
Boundary Builder: Create and track personal boundaries with templates
Safety Planning: Emergency preparedness tools and crisis resources
Secure Storage: All data is encrypted and privately stored
📊 Analytics & Insights
Pattern Recognition: Visual charts showing incident frequency and types
Emotional Tracking: Monitor emotional states before and after incidents
Progress Reports: Generate professional reports for legal or therapeutic use
Export Options: Download your data in various formats
💰 Subscription Tiers
Foundation (Free): Basic incident logging and educational content
Recovery ($19.99/month): AI features with usage limits
Empowerment ($39.99/month): Advanced AI and comprehensive tools
Who It's For
Primary Users: People recovering from narcissistic abuse relationships or evaluationg if they are in abusive realtion
Secondary Users: Friends and family supporting survivors
Professional Users: Therapists, lawyers, and advocates working with abuse survivors
Key Benefits
Validation: Helps users recognize and validate their experiences
Evidence Collection: Creates legally admissible documentation
Pattern Recognition: Identifies cycles and escalation patterns
Healing Support: Provides AI-guided recovery tools and coping strategies
Safety Planning: Helps users plan for their safety and well-being
Professional Quality: Trauma-informed design with clinical-grade security