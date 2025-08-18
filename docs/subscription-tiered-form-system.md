# Subscription-Based Tiered Form System

## Overview
The journal entry form now implements a subscription-based tiered system that provides different levels of functionality based on the user's subscription tier.

## 🆓 **Foundation (Free) Tier Features**

### **Available Fields:**
- ✅ **Title** - Brief incident description (required)
- ✅ **Description** - What happened summary (required)
- ✅ **Incident Date** - When it occurred (required)
- ✅ **Incident Time** - Optional timing
- ✅ **Basic Safety Rating** - 1-5 scale (required)
- ✅ **Abuse Types** - Behavior pattern selection
- ✅ **Location** - Where it happened
- ✅ **Witnesses** - Who was present
- ✅ **Emotional State Before/After** - Feeling tracking
- ✅ **Evidence Upload** - Photo and audio evidence

### **Form Sections:**
1. **📅 Date & Time** - When did this happen?
2. **📝 Basic Information** - Title and description
3. **🛡️ Safety Assessment** - Basic 1-5 safety rating
4. **🎭 Types of Behavior** - Abuse pattern selection
5. **🛡️ Emotional Impact** - Before/after emotional states
6. **📍 Additional Context** - Location and witnesses
7. **📷 Evidence** - Photo and audio uploads

### **Limitations:**
- ❌ No detailed content field
- ❌ No mood or trigger level ratings
- ❌ No behavior categories analysis
- ❌ No pattern flags
- ❌ No evidence documentation features
- ❌ No draft mode
- ❌ No content warnings

## 💎 **Recovery & Empowerment (Paid) Tier Features**

### **All Foundation Features PLUS:**

#### **📊 Enhanced Impact Assessment:**
- **Mood Rating** - 1-10 emotional state scale
- **Trigger Level** - 1-5 trauma impact assessment
- **Detailed Safety Analysis** - Enhanced safety metrics

#### **🔍 Detailed Analysis:**
- **Behavior Categories** - 12 specific behavior types:
  - verbal_abuse, emotional_manipulation, gaslighting, isolation
  - financial_control, physical_intimidation, surveillance, threats
  - love_bombing, silent_treatment, blame_shifting, projection
- **Emotional Impact** - 11 emotional response categories:
  - anxiety, depression, fear, confusion, anger, shame
  - guilt, helplessness, numbness, hypervigilance, dissociation
- **Pattern Flags** - 7 pattern indicators:
  - escalation, cycle_repeat, trigger_identified, new_behavior
  - intensity_increase, frequency_increase, multiple_tactics

#### **📋 Evidence Documentation:**
- **Evidence Types** - 9 evidence categories:
  - text_messages, emails, voicemails, photos, videos
  - documents, recordings, screenshots, witness_statements
- **Evidence Notes** - Detailed evidence descriptions
- **Legal Evidence Flag** - Mark entries for potential legal use
- **Content Warnings** - 7 warning categories:
  - violence, sexual_content, self_harm, substance_abuse
  - graphic_language, trauma_details, medical_content

#### **💾 Advanced Features:**
- **Draft Mode** - Save incomplete entries for later completion
- **Detailed Content Field** - Comprehensive incident documentation
- **Enhanced Metadata** - Precise timing and context tracking

## 🔧 **Technical Implementation**

### **Subscription Detection:**
```typescript
const [subscriptionTier, setSubscriptionTier] = useState<'foundation' | 'recovery' | 'empowerment'>('foundation')

// Load from user profile
setSubscriptionTier(profile.subscription_tier || 'foundation')
```

### **Feature Access Control:**
```typescript
const getFeatureAccess = () => ({
  basicForm: true, // Available to all users
  enhancedRatings: isPaidUser(), // Mood rating, trigger level
  detailedAnalysis: isPaidUser(), // Behavior categories, emotional impact, pattern flags
  evidenceDocumentation: isPaidUser(), // Evidence types, notes, legal flagging, content warnings
  draftMode: isPaidUser(), // Save as draft functionality
  advancedFields: isPaidUser(), // Content field, enhanced metadata
})
```

### **Conditional Rendering:**
```typescript
{featureAccess.enhancedRatings ? (
  <EnhancedRatingsSection />
) : (
  <UpgradePrompt feature="Enhanced Impact Assessment" />
)}
```

### **Database Integration:**
- **Conditional Field Saving** - Only save enhanced fields for paid users
- **Backward Compatibility** - Free users can still access basic functionality
- **Upgrade Path** - Existing data preserved when upgrading

## 🎨 **User Experience**

### **For Free Users:**
- **Clean, Simple Form** - Matches original edit form functionality
- **Upgrade Prompts** - Attractive prompts to encourage subscription
- **No Feature Blocking** - Core functionality remains accessible
- **Clear Value Proposition** - Shows what's available with upgrade

### **For Paid Users:**
- **Full Feature Access** - All enhanced capabilities available
- **Progressive Enhancement** - Advanced features build on basic form
- **Comprehensive Documentation** - Detailed incident tracking
- **Professional Tools** - Evidence management and pattern analysis

### **Upgrade Prompts:**
- **Visual Design** - Purple gradient with sparkle icon
- **Clear Benefits** - Explains what features are unlocked
- **Direct Action** - "Upgrade Now" button links to subscription page
- **Non-Intrusive** - Prompts replace sections rather than blocking

## 📊 **Form Validation**

### **Free Users:**
- **Required Fields** - Title, description, incident date, safety rating
- **Standard Validation** - Basic form validation rules
- **No Draft Mode** - Must complete all required fields

### **Paid Users:**
- **Flexible Validation** - Draft mode allows incomplete entries
- **Enhanced Requirements** - Additional optional fields available
- **Smart Validation** - Adapts based on draft status

## 🚀 **Benefits**

### **Business Benefits:**
1. **Clear Value Differentiation** - Shows upgrade value immediately
2. **Conversion Optimization** - Upgrade prompts at point of need
3. **User Retention** - Free tier provides core value
4. **Revenue Growth** - Encourages subscription upgrades

### **User Benefits:**
1. **Accessible Core Features** - Essential functionality remains free
2. **Clear Upgrade Path** - Understand what's available with subscription
3. **No Feature Shock** - Gradual introduction to advanced features
4. **Value Demonstration** - See benefits before committing to payment

### **Technical Benefits:**
1. **Scalable Architecture** - Easy to add new tier-specific features
2. **Clean Code** - Conditional rendering keeps components organized
3. **Database Efficiency** - Only store relevant data per tier
4. **Maintainable** - Feature flags make updates straightforward

## 🔄 **Migration Strategy**

### **Existing Users:**
- **Automatic Detection** - Subscription tier loaded from profile
- **Graceful Degradation** - Enhanced features hidden for free users
- **Data Preservation** - Existing entries remain accessible
- **Upgrade Benefits** - Immediate access to enhanced features upon upgrade

### **New Users:**
- **Foundation Start** - Begin with free tier by default
- **Feature Discovery** - Upgrade prompts introduce advanced features
- **Trial Opportunities** - Can experience basic functionality first
- **Conversion Funnel** - Natural progression to paid features

The subscription-based tiered form system successfully balances accessibility with monetization, providing core trauma documentation features to all users while offering compelling advanced capabilities for subscribers.
