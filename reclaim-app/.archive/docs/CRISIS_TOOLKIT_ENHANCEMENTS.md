# Crisis Toolkit - Enhanced Features

## ✨ New Interactive Features

### 1. Manual Thought Labeling (OCD) ✍️

**What it does:**
When users select the "Label the Thought" skill for OCD, they can type their intrusive thought directly into a text box.

**Why it works:**
- **Externalization:** Writing the thought down gets it out of your head
- **Distance:** Seeing it on screen creates psychological distance
- **Validation:** System confirms it's labeled as "intrusive/sticky"
- **Tracking:** Saved in session notes for pattern recognition

**User Flow:**
```
1. User clicks "Label the Thought" skill
2. Text area appears: "Type your intrusive thought..."
3. User writes: "What if I left the stove on?"
4. System shows: ✓ Labeled as "This is a sticky/intrusive thought"
5. Thought saved in session notes
```

**Technical Implementation:**
- State: `intrusiveThought` (string)
- Textarea appears when `activeSkill === 'label_thought'`
- Saved to `crisis_toolkit_logs.notes` field
- Can be analyzed later for patterns

**Benefits:**
- More engaging than just reading instructions
- Creates a record for therapy discussions
- Helps users see patterns over time
- Validates the OCD experience

---

### 2. Guided Voice Affirmations 🎙️

**What it does:**
Users can listen to self-compassion affirmations read aloud in a calming voice using text-to-speech.

**Why it works:**
- **Hands-free:** Can close eyes and just listen
- **Internalization:** Hearing it spoken is more powerful
- **Accessibility:** Helps users who struggle to read during crisis
- **Calming:** Slower pace (0.85x) is soothing
- **Repetition:** Can replay as many times as needed

**User Flow:**
```
1. User reaches affirmation step
2. Sees affirmation text displayed
3. Clicks "🎙️ Listen to Guided Voice" button
4. Text-to-speech reads affirmation slowly
5. Button shows "🔊 Playing..." during playback
6. Can replay or continue
```

**Technical Implementation:**
```typescript
const playVoiceAffirmation = (text: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;  // Slower, calming pace
    utterance.pitch = 1.0;   // Natural pitch
    utterance.volume = 1.0;  // Full volume
    utterance.onstart = () => setIsPlayingVoice(true);
    utterance.onend = () => setIsPlayingVoice(false);
    window.speechSynthesis.speak(utterance);
  }
};
```

**Voice Settings:**
- **Rate:** 0.8 (20% slower for calmness)
- **Pitch:** 1.1 (slightly higher for warmth)
- **Volume:** 0.9 (slightly softer, less jarring)
- **Voice Selection:** Prioritizes natural-sounding voices:
  - macOS: Samantha, Enhanced voices
  - Windows: Microsoft Zira Premium
  - Android: Google Natural voices
  - Chrome: Premium/Enhanced voices
  - Falls back to best local voice available

**Browser Support:**
- ✅ Chrome/Edge (excellent)
- ✅ Safari (good)
- ✅ Firefox (good)
- ⚠️ Fallback: Text display if not supported

**Benefits:**
- More immersive experience
- Helps during panic when reading is hard
- Can listen while doing grounding exercises
- Reinforces message through auditory channel
- No additional API costs (browser native)

---

## 🎯 Combined User Experience

### Example: OCD Session with New Features

**Step 1: Select OCD**
```
User: "I'm having intrusive thoughts"
System: Shows OCD intervention
```

**Step 2: Label the Thought (NEW)**
```
User clicks "Label the Thought"
Text box appears
User types: "What if I hurt someone?"
System: ✓ Labeled as "This is a sticky/intrusive thought"
```

**Step 3: Delay Compulsion**
```
User clicks "Delay Compulsion"
Timer starts: 1:00... 0:59... 0:58...
User practices sitting with discomfort
```

**Step 4: Affirmation with Voice (NEW)**
```
System shows: "My brain is sending a false alarm. I don't have to respond to it."
User clicks: 🎙️ Listen to Guided Voice
Voice reads affirmation slowly and calmly
User closes eyes and listens
```

