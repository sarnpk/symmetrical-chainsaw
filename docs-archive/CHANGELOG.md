# Changelog

All notable changes to the Reclaim app will be documented in this file.

## [Unreleased] - 2025-01-XX

### Added - Cognitive Dissonance Alerts, BIFF Enhancements & Landing Page Updates

#### 🧠 Cognitive Dissonance Alert System
- **New Feature**: AI-powered detection of conflicting beliefs across all journals
- Automatically scans journal entries, beliefs, gaslighting statements, and reality logs
- Identifies contradictory statements (e.g., "I'm worthless" vs "I deserve respect")
- Side-by-side comparison of conflicting entries with dates
- Severity levels (low, medium, high) for prioritization
- Dashboard widget showing top 2 active alerts
- Full page for managing all detected conflicts
- One-click dismiss or resolve functionality
- AI analysis using Gemini to explain conflicts
- Prevents duplicate alerts for same entry pairs
- Database table: `cognitive_dissonance_alerts`
- API endpoints: `/api/cognitive-dissonance/detect`, `/api/cognitive-dissonance/alerts`
- Component: `CognitiveDissonanceWidget.tsx`
- Page: `/cognitive-dissonance`

#### 💬 BIFF Assistant - Radical Non-Engagement Enhancements
- **Rebranded**: Now explicitly labeled as "Radical Non-Engagement Tool"
- **Engagement Metrics Dashboard**: Monthly success tracking showing:
  - Disengagement success rate (% of non-reactive responses)
  - JADE avoidance count (Justify, Argue, Defend, Explain)
  - Average response time in hours
  - High BIFF scores (7+ out of 10)
- **Response Time Tracking**: 
  - Captures timestamp when message received
  - Shows elapsed time since message
  - Displays ✅ when 24+ hours passed
  - Celebrates delayed responses as wins
- **Educational Content**: Explains BIFF = Radical Non-Engagement in practice
- **Database Enhancements**:
  - Added `response_time_hours` to track delay
  - Added `avoided_engagement` boolean flag
  - Added `engagement_notes` for user reflections
  - New `biff_engagement_metrics` table for monthly aggregates
- API endpoint: `/api/biff-assistant/metrics`
- Migration: `20250904_biff_engagement_tracking.sql`

#### 🎨 Landing Page Updates
- Added 6 new feature cards with "NEW" badges:
  - Cognitive Dissonance Alerts (amber)
  - BIFF Assistant / Radical Non-Engagement (indigo)
  - Gaslighting Truth Journal (red)
  - Reactive Abuse Tracker (purple)
  - Stonewalling Journal (gray)
  - No Contact Anchor (green)
- Updated hero section to highlight:
  - AI-powered cognitive dissonance detection
  - BIFF communication tools
  - Gaslighting evidence tracking
  - 70+ language support
- Color-coded feature cards for visual distinction

### Added - Reactive Abuse Journal & Stonewalling Improvements

#### 🆕 Reactive Abuse Journal
- **New Feature**: Complete Reactive Abuse Journal for tracking when concerns get turned against you
- Track DARVO (Deny, Attack, Reverse Victim & Offender) patterns
- Document victim reversal, counter-accusations, deflection, and gaslighting incidents
- Monitor apology rate (how often you end up apologizing for their behavior)
- Track boundary maintenance and issue resolution rates
- Inline form with edit functionality - no separate pages needed
- Export incidents to HTML report with statistics and pattern alerts
- Filter by reaction type (DARVO, Victim Reversal, Counter-Accusation, Deflection, Gaslighting)
- Comprehensive help guide explaining reactive abuse patterns
- Real-time explanations for each reaction type selection
- Sample placeholders in all form fields for better usability

#### 🔧 Stonewalling Journal Improvements
- **Redesigned**: Converted to professional single-page design with inline form
- Added **Intimacy Withdrawal** as a shutdown type
- Flexible duration input supporting minutes, hours, days, weeks, and months
- Smart duration display (shows "2 weeks" instead of "20160 minutes")
- Real-time explanations for each shutdown type selection
- Inline edit functionality - modify entries without leaving the page
- Filter by shutdown type (Silent Treatment, Physical Withdrawal, Topic Avoidance, Emotional Unavailability, Intimacy Withdrawal)
- Export to HTML report with summary statistics
- Visual badges for duration, impact level, and emotional state changes
- Info card explaining what stonewalling is

#### 🎨 UX/UI Improvements
- Consistent "Journal" terminology across all abuse tracking features
- Navigation labels shortened for better readability (e.g., "Stonewalling" instead of "Stonewalling Journal")
- Professional card-based layouts with hover effects
- Color-coded badges for quick visual scanning
- Responsive design optimized for mobile and desktop
- Help icons with links to comprehensive guides
- Empty state designs with clear call-to-action buttons

#### 📊 Export & Filtering
- HTML export for both Reactive Abuse and Stonewalling journals
- Exportable reports include:
  - Summary statistics
  - Pattern alerts for multiple incidents
  - Full incident timeline with details
  - Professional formatting for legal/therapeutic use
- Filter dropdowns showing count per type
- "No results" state when filters don't match any incidents

#### 📝 Database Schema
- New `reactive_abuse_incidents` table with comprehensive tracking fields
- New `reactive_abuse_patterns` table for aggregate analytics
- Row Level Security (RLS) policies for data protection
- Optimized indexes for performance

### Changed
- Stonewalling page converted from multi-page to single-page design
- Duration fields now support multiple time units instead of minutes only
- Form titles simplified ("Document Reactive Abuse" instead of "Document Reactive Abuse Incident")
- All "Log" terminology changed to "Journal" for consistency

### Technical Details
- API routes: `/api/reactive-abuse/export`, `/api/biff-assistant/metrics`, `/api/cognitive-dissonance/detect`, `/api/cognitive-dissonance/alerts`
- Database migrations: `20250832_reactive_abuse_tracker.sql`, `20250903_cognitive_dissonance_alerts.sql`, `20250904_biff_engagement_tracking.sql`
- Help guides: `REACTIVE_ABUSE_GUIDE.html`, `BIFF_ASSISTANT_USER_GUIDE.html`
- Components: Inline forms with state management, `CognitiveDissonanceWidget.tsx`
- Icons: lucide-react for consistent iconography
- AI: Gemini Pro for conflict detection and BIFF analysis

---

## Previous Releases

See Git history for previous changes.
