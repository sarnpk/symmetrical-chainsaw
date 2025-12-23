# Profile Integration - Narcissist Simulator

## ✅ Feature Complete

The Narcissist Simulator now uses your profile information to personalize the simulation!

---

## 🎯 What's Integrated

### Profile Fields Used:

1. **Display Name** - Used as your name in the simulator
2. **Abuser Gender** - Determines pronouns (she/her or he/him)
3. **Has Children** - Adds context about children
4. **Children Ages** - Specific ages for realistic scenarios
5. **Custody Arrangement** - Used in custody-related scenarios

---

## 🔄 How It Works

### Automatic Name Detection:

**Priority Order:**
1. **Custom Context** - If you type "I AM [name] AND SHE IS [name]"
2. **Profile Display Name** - Falls back to your account name
3. **Generic** - Uses "You" if nothing else available

**For Narcissist Name:**
1. **Custom Context** - Extracts from "SHE/HE IS [name]"
2. **Profile Gender** - Uses "Her" (female) or "Him" (male)
3. **Generic** - Uses "Them" if unknown

### Name Labels:

Messages now show names above each bubble:
```
Syed naqvi
┌─────────────────┐
│ Your message    │ (Green bubble)
└─────────────────┘

Begum New
┌─────────────────┐
│ Her response    │ (White bubble)
└─────────────────┘
```

---

## 🤖 AI Context Enhancement

The AI now receives profile information:

```
PROFILE CONTEXT:
- User's name: Syed naqvi
- Narcissist's gender: Female (she/her)
- They have children aged 2, 4
- Custody arrangement: Shared custody

Use this information to make the simulation more realistic and personalized.
```

### Benefits:

- ✅ More realistic scenarios
- ✅ Gender-appropriate pronouns
- ✅ Child-related context in custody scenarios
- ✅ Personalized manipulation tactics
- ✅ Accurate relationship dynamics

---

## 📝 Example Usage

### Scenario 1: With Custom Context

**You paste:**
```
I AM Syed naqvi AND SHE IS Begum New

[11:59 AM] Syed naqvi: Message here
[11:59 AM] Begum New: Her response
```

**Result:**
- Your name: "Syed naqvi" (from context)
- Narcissist name: "Begum New" (from context)
- Gender: Female (from context "SHE IS")
- Children info: From your profile

### Scenario 2: Without Custom Context

**You select:** Custody Exchange scenario

**Result:**
- Your name: "saleem" (from profile display_name)
- Narcissist name: "Her" (from profile abuser_gender: female)
- Children: Ages 2, 4 (from profile)
- Custody: Shared custody (from profile)

---

## 🎨 UI Improvements

### Before:
```
[Message bubble]
No name shown
```

### After:
```
Syed naqvi
[Your message - green bubble]

Begum New
[Her message - white bubble]
```

### Clear Visual Distinction:
- **Name labels** above each message
- **Color coding** (green = you, white = narcissist)
- **Alignment** (right = you, left = narcissist)
- **WhatsApp style** for familiarity

---

## 🔧 Technical Implementation

### Files Modified:

1. **`src/lib/supabase.ts`**
   - Added profile fields to Profile interface
   - Added: `abuser_gender`, `has_children`, `children_ages`, `custody_arrangement`

2. **`src/app/narcissist-simulator/page.tsx`**
   - Added `userName` and `narcissistName` state
   - Extract names from custom context or profile
   - Display names above message bubbles
   - Send profile data to API

3. **`src/app/api/narcissist-simulator/start/route.ts`**
   - Receive `userProfile` parameter
   - Build profile context string
   - Include in AI prompts

4. **`src/app/api/narcissist-simulator/respond/route.ts`**
   - Receive `userProfile` parameter
   - Build profile context string
   - Include in AI prompts

---

## 📊 Profile Data Flow

```
User Profile (Database)
        ↓
Frontend Component
        ↓
API Request (with profile)
        ↓
AI Prompt (with context)
        ↓
Personalized Response
        ↓
Display with Names
```

---

## 🎯 Use Cases

### 1. Custody Scenarios
Profile knows you have children aged 2 and 4, so AI generates realistic custody exchange scenarios.

### 2. Gender-Specific Language
Profile knows narcissist is female, so AI uses "she/her" pronouns correctly.

### 3. Name Recognition
Your name and narcissist's name appear clearly in the conversation.

### 4. Relationship Context
AI understands your specific situation (custody arrangement, children, etc.)

---

## ✨ Benefits

### For Users:
- ✅ More personalized practice
- ✅ Realistic scenarios matching your situation
- ✅ Clear identification of who's speaking
- ✅ Gender-appropriate language
- ✅ Context-aware responses

### For AI:
- ✅ Better understanding of relationship
- ✅ More accurate manipulation tactics
- ✅ Appropriate pronouns and references
- ✅ Realistic child-related scenarios
- ✅ Custody-specific situations

---

## 🔐 Privacy

- ✅ Profile data only sent to your own API calls
- ✅ Not stored in simulator sessions
- ✅ Used only for AI context
- ✅ Never shared with other users
- ✅ Follows existing RLS policies

---

## 📱 How to Set Up Your Profile

1. Go to **Account Settings**
2. Fill in:
   - Display Name (your name)
   - Person You're Managing Interactions With (Female/Male)
   - Do you have children together? (Yes/No)
   - Children's ages (if applicable)
   - Custody arrangement (if applicable)
3. Save Changes
4. Use Narcissist Simulator - it will automatically use this info!

---

## 🎉 Example Output

### With Profile Data:

**AI Prompt Includes:**
```
PROFILE CONTEXT:
- User's name: Syed naqvi
- Narcissist's gender: Female (she/her)
- They have children aged 2, 4
- Custody arrangement: Week on/week off

[AI generates response as Begum New, using she/her pronouns,
 referencing the children, and custody schedule]
```

**Display Shows:**
```
Syed naqvi
┌──────────────────────────────┐
│ I need to pick up the kids   │
│ at 5pm as agreed.            │
└──────────────────────────────┘

Begum New
┌──────────────────────────────┐
│ You're always so demanding.  │
│ The kids aren't ready yet.   │
│ Maybe if you were a better   │
│ parent they'd want to go.    │
└──────────────────────────────┘
```

---

## 🚀 Status: LIVE & WORKING

All profile integration features are:
- ✅ Fully implemented
- ✅ Tested and working
- ✅ No errors
- ✅ Ready to use

**Just fill in your profile and start practicing!**
