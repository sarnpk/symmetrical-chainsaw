# Narcissist Simulator - Role Identity & Full Name Recognition Fix

## Issues Fixed

### Issue 1: Wrong Role Identity
The simulator was responding AS the victim (user) instead of AS the narcissist. For example, it would respond as "Syed naqvi" instead of roleplaying as "Begum New".

### Issue 2: Incomplete Names
The simulator was only extracting the first word of names. For example, "Begum New" was being shortened to just "Begum".

## Root Causes
1. The AI prompts didn't clearly specify WHO is the narcissist and WHO is the victim
2. The prompts didn't emphasize that the AI must roleplay AS the narcissist
3. Users weren't instructed to explicitly state who is who in their context

## Solution

### 1. Updated All API Routes
Modified all three API routes with CRITICAL INSTRUCTIONS:

```
CRITICAL INSTRUCTIONS - READ CAREFULLY:

1. IDENTIFY WHO IS WHO:
   - Look for phrases like "I AM [name]" and "SHE/HE IS [name]"
   - Example: If context says "I AM Syed naqvi AND SHE IS Begum New", then:
     * Syed naqvi = the victim (the user)
     * Begum New = the narcissist (YOU must roleplay as this person)

2. YOU ARE THE NARCISSIST:
   - You must respond AS the narcissist, not as the victim
   - Adopt the narcissist's personality, speech patterns, and manipulation tactics
   - Continue the conversation as THEY would
```

### 2. Updated UI Instructions
Added a prominent warning box in the custom context textarea:

```
⚠️ IMPORTANT: Tell us who is who!
Start with: "I AM [your name] AND SHE/HE IS [narcissist name]"
Example: "I AM Syed naqvi AND SHE IS Begum New"
```

## Files Modified
- `src/app/api/narcissist-simulator/start/route.ts` - Initial message generation
- `src/app/api/narcissist-simulator/respond/route.ts` - Response generation
- `src/app/api/narcissist-simulator/predict/route.ts` - Next move prediction
- `src/app/narcissist-simulator/page.tsx` - UI with clearer instructions

## How to Use (Updated Format)

When using Custom Context, start your input with:

```
I AM [Your Name] AND SHE/HE IS [Narcissist Name]

[Then paste your conversation]
[11:59 AM] Your Name: Message here
[11:59 AM] Narcissist Name: Their response
```

**Example:**
```
I AM Syed naqvi AND SHE IS Begum New

[11:59 AM, 11/16/2025] Syed naqvi: یہ رسید ملی لیکن پتہ نہیں کس چیز کی رسید ہے
[11:59 AM, 11/16/2025] Begum New: Yehi hai
[11:59 AM, 11/16/2025] Begum New: Yellow hogi ye
```

## Testing
To test this fix:
1. Go to Narcissist Simulator
2. Select "Custom Context" scenario
3. Start with "I AM [your name] AND SHE/HE IS [narcissist name]"
4. Paste your conversation below that
5. Start the simulation
6. Verify the AI responds AS the narcissist (not as you)
7. Verify the AI uses the narcissist's full name correctly

## Impact
- ✅ The simulator now correctly identifies who is the narcissist
- ✅ The AI roleplays AS the narcissist, not as the victim
- ✅ Full names are preserved (e.g., "Begum New" not "Begum")
- ✅ Better personalization and accuracy
- ✅ More realistic practice sessions based on actual conversation patterns
- ✅ Supports mixed language conversations (Urdu/English)
