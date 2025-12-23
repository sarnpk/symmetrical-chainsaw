# Reality Anchor Rebranding Fix

## Issue
The feature was renamed from "Reality Log" to "Reality Anchor" but many UI labels still showed the old "Reality Log" name, causing confusion.

## Changes Applied

Updated all user-facing text from "Reality Log" to "Reality Anchor" in the following locations:

### 1. Form and Entry Pages
- **RealityLogForm.tsx**: "Add Reality Log Entry" → "Add Reality Anchor Entry"
- **reality-log/new/page.tsx**: "New Reality Log Entry" → "New Reality Anchor Entry"
- **reality-log/[id]/edit/page.tsx**: "Edit Reality Log Entry" → "Edit Reality Anchor Entry"
- **reality-log/[id]/page.tsx**: "Back to Reality Log" → "Back to Reality Anchor"

### 2. Navigation and Dashboard
- **DashboardV2.tsx**: Navigation menu item "Reality Log" → "Reality Anchor"
- **morning-intention/page.tsx**: Button text "Reality Log" → "Reality Anchor"

### 3. Widgets and Components
- **RealityAnchorWidget.tsx**: Stats label "Reality Log" → "Reality Anchor"

### 4. AI Suggestions
- **npd-traits/[id]/page.tsx**: Action "Start Reality Log entry" → "Start Reality Anchor entry"
- **api/npd-traits/ai-insights/route.ts**: Suggestion "Start Reality Log entry" → "Start Reality Anchor entry"

## Files Modified

1. `reclaim-app/src/components/reality-anchor/RealityLogForm.tsx`
2. `reclaim-app/src/app/reality-log/[id]/page.tsx`
3. `reclaim-app/src/app/reality-log/[id]/edit/page.tsx`
4. `reclaim-app/src/app/reality-log/new/page.tsx`
5. `reclaim-app/src/app/morning-intention/page.tsx`
6. `reclaim-app/src/app/dashboard/DashboardV2.tsx`
7. `reclaim-app/src/components/reality-anchor/RealityAnchorWidget.tsx`
8. `reclaim-app/src/app/npd-traits/[id]/page.tsx`
9. `reclaim-app/src/app/api/npd-traits/ai-insights/route.ts`

## Note on Routes
The URL routes remain as `/reality-log/*` for backward compatibility and to avoid breaking existing links. Only the user-facing labels have been updated to "Reality Anchor".

## Files NOT Changed (Intentionally)
The following files contain "Reality Log" in contexts where it's appropriate to keep:
- **terms/page.tsx**: Feature list mentions (acceptable in legal context)
- **privacy/page.tsx**: Data collection descriptions (technical documentation)
- **page.tsx**: Landing page feature descriptions (some instances kept for clarity)
- **faq/page.tsx**: FAQ answers explaining the difference between features
- **learn-more/page.tsx**: Educational content
- **blog posts**: Historical content

These references are in documentation/marketing contexts where "Reality Log" helps explain the feature's purpose or distinguish it from other features like "Journal".

## Testing Checklist

After deployment, verify:
1. ✅ "New Reality Anchor Entry" appears on the new entry page
2. ✅ "Edit Reality Anchor Entry" appears on the edit page
3. ✅ "Back to Reality Anchor" appears on the detail page
4. ✅ Dashboard navigation shows "Reality Anchor"
5. ✅ Morning Intention page button says "Reality Anchor"
6. ✅ Widget displays "Reality Anchor" label
7. ✅ AI suggestions say "Start Reality Anchor entry"

## Status
✅ All user-facing labels updated to "Reality Anchor"
