# Emoji removal guide (REQUIRED RULES)

Goal: remove 100% of emoji/symbols from `src/`. Two cases:

## A. UI context (JSX rendering, .tsx files)
Replace emoji that act as icons/labels with a Lucide icon component. Emoji always appear as a TEXT PREFIX, e.g.:
- `<h3>💡 Remember</h3>` -> `<h3 className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-gray-900" />Remember</h3>`
- `<button>💡 Analyze</button>` -> `<button className="... flex items-center justify-center gap-2"><Lightbulb className="h-4 w-4" />Analyze</button>` (keep existing className, ADD `flex items-center gap-2` if it lacks flex)
- `title="💡 What Happened"` (prop passed to Section/Card) -> strip emoji from the string: `title="What Happened"` (NO icon inside string props — the Section component renders `{title}` as plain text; do NOT modify Section.tsx)
- `'🚨 This appears...'` inside a string ternary feeding a `<p>` -> strip emoji, keep text: `'This appears...'` (plain text `<p>` cannot render icons mixed with text cleanly — for ternary strings just remove the emoji).
- Emoji inside a `<span>` that is icon-only, e.g. `<span className="...">💡</span>` -> replace with `<Lightbulb className="h-4 w-4 text-blue-600" />` inside the same span.

MUST:
- Add the icon to the file's existing `import { ... } from 'lucide-react'` line. If there is no lucide-react import yet, add one.
- Reuse icons ALREADY imported in the file when possible; otherwise import from 'lucide-react'.
- Pick sensible sizes: `h-4 w-4` in buttons/small labels, `h-5 w-5` in h3/h4 headings, `h-6 w-6` for larger section headers, `h-8 w-8` in circle wrappers.
- Preserve the emoji's color intent: `text-red-500` for 🚨/errors, `text-amber-500` for ⚠️, `text-green-600` for ✅.

## B. Plain-text context (the emoji cannot render as a React icon)
Files: `src/lib/`, `src/hooks/`, `src/app/api/**/route.ts`, console.log strings, email/PDF/HTML template literals, AI response data arrays.
Rule: STRIP the emoji entirely, keep the surrounding text. For arrows in text output, replace `→` with `->`, `←` with `<-`, `↑` with `^`, `↓` with `v`. No icon components. No imports to add.

## Emoji -> Lucide mapping (names verified: use fullLucide name)
💡 Lightbulb | 🧠 Brain | 🛡️ Shield | 📝 FileText | 📋 Clipboard | 📅 Calendar | 📸 Camera | 📷 Camera | 🎯 Target | 🔍 Search | 👁️ Eye | 🚫 Ban | 😢 Frown | 🔄 RefreshCw | 💔 HeartCrack | ❤️ Heart | 💜 Heart | 💛 Heart | 💙 Heart | 🚨 AlertTriangle | ⭐ Star | 🔥 Flame | ⚡ Zap | ✅ Check | 🏷️ Tag | 📌 MapPin | 📊 BarChart3 | 📈 TrendingUp | 📁 FolderOpen | 📚 BookOpen | 🚀 Rocket | 🤖 Bot | 🎉 PartyPopper | 🎧 Headphones | 🪝 Link | 🙏 HeartHandshake | 🔐 Lock | 🔒 Lock | 🧘 Sun | ⚔️ Sword | 🏞️ Mountain | ☁️ Cloud | 🚪 DoorOpen | 🔻 TrendingDown | 🗿 Landmark | 📱 Smartphone | 🎤 Mic | 🎵 Music | 💬 MessageSquare | 🎭 Drama | 💟 Award | 🏆 Trophy | 🥇 Award | 🥈 Award | 🥉 Award | 🆘 LifeBuoy | 🔴 Circle | ⬢ (hexagon bullet) REMOVE | ⬦ (lozenge bullet) REMOVE | ⬝ (small bullet) REMOVE | ⬡ REMOVE | → ArrowRight (UI) / "->" (text) | ← ArrowLeft (UI) / "<-" (text) | ↑ ArrowUp | ↓ ArrowDown | ↪️ LogIn | 👥 Users | 🌈 Palette | 🌅 Sunrise | 🚦 remove | 🧚 Sparkles | 😚 Smile | 😐 Meh | 😔 Frown | 👍 ThumbsUp | 👞 remove (shoe) | 👑 Crown | 💆 remove | 🫁 remove | 🜙 etc (alchemical U+1F70x-1F77x) REMOVE | 🞉 🞯 🞁 🞭 🞵 🞰 (U+1F7xx) REMOVE

## GroupChatRooms avatar names (src/app/community/GroupChatRooms.tsx)
These are display names like `'Dove 🕊️'`. Keep the WORD, strip the emoji: `'Dove'`. Do not add icons.

## Verification
After editing a file, no non-ASCII symbol/emoji chars may remain (plain ASCII letters only) EXCEPT normal grammar (apostrophes, em-dashes in prose are acceptable). Run this check mentally per edited file.