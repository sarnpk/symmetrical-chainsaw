# Reclaim â€” Premium Website Design & Implementation Plan

**Version:** 1.0 Â· **Audience:** designers, engineers, PMs Â· **Build target:** Next.js 14 App Router Â· Tailwind CSS v4 Â· React 18 Â· framer-motion
**Status:** Ready to implement. No guesswork required â€” every token, component, page, and rule is specified below.

> This document is the single source of truth for the marketing-site redesign. It supersedes the ad-hoc Tailwind-utility styling currently in `src/app/globals.css` and marketing pages, but intentionally **does not touch product (dashboard) UI** unless a page is explicitly listed in the Implementation Plan.

---

## 0. Design Thesis & UX Psychology

Reclaim helps survivors of narcissistic and domestic abuse document, understand, and recover. These users arrive **stressed, uncertain, often in crisis**, and skeptical about privacy. Every design decision below optimizes for three psychological outcomes:

| Need | Mechanism used | Where it shows up |
|---|---|---|
| **Safety & trust** | Predictable calm color, generous whitespace, no clutter, explicit privacy copy, real-feeling trust markers | Backgrounds, header, footer, privacy sections |
| **Empowerment / agency** | The user always sees the next step; progress is visible; results come *from them* (quiz, journal), never *at them* | Hero, CTAs, staggered reveals, progress traces |
| **Reduced cognitive load** | One primary CTA per viewport, high-contrast hierarchy, short sentences, scannable cards | Every section, forms, pricing |
| **Relief / hope** | Warm ascent gradient (indigo â†’ violet â†’ rose) evoking "light at the end of the tunnel"; soft serif headlines that read as human, not corporate | Global section treatment, headings |
| **Commitment (Cialdini)** | Free quiz asks for nothing but an email â†’ creates a small commitment â†’ email-prefilled auth funnel | Free tools, auth redirect |
| **Social proof** | Real testimonials, stat counters, "used by survivors in 70+ languages" | Testimonial rail, counters |
| **Loss aversion** | "Foundation" tier is always present so the pain of *not* upgrading is visible; upgrade rows highlighted | Pricing comparison |
| **Authority & expertise** | Legal-evidence framing, evidence-grade documentation messaging, trauma-informed AI narrative | Learn-more page, feature copy |
| **Distraction anxiety** | No autoplay, no popups, no infinite scroll on marketing site, visible "No data for training" promise | Global scroll rules, FAQ |

**Golden rule:** the marketing site must feel like the calmest, safest room on the internet for this audience â€” while still converting. If a design choice adds visual noise, it is rejected.

---

## 1. Brand Identity

### 1.1 Positioning
- **Tagline (current):** "Reclaim. Your life."
- **Elevated tagline for hero:** *"Turn your history into evidence. Your truth into recovery."*
- **One-line product story:** Reclaim is a private, AI-assisted journal and evidence platform that helps survivors of emotional and narcissistic abuse document their reality, spot manipulation patterns, and build legally-usable records â€” all in complete privacy.

### 1.2 Voice & Tone
```
Empathetic      â†’ never clinical; always "you", never "users"
Calm            â†’ present tense, short sentences, no exclamation spam
Credible        â†’ specificity beats hype ("timestamps + GPS + hash-locked exports")
Empowering      â†’ focus on action the survivor controls
Safe            â†’ privacy claims stated plainly wherever data is mentioned
```
**Write examples**
- âœ… "Every entry is encrypted and locked to your account. Your data is never sold or trained on."
- âŒ "Your data is super secure with industry-leading protection!!!"

### 1.3 Personality matrix (for copy + illustration)
| Axis | Value |
|---|---|
| Energy | Low-key warm (not excitable) |
| Formality | Approachable professional |
| Humor | None on marketing surfaces |
| Color emotion | Calm â†’ hopeful ascent |
| Brand animal/object | A slowly surfacing lily / dawn horizon |

---

## 2. Color System

### 2.1 Palette (Tailwind v4 `@theme` tokens)