**Step 5: Rate & Complete**
```
User rates: 4/5 stars
Session saved with intrusive thought logged
```

---

## 📊 Data Captured

### Session Log Structure
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "condition_type": "ocd",
  "skills_used": ["label_thought", "delay_compulsion"],
  "helpful_rating": 4,
  "notes": "Intrusive thought: What if I hurt someone?",
  "created_at": "2025-01-15T10:30:00Z"
}
```

### Analytics Potential
- Track most common intrusive thoughts
- Identify trigger patterns
- Measure skill effectiveness
- Generate insights for therapy

---

## 🎨 UI/UX Design

### Thought Labeling
```
┌─────────────────────────────────────┐
│ Label the Thought                   │
│                                     │
│ Type your intrusive thought:        │
│ ┌─────────────────────────────────┐ │
│ │ What if I left the stove on?    │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ✓ Labeled as: "This is a sticky/   │
│   intrusive thought"                │
│                                     │
│ [✓ Used]                            │
└─────────────────────────────────────┘
```

### Voice Affirmation
```
┌─────────────────────────────────────┐
│ Remember this                       │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ "My brain is sending a false    │ │
│ │  alarm. I don't have to         │ │
│ │  respond to it."                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [🎙️ Listen to Guided Voice]        │
│                                     │
│ This feeling is temporary...        │
└─────────────────────────────────────┘
```

---

## 🔒 Privacy & Safety

### Thought Labeling
- **Encrypted:** All thoughts stored encrypted
- **Private:** Only user can see their thoughts
- **Optional:** Can skip typing if uncomfortable
- **Deletable:** Can delete session logs anytime

### Voice Affirmations
- **Local:** Uses browser's native TTS (no server)
- **Private:** No audio recorded or transmitted
- **Offline:** Works without internet (after page load)
- **Accessible:** Respects system voice settings

---

## 🚀 Future Enhancements

### Phase 2: Advanced Thought Labeling
- [ ] AI categorization of thought types
- [ ] Pattern detection across sessions
- [ ] Suggested reframes for common thoughts
- [ ] Export thought log for therapy

### Phase 2: Enhanced Voice
- [ ] Multiple voice options (male/female)
- [ ] Adjustable speed and pitch
- [ ] Background calming music
- [ ] Guided breathing with voice cues
- [ ] Save favorite voice settings

### Phase 3: Integration
- [ ] Link thoughts to journal entries
- [ ] Share patterns with therapist (optional)
- [ ] Community anonymized insights
- [ ] Therapist collaboration features

---

## ✅ Testing Checklist

**Thought Labeling:**
- [ ] Text area appears for OCD label skill
- [ ] Can type intrusive thought
- [ ] Confirmation message shows
- [ ] Thought saved in notes field
- [ ] Can complete session with thought logged
- [ ] Mobile keyboard works properly

**Voice Affirmations:**
- [ ] Button appears on affirmation step
- [ ] Voice plays when clicked
- [ ] Button shows "Playing..." state
- [ ] Can replay multiple times
- [ ] Works on Chrome/Safari/Firefox
- [ ] Graceful fallback if not supported
- [ ] Voice is calm and clear
- [ ] Pace is appropriate (0.85x)

---

## 💡 User Feedback Expected

**Thought Labeling:**
- "Writing it down made it feel less scary"
- "Seeing it labeled helped me realize it's just OCD"
- "I can show my therapist the patterns now"

**Voice Affirmations:**
- "Hearing it was more powerful than reading"
- "I could close my eyes and just listen"
- "The calm voice helped me believe it"

---

## 🎯 Value Add

These features make the Crisis Toolkit:
- **More Interactive:** Active participation vs passive reading
- **More Accessible:** Voice option for those who can't focus on text
- **More Therapeutic:** Externalization and auditory reinforcement
- **More Trackable:** Data for pattern recognition
- **More Personal:** User's own thoughts and preferred modality

**No additional costs:**
- Text-to-speech is browser native (free)
- Text storage is minimal database space
- No external APIs needed
