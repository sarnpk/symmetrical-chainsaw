# Reality Log - Simple Spec
## Quick, Focused, Separate from Journal

---

## 🎯 WHAT IS IT?

A **quick 2-minute entry** to document facts about what happened.

**NOT a journal entry** - Much simpler, much faster.

---

## 📝 THE FORM (Super Simple)

```
┌─────────────────────────────────────────────────────────┐
│ REALITY LOG - QUICK ENTRY                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📅 DATE                                                 │
│ [Today] ▼                                               │
│                                                         │
│ 🎯 EVENT (What happened?)                               │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Discussed childcare schedule                        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ 📋 FACT (What exactly happened?)                        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Request was met with immediate victimhood           │ │
│ │ ("I do everything"). I had to handle it alone.       │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ 🏷️  NPD TRAIT (What trait is this?)                     │
│ ☑ Playing the Victim                                   │
│ ☐ Gaslighting                                          │
│ ☐ Triangulation                                        │
│ ☐ Love-bombing                                         │
│ ☐ Hoovering                                            │
│ ☐ Flying Monkeys                                       │
│ ☐ Covert Criticism                                     │
│ ☐ Boundary Violations                                  │
│                                                         │
│ 📌 PATTERN (Is this consistent?)                        │
│ ☑ This is consistent with past behavior                │
│ Pattern: She always plays victim when I ask for help    │
│                                                         │
│ [SAVE ENTRY]  [SAVE & ADD ANOTHER]                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🗂️ DATABASE SCHEMA (Simple)

```sql
CREATE TABLE reality_log_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  event TEXT NOT NULL,
  fact TEXT NOT NULL,
  npd_trait VARCHAR(100),
  is_consistent BOOLEAN,
  pattern_note TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reality_log_user_date ON reality_log_entries(user_id, date);
```

---

## 📱 PAGES

### Page 1: Reality Log Hub (List)

```
┌─────────────────────────────────────────────────────────┐
│ REALITY LOG                                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📊 THIS WEEK: 3 entries                                 │
│ Top trait: Playing the Victim (2x)                      │
│                                                         │
│ [+ ADD NEW ENTRY]                                       │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ TODAY - 3:45 PM                                     │ │
│ │ Event: Discussed childcare schedule                 │ │
│ │ Fact: Request met with victimhood ("I do            │ │
│ │       everything"). I handled it alone.              │ │
│ │ Trait: Playing the Victim ✓ Consistent              │ │
│ │ [View] [Edit] [Delete]                              │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ YESTERDAY - 2:15 PM                                 │ │
│ │ Event: Asked about school fees                      │ │
│ │ Fact: She said "I can't afford it" but bought       │ │
│ │       furniture. Blamed me for financial problems.   │ │
│ │ Trait: Gaslighting ✓ Consistent                     │ │
│ │ [View] [Edit] [Delete]                              │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└────────────────���────────────────────────────────────────┘
```

### Page 2: Add New Entry

```
┌─────────────────────────────────────────────────────────┐
│ ADD REALITY LOG ENTRY                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📅 DATE: [Today] ▼                                      │
│                                                         │
│ 🎯 EVENT (What happened?)                               │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Discussed childcare schedule                        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ 📋 FACT (What exactly happened?)                        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Request was met with immediate victimhood           │ │
│ │ ("I do everything"). I had to handle it alone.       │ │
│ │                                                     │ │
│ │ (Be factual, not emotional)                         │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ 🏷️  NPD TRAIT (What trait is this?)                     │
│ [Select a trait...] ▼                                   │
│                                                         │
│ 📌 PATTERN (Is this consistent?)                        │
│ ☑ This is consistent with past behavior                │
│                                                         │
│ Pattern note (optional):                                │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ She always plays victim when I ask for help          │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [SAVE ENTRY]  [SAVE & ADD ANOTHER]  [CANCEL]          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Page 3: View Single Entry

```
┌─────────────────────────────────────────────────────────┐
│ REALITY LOG ENTRY                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📅 DATE: Today (3:45 PM)                                │
│                                                         │
│ 🎯 EVENT                                                │
│ Discussed childcare schedule                            │
│                                                         │
│ 📋 FACT                                                 │
│ Request was met with immediate victimhood ("I do        │
│ everything"). I had to handle it alone.                 │
│                                                         │
│ 🏷️  NPD TRAIT                                           │
│ Playing the Victim                                      │
│                                                         │
│ 📌 PATTERN                                              │
│ ✓ Consistent with past behavior                         │
│ She always plays victim when I ask for help             │
│ (Documented 5 times in past month)                      │
│                                                         │
│ ─────────────────────────────────────────────────────── │
│                                                         │
│ 💡 REALITY CHECK                                        │
│ This is consistent with the Covert NPD trait of:        │
│ "Playing the Victim to Avoid Responsibility"           │
│                                                         │
│ When you set a boundary or ask for help, she            │
│ responds with victimhood to make you feel guilty        │
│ and take responsibility instead.                        │
│                                                         │
│ This is NOT your fault. This is her pattern.            │
│                                                         │
│ ─────────────────────────────────────────────────────── │
│                                                         │
│ [EDIT]  [DELETE]  [BACK]                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔌 API ENDPOINTS

```
POST /api/reality-log
GET /api/reality-log
GET /api/reality-log/:id
PUT /api/reality-log/:id
DELETE /api/reality-log/:id
```

---

## 💻 COMPONENTS NEEDED

1. **RealityLogHub.tsx** - List all entries
2. **RealityLogForm.tsx** - Add/edit entry
3. **RealityLogEntry.tsx** - View single entry

---

## 📋 FIELDS ONLY

- Date
- Event (1 line)
- Fact (2-3 lines)
- NPD Trait (dropdown)
- Is Consistent (checkbox)
- Pattern Note (optional)

**That's it. 6 fields. Simple.**

---

## ✨ KEY POINTS

✅ Separate from journal  
✅ Super simple form  
✅ 2 minutes to create  
✅ Factual, not emotional  
✅ Identifies NPD traits  
✅ Shows patterns  
✅ Reality check explanation  

---

## 🚀 READY TO BUILD

This is the simple, focused Reality Log.

Not mixed with journal.

Just facts.

Quick.

Powerful.