Primary = indigo (brand blue-violet). We refine the existing indigo to a warmer, more human violet-leaning indigo, and add a full semantic scale.

```css
/* src/styles/tokens.css â€” paste into globals.css inside @theme (see Â§11.2) */
@theme {
  /* Brand primaries */
  --color-brand-50:  #eef2ff;
  --color-brand-100: #e0e7ff;
  --color-brand-200: #c7d2fe;
  --color-brand-300: #a5b4fc;
  --color-brand-400: #818cf8;
  --color-brand-500: #6366f1;
  --color-brand-600: #4f46e5;   /* primary action */
  --color-brand-700: #4338ca;
  --color-brand-800: #3730a3;
  --color-brand-900: #312e81;

  /* Support violet (secondary, "hope" accent) */
  --color-hope-50:   #f5f3ff;
  --color-hope-100:  #ede9fe;
  --color-hope-200:  #ddd6fe;
  --color-hope-300:  #c4b5fd;
  --color-hope-400:  #a78bfa;
  --color-hope-500:  #8b5cf6;
  --color-hope-600:  #7c3aed;
  --color-hope-700:  #6d28d9;

  /* Rose = "warm breakthrough" accent, used for success/emergency sparingly */
  --color-dawn-50:  #fff1f2;
  --color-dawn-100: #ffe4e6;
  --color-dawn-300: #fda4af;
  --color-dawn-500: #f43f5e;
  --color-dawn-600: #e11d48;

  /* Neutral warm-gray (softer than pure gray â€” reduces "clinical" feel) */
  --color-ink-50:   #fafafa;
  --color-ink-100:  #f5f5f4;
  --color-ink-200:  #e7e5e4;
  --color-ink-300:  #d6d3d1;
  --color-ink-400:  #a8a29e;
  --color-ink-500:  #78716c;
  --color-ink-600:  #57534e;
  --color-ink-700:  #44403c;
  --color-ink-800:  #292524;
  --color-ink-900:  #1c1917;

  /* Semantic */
  --color-success: #16a34a;
  --color-danger:  #dc2626;
  --color-warning: #d97706;

  /* Radii */
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-2xl: 2rem;

  /* Motion */
  --ease-soft: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Shadows */
  --shadow-soft: 0 1px 2px rgb(28 25 23 / 0.04), 0 8px 24px rgb(28 25 23 / 0.06);
  --shadow-lift: 0 2px 4px rgb(28 25 23 / 0.05), 0 18px 40px rgb(28 25 23 / 0.10);
}
```

### 2.2 Usage rules
| Token | Usage | Notes |
|---|---|---|
| `brand-600` | Buttons, links, focus rings, active nav, primary fill | Hover â†’ `brand-700`; **never** on large background areas longer than one section |
| `brand-500` | Browser theme-color, small accents, slider | Matches current `#6366f1` so no breakage |
| `hope-500/600` | "Recovery/hope" sections, quiz CTAs, gradient partner | Keep â‰¤ 20% of a page |
| `dawn-*` | Crisis (ðŸ†˜), urgent CTAs, error | One widget only (existing `CrisisToolkitWidget`) |
| `ink-*` | All text & surfaces | Body text `ink-600`/`ink-700`; headings `ink-900`; no pure `#000` text |
| `ink-50` | App background (replaces `bg-gray-50`) | Reduces blue-gray coldness |

### 2.3 Accessibility (WCAG 2.1 AA) â€” mandates
| Pair | Contrast |
|---|---|
| `brand-600` (#4f46e5) on white | 7.2:1 âœ… (AA/AAA text) |
| white on `brand-600` | 5.0:1 âœ… |
| `brand-600` on `brand-50` | 7.9:1 âœ… |
| `ink-500` on white | 4.6:1 âœ… (muted text â‰¥ 4.5 for body; use `ink-600` for captions < 18px) |
| `brand-300` | decorative borders only, never text |

**Decorative color is the only place tint washes (`from-brand-50 via-white to-hope-50`) are allowed.** All text sits on solid surfaces.

---

## 3. Typography System

### 3.1 Fonts
- **Headings & display:** `Fraunces` (optical size, SOFT axes) â€” `next/font/google`. Humanist old-style serif = warmth, editorial authority, emotional resonance. Use `font-variation-settings: "SOFT" 100` for the hero.
- **Body & UI:** `Inter` (already in use) â€” legibility, neutrality, proven at small sizes.
- **Monospace (evidence/export timestamps):** `JetBrains Mono` for hash/ID displays (adds "forensic" credibility) â€” optional, subset only.

```ts
// src/app/layout.tsx (delta)
import { Inter, Fraunces } from "next/font/google";
const inter = Inter({ subsets: ["latin"], display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], axes: ["opsz", "SOFT", "wght"], variable: "--font-display" });
```

### 3.2 Type scale (fluid, `clamp`)
| Token | Size / Line-height | Weight | Use |
|---|---|---|---|
| `display-1` (hero H1) | `clamp(2.5rem, 6vw, 4rem)` / 1.05 | 600 | Landing hero only |
| `display-2` | `clamp(2rem, 4.5vw, 3rem)` / 1.1 | 600 | Section H2 |
| `h3` | `clamp(1.375rem, 2vw, 1.625rem)` / 1.25 | 600 | Card titles / subheads |
| `h4` | 1.125rem / 1.4 | 600 | Feature micro-heads |
| `body-lg` | 1.125rem / 1.7 | 400 | Lead paragraphs |
| `body` | 1rem / 1.7 | 400 | Default copy |
| `small` | 0.875rem / 1.5 | 400 | Captions, meta |
| `button` | 0.9375rem / 1 / 600 | â€” | Buttons, nav |
| `eyebrow` | 0.75rem / 1.1 / 600, letter-spacing 0.08em, uppercase | â€” | Section labels |

### 3.3 Composition rules
- **Max line length:** 68ch for paragraphs (use `max-w-prose`).
- **Display headings:** max 12 words; keyword highlighted with `brand-600` or the brand gradient (`from-brand-600 to-hope-600`).
- **Hierarchy delimiter:** no rules/hairlines above or below headings â€” spacing does the work (`margin-top: 1.5x font-size` rhythm).
- **Buttons:** never set type below 15px; button label sentence case (not all-caps) for warmth.

---

## 4. Sitemap & Information Architecture

### 4.1 Marketing surface (target, all in `src/app/*`)
```
/
â”œâ”€â”€ /pricing                      â†’ 3 tiers + comparison (Â§5.5)
â”œâ”€â”€ /faq                          â†’ grouped accordions (Safety/Legal/Privacy/Pricing)
â”œâ”€â”€ /blog                         â†’ content hub
â”‚   â”œâ”€â”€ /blog/[slug]              â†’ dynamic posts (Supabase blog_posts)
â”œâ”€â”€ /learn-more                   â†’ Legal evidence deep-dive (SEO page)
â”œâ”€â”€ /donate                       â†’ Ko-fi give
â”œâ”€â”€ /free-assessment              â†’ lead magnet #1 (quiz)
â”œâ”€â”€ /free-narcissist-test         â†’ lead magnet #2 (quiz)
â”œâ”€â”€ /relationship-health-check    â†’ lead magnet #3 (quiz)
â”œâ”€â”€ /discard-stage-test           â†’ lead magnet #4 (quiz)
â”œâ”€â”€ /gaslighting-reality-check    â†’ lead magnet #5 (quiz)
â”œâ”€â”€ /privacy | /terms | /cookies | /gdpr   â†’ legal
â”œâ”€â”€ /auth | /signin | /forgot-password     â†’ auth
â””â”€â”€ /auth/callback                â†’ OAuth handler (route.ts)
```

### 4.2 App surface (unchanged, protected)
`/dashboard`, `/journal`, `/reality-log`, `/belief-reframe`, `/narcissist-detector`, `/narcissist-simulator`, `/safety-plan`, `/community`, `/ai-coach`, `/settings`, `/subscription`, `/admin`, â€¦ (full list in codebase)

### 4.3 IA rationale (psychology)
- **Quiz pages at top level but identical visual family** â†’ user recognizes the funnel; every quiz ends in the same email-capture + prefilled `/auth?email=â€¦` handoff. This is the **lead-magnet network effect**: five entry points, one conversion flow.
- **Pricing accessible in 1 click from everywhere** â†’ removes friction for users whose decision driver is cost, not education.
- **Legal/evidence content is second-level (`/learn-more`)** â†’ signals legitimacy without making the marketing homepage feel like a courtroom.

### 4.4 Navigation (primary)
Desktop: `Free Tools â–¾ | Pricing | Blog | FAQ | Donate | Sign in | Get Started â†’`
Mobile: full-screen slide-over menu (â–¡ together with hamburger), sticky bottom "Get Started" bar appears only after scroll past hero (reduces anxiety at first load).

---

## 5. Layout System & Section Patterns

### 5.1 Grid & spacing
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Grid: 12-col desktop, 6-col tablet, stacked mobile (Tailwind `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3/4`).
- Vertical rhythm: sections `py-20 lg:py-28`; base radius `rounded-2xl`; card standard `rounded-xl`.

### 5.2 Section blueprint (reusable)
Every marketing section = `eyebrow â†’ display-2 â†’ lead(body-lg, max-w-2xl) â†’ content grid â†’ centered CTA`. One visual idea per viewport.

---

## 6. Component Library Specification

All components are **RSC-first** (server components for static content), client components only where interactivity is required (nav menus, accordion, counters, quiz, pricing toggle). Every component ships with: `data-testid`, semantic element, focus-visible ring `ring-2 ring-brand-500 ring-offset-2`, and a `prefers-reduced-motion` safe animation (`.no-anim` when reduced).

| # | Component | Spec | Files (new) |
|---|---|---|---|
| 1 | **SiteHeader** | Sticky, `bg-white/85 backdrop-blur-md border-b border-ink-200/60`, 64px; translucent logo+wordmark; desktop nav; slide-over mobile; CTA `Get Started` (`btn-primary`). Shrinks to 56px + shadow after 8px scroll. | `src/components/marketing/SiteHeader.tsx` |
| 2 | **SiteFooter** | `bg-ink-50`, 4-col link map + crisis disclaimer line ("If you are in danger, call 911 or a local hotline"), Ko-fi/Donate, social, legal bar. | `src/components/marketing/SiteFooter.tsx` |
| 3 | **Hero** | split layout: left copy (eyebrow â†’ H1 with gradient word â†’ lead â†’ dual CTA â†’ micro trust row), right visual = animated "evidence dashboard" mock + floating mini-cards (parallax). Variant `size="center"` for internal pages. | `src/components/marketing/Hero.tsx` |
| 4 | **TrustBar** | 4 items, separated by dots: "AES-256 encrypted" Â· "Never sold or trained on" Â· "70+ languages" Â· "Export court-ready PDFs". | `src/components/marketing/TrustBar.tsx` |
| 5 | **StatCounter** | Count up on intersect (respects reduced motion); separator/suffix props. | `src/components/marketing/StatCounter.tsx` |
| 6 | **FeatureCard** | Icon (lucide, `p-3 rounded-xl bg-brand-50 text-brand-600`), title(h3), body(small), optional "Learn" ghost link. Hover: `shadow-lift -translate-y-1`. | `src/components/marketing/FeatureCard.tsx` |
| 7 | **TestimonialCard** | Quote, name, context chip (e.g. "Survivor, divorce case"), optional verified badge `Check icon`. | `src/components/marketing/TestimonialCard.tsx` |
| 8 | **PricingCard** | 3 tiers; center card elevated `scale-105` + "Most Popular" pill; check/x list; billing toggle in parent. | `src/components/marketing/PricingCard.tsx` |
| 9 | **FaqAccordion** | HeadlessUI Disclosure; first item open; smooth height animation; +/- icon rotates. | `src/components/marketing/FaqAccordion.tsx` |
| 10 | **CtaBanner** | brand gradient band (`from-brand-600 to-hope-600`), white copy, single button (primary-white). Used as section #7. | `src/components/marketing/CtaBanner.tsx` |
| 11 | **SectionHeading** | centralized `eyebrow + display-2 + lead` + `invert` prop. | `src/components/marketing/SectionHeading.tsx` |
| 12 | **QuizShell** | shared frame for the 5 free tools: progress bar, single-question-at-a-time, no back-button on final, dedicated result â†’ email capture. | `src/components/marketing/QuizShell.tsx` |
| 13 | **Reveal** | IntersectionObserver wrapper: `fade-up`, 8pxâ†’0 translate, 300ms, stagger via `delay` prop; disabled under reduced motion. | `src/components/marketing/Reveal.tsx` |
| 14 | **Logo** | SVG wordmark (proposal below) â€” replaces raster `/logo.png` on marketing surfaces. | `src/components/marketing/Logo.tsx` |

### 6.1 Buttons (consolidation)
```ts
// classes
btn-base = "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
btn-primary  = btn-base + "bg-brand-600 text-white hover:bg-brand-700 active:scale-[0.98] px-6 py-3 text-[15px] shadow-soft"
btn-secondary= btn-base + "bg-white text-ink-800 border border-ink-300 hover:bg-ink-50 hover:border-ink-400 px-6 py-3 text-[15px]"
btn-ghost    = btn-base + "text-brand-700 hover:bg-brand-50 px-4 py-2 text-[15px]"
btn-lite     = btn-base + "bg-white text-brand-700 hover:bg-brand-50 px-6 py-3"   /* for gradient banners */
```
**CTA hierarchy:** exactly **1 primary** per viewport; primaries on brand-600; never two adjacent same-level CTAs with different colors.

---

## 7. Landing Page Blueprint (section-by-section)

| # | Section | Component | Key micro-interaction | Conversion job |
|---|---|---|---|---|
| 1 | Header | SiteHeader | shrink-on-scroll, gradient logo glow | navigation + first CTA |
| 2 | Hero | Hero | staggered fade-up on first paint; floating cards parallax | primary CTA **"Start Free Assessment"** |
| 3 | TrustBar | TrustBar | static, high-contrast | pre-empt skepticism after headline |
| 4 | "Why Reclaim" visual proof | custom | scroll-triggered dashboard mockup (perspective) | explain product in 3s |
| 5 | Free tools grid | FeatureCard Ã—5 | hover lift + icon colorize | funnel entry points |
| 6 | Featured AI tools | FeatureCard (featured variant) | reveal stagger | depth â†’ premium perception |
| 7 | Features grid ("Evidence-based toolkit") | FeatureCard Ã—14 | stagger two-by-two | coverage/authority |
| 8 | Stat rail | StatCounter | count-up on intersect | social proof |
| 9 | Testimonials | TestimonialCard (3-col) | fade-in carousel (auto, pause on hover) | social proof + emotional mirror |
| 10 | How it works (3 steps) | numbered timeline | scroll-linked progress line | reduce fear of complexity |
| 11 | Pricing | PricingCard Ã—3 + toggle | toggle crossfade; popular card pulse-once | monetization |
| 12 | FAQ (5 questions) | FaqAccordion | smooth expand | objection handling near the close |
| 13 | Final CTA | CtaBanner | gradient sheen sweep once on intersect | last-chance conversion |
| 14 | Footer | SiteFooter | â€” | trust + escape routes (privacy/crisis) |

---

## 8. Motion & Micro-interaction Spec

All times in ms, `cubic-bezier(.22,1,.36,1)` unless noted. **Non-negotiable:** anything animated must not recreate on loop, not auto-play for >5s, and must fully respect `prefers-reduced-motion` (`@media (prefers-reduced-motion: reduce) { *,::before,::after { animation:none!important; transition:none!important } }`).

| Interaction | Spec | Psychology |
|---|---|---|
| Scroll reveal | `opacity 0â†’1; translateY(8pxâ†’0); 300ms; stagger 80ms` | gradual mastery â†’ reduces overwhelm |
| Hover card | `translateY(-4px) + shadow-lift 200ms` | affordance "these are tap-able rooms" |
| Button press | `scale(0.98) 100ms` | tactile feedback = reliability |
| Count-up | 600â€“1200ms ease-out, digits only | proof lands as "fact" |
| Section eyebrow | `letter-spacing` shrink on reveal | subtle focused intent |
| Mobile menu | slide-over 250ms + dim (rgba(28,25,23,.4)) | focused task, no page shift |
| Accordion | height 220ms ease | low-friction Q&A |
| Nav bar | 8px scroll â†’ 56px height + shadow | direction signal, reduced chrome |
| Page transitions | none (SPA-style avoided for SEO/perf) | predictable, fast |

**Performance guardrails:** no layout animations (`transform/opacity` only), no heavy blur during scroll (backdrop-blur only on static header), LCP element (hero H1) never animated *into* view with opacity that blocks it â€” reveal hero before LCP threshold or keep H1 static.

---

## 9. Responsive Behavior Matrix

| Breakpoint | Header | Hero | Cards | Pricing | Quiz |
|---|---|---|---|---|---|
| <640px (mobile) | hamburger + logo, sticky bottom CTA after scroll | stacked, H1 `clamp` min | 1-col | stacked, popular card first (mobile order change via `order-2`) | full-screen steps, sticky progress |
| 640â€“1023 (tablet) | hamburger | stacked, visual under copy | 2-col | 3-col squeezed / 2+1 | full-width steps |
| â‰¥1024 (desktop) | full nav | 60/40 split | 3â€“4-col | 3-col, center elevated | centered 720px column |

Mobile specifics:
- Tap targets â‰¥ 44Ã—44px.
- No horizontal scroll ever (`overflow-x-hidden` on body is banned as a mask â€” fix real overflow issues in QA).
- Floating crisis widget stays â‰¤ 56px and never overlaps sticky CTA (place CTA left-bottom, widget right-bottom).

---

## 10. Performance, Accessibility, SEO

### 10.1 Performance budget (Netlify, mobile 4G)
| Metric | Target |
|---|---|
| LCP | â‰¤ 2.0s (hero text static; hero image `priority` + `fetchPriority="high"`) |
| CLS | â‰¤ 0.05 (fixed aspect ratios on all media; no late-loading layout shifts) |
| INP | â‰¤ 200ms |
| TBT | â‰¤ 200ms |
| Bundle | Marketing pages â‰¤ 120KB gzipped JS total; icons tree-shaken via `lucide-react` named imports (already) |

Techniques: `next/font` (font-display swap + preload latin), `next/image` unoptimized already configured â€” keep raster assets â‰¤ 1600px wide/WebP, defer non-critical components via `next/dynamic` (testimonials, footer widget), no third-party scripts on first paint except GA (already conditional).

### 10.2 Accessibility
- Semantic landmarks: `header/nav/main/footer`; one `h1` per page.
- All interactive elements focusable and operable by keyboard; visible focus ring (brand-500, 2px, offset 2).
- `alt` text for all imagery; decorative icons `aria-hidden`.
- Color contrast per Â§2.3.
- Forms: real `<label>`, `required` + error messages linked via `aria-describedby`; quiz progress announced with `aria-live="polite"`.
- Anxiety-safe copy patterns in `aria-label` (e.g., hamburger = "Open menu" not "Menu").
- Respect `prefers-reduced-motion` globally.
- Target Lighthouse a11y â‰¥ 95.

### 10.3 SEO
- Per-page unique `<title>` (â‰¤ 60 chars) + meta description (â‰¤ 155 chars).
- `metadataBase` set (`https://reclaimyourlife.app`) â€” currently missing (build warning exists).
- Indexability: `robots.txt`, `sitemap.xml` (dynamic, from routes), canonical URLs, OG/Twitter cards on marketing + FAQ schema `FAQPage` + product schema `SoftwareApplication`.
- Server components for all marketing text (already) + no client-side sensitive content.
- Internal linking from every quiz result â†’ related tool â†’ blog â†’ pricing (topical authority).

---

## 11. Design Tokens Implementation (Tailwind v4)

See `src/styles/tokens.css` (paste into `src/app/globals.css` inside the existing `@theme` section, if present, else create `@theme`):

1. Add the `@theme` block from Â§2.1.
2. Replace classes globally, in order of blast-radius, using find/replace on marketing files *only*:
   - `indigo-600` â†’ `brand-600`, `indigo-700` â†’ `brand-700`, `indigo-50` â†’ `brand-50`, `indigo-500` â†’ `brand-500`
   - `purple-600` â†’ `hope-600`, `purple-50` â†’ `hope-50`, etc.
   - `gray-900` â†’ `ink-900`, `gray-700` â†’ `ink-700`, `gray-600` â†’ `ink-600`, `gray-500` â†’ `ink-500`, `gray-50` â†’ `ink-50`, `white/80` borders â†’ `ink-200/60`
3. Keep product/dashboard utilities untouched this phase (or do a second, checked-in pass).
4. Add `--font-display` to `font-sans`/`font-display` utilities and apply `font-display` to `h1,h2,h3` in `@layer base`.

**Rollback safety:** token renames are pure class swaps; keep a migration commit per file group.

---

## 12. Conversion Strategy & User Journeys

### 12.1 Funnel
```
Cold visit â†’ Quiz page (0 form) â†’ 5 questions â†’ Result (adds value) 
â†’ Email capture (name + email, optional) â†’ /auth?email=â€¦ (prefilled)
â†’ try a tool in Foundation â†’ usage limit (429 â€œupgrade_requiredâ€) â†’ /pricing â†’ Stripe
```
Every junction gives value **before** asking. Quiz results are genuinely useful and shareable (`ViralResultShare` already exists â†’ keep).

### 12.2 CTA copy bank (respects voice rules)
- Hero primary: **"Start free assessment"** Â· secondary: **"Explore free tools"**
- Mid-page (after features): **"See how it works"** â†’ `/learn-more`
- After results: **"Create your secured account"**
- Pricing: **"Start free â€” upgrade anytime"**
- Final banner: **"Begin today. Reclaim your peace."**
- Crisis (always available): **"ðŸš¨ Immediate support"** â†’ safety-plan + hotline links

### 12.3 Trust injections per section
Hero â†’ TrustBar; Features â†’ "Built by trauma-informed practitioners"; Pricing â†’ "Cancel anytime Â· 7-day money-back on paid plans (verify with product)" ; Footer â†’ SSL + privacy statement + crisis line.

---

## 13. Implementation Plan (phases, developer-ready)

### Phase 0 â€” Foundation (Â½ day)
- Add `@theme` tokens (Â§2.1), font stack (Â§3.1), base heading rules (Â§3.3), motion-safe base (Â§8).
- Add `--font-display`; set `metadataBase` in `layout.tsx`; fix hydration-preload warning on `<body>` class (move `preload` class handling to suppress mismatch or remove class â€” see Investigation note Â§13.5).
- **Files:** `src/app/globals.css`, `src/app/layout.tsx`, `next.config.ts` (if metadataBase needs env).

### Phase 1 â€” Component library (1 day)
- Build components from Â§6 with variants & tests ids.
- **Files (all new):** `src/components/marketing/{SiteHeader,SiteFooter,Logo,Hero,TrustBar,StatCounter,FeatureCard,TestimonialCard,PricingCard,FaqAccordion,CtaBanner,SectionHeading,QuizShell,Reveal}.tsx`

### Phase 2 â€” Landing page rebuild (1 day)
- Rewrite `src/app/page.tsx` to the Â§7 blueprint (keep server-component auth redirect to `/dashboard`).
- Wire `SiteHeader/SiteFooter`; remove inline header/footer leftovers.

### Phase 3 â€” Supporting marketing pages (1â€“1.5 days)
- Update `src/app/pricing/page.tsx` (PricingCard + toggle + comparison table).
- Update `src/app/faq/page.tsx` (FaqAccordion + FAQPage JSON-LD).
- Consolidate the five quiz pages onto `QuizShell` (keep current logic, replace frame).
- Update `learn-more`, `donate`, `blog` chrome.

### Phase 4 â€” Motion & polish (Â½â€“1 day)
- Apply `Reveal` wrappers, `StatCounter`, hero parallax; add reduced-motion gate; run performance pass (Â§10.1).

### Phase 5 â€” SEO/accessibility audit & QA (1 day)
- `sitemap.xml`, canonical/OG fix, Lighthouse â‰¥ 90 perf / â‰¥95 a11y / â‰¥95 SEO, manual keyboard + screen-reader walkthrough, real-device mobile checks (Â§9), page weight budget.

### 13.1 File map (authoritative)
| File | Action |
|---|---|
| `src/app/globals.css` | edit: @theme, base, motion-safe |
| `src/app/layout.tsx` | edit: fonts, metadataBase, body-class fix |
| `src/app/page.tsx` | rewrite landing |
| `src/app/pricing/page.tsx`, `src/app/faq/page.tsx` | rebuild with new components |
| `src/app/{free-assessment,free-narcissist-test,relationship-health-check,discard-stage-test,gaslighting-reality-check}/page.tsx` | reframe onto QuizShell |
| `src/app/learn-more/page.tsx`, `src/app/donate/page.tsx`, `src/app/blog/page.tsx` | adopt components, keep content |
| `src/components/marketing/*` | new (Â§6) |
| `public/*` | update favicon/apple-icon tsets + OpenGraph image; add `sitemap.xml` |

### 13.2 Dependency budget (no new runtime deps)
Use existing `framer-motion`, `@headlessui/react`, `lucide-react`. Everything in Â§6 is achievable with them. `Fraunces`/`JetBrains Mono` come from `next/font/google` (zero runtime cost).

### 13.3 Definition of Done (acceptance)
- `npm run build` green; `npm run lint` green.
- Lighthouse (desktop+mobile): perf â‰¥ 90, a11y â‰¥ 95, SEO â‰¥ 95.
- All marketing routes on server, no client-only flashes, no hydration warnings.
- Keyboard-only round trip on: header, menus, quiz, accordion, pricing toggle.
- Reduced-motion: entire site static (no reveals, no counters, no parallax).
- Mobile: no horizontal scroll; sticky CTA + crisis widget never overlap.
- Copy passes the voice gate (Â§1.2) â€” grep for '!', 'super', 'amazing'.

### 13.4 Risks & mitigations
| Risk | Mitigation |
|---|---|
| Class rename breaks a dashboard page accidentally | Phase token migration per directory + `git diff` review per commit |
| `prefers-reduced-motion` hides CTAs | Motion only affects transform/opacity; layout/visibility never gated on animation |
| Supabase paused (current) | Marketing site must render fully static with zero DB calls on first load â€” already true for `/` except auth check; keep it that way |
| Fraunces LCP impact | `display: swap`, only headings; preload latin subset |
| Turnstile disabled for testing | Re-enable at deploy (see `docs/TURNSTILE_INTEGRATION.md`) |

### 13.5 Known pre-existing items to fix (tracked)
1. Body-class hydration mismatch (`preload`) â€” remove conditional class or the script toggling it; verifies instantly.
2. `metadataBase` warning â€” set to `https://reclaimyourlife.app`.
3. `.env.local` has a paused Supabase project (`gstiokcvqmxiaqzmtzmv`) â€” restore before login testing (Â§ pending from session).
4. `manifest.json` is stale ("App", Android-only) â€” refresh name/icons/scope.

---

## 14. Priority Order for First Paw-print

If timeboxed, implement **Phase 0 â†’ 2 â†’ 12.2 CTA copy**, which alone delivers the visible "premium" shift (type system, tokens, hero, CTA discipline). Phases 1, 3, 4 follow for completeness; Phase 5 gates launch.

---

*Prepared for the Reclaim team. Comments, review, and deviation requests must be logged against this document's version header.*