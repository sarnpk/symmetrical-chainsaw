# CRO Audit and Rewrite - Reclaim App

## Executive Summary
Comprehensive audit of landing page (page.tsx) and pricing page (pricing/page.tsx) reveals strong foundation with key optimization opportunities.

## Critical Issues Found

### 🔴 High Priority (Immediate Action)
1. **Multiple CTAs Competing** - 3 primary CTAs in hero section dilute focus
2. **Pricing Transparency** - No clear pricing on landing page forces extra click
3. **Value Proposition Clarity** - Benefits buried in feature lists
4. **Mobile UX** - Complex layouts may not convert well on mobile
5. **Cognitive Load** - Too many features presented simultaneously

### 🟡 Medium Priority
1. **Social Proof Missing** - No testimonials, user counts, or reviews
2. **Urgency/Scarcity** - No compelling reason to act now
3. **Trust Signals** - Limited credibility indicators
4. **Feature Overload** - 14+ features overwhelming users

## Detailed Findings

### Landing Page Analysis

#### ✅ Strengths
- Strong emotional hook ("Your Journey to Recovery Starts Here")
- Clear target audience (narcissistic abuse survivors)
- Free tools reduce friction
- Professional design and branding
- Good SEO metadata

#### ❌ Conversion Killers
1. **Hero Section Issues**
   - 3 competing CTAs: "Free Narcissist Test", "Discard Stage Test", "AuthButton"
   - No clear primary action
   - Value proposition too generic

2. **Pricing Confusion**
   - Pricing mentioned but requires navigation to separate page
   - No clear upgrade path from free tools
   - Subscription tiers buried at bottom

3. **Feature Overwhelm**
   - 14+ features listed without prioritization
   - Benefits not clearly connected to pain points
   - Technical jargon ("CBT", "BIFF", "JADE")

### Pricing Page Analysis

#### ✅ Strengths
- Clear tier comparison
- Detailed feature breakdown
- Annual discount incentive
- Professional presentation

#### ❌ Conversion Barriers
1. **No Social Proof** - Missing testimonials or user success stories
2. **Feature Complexity** - Too many technical details
3. **No Risk Reduction** - Missing money-back guarantee or free trial period
4. **Weak Value Communication** - Features listed but benefits unclear

## Recommended Fixes

### Phase 1: Quick Wins (1-2 days)

1. **Simplify Hero CTAs**
   - Make "Start Free Today" the primary CTA
   - Move free tools to secondary position
   - Add pricing preview ("Starting at $0/month")

2. **Add Social Proof**
   - "Join 80,000+ survivors" (use existing stat)
   - Add testimonial quotes
   - Display recent user activity

3. **Clarify Value Proposition**
   - Lead with outcome: "Stop Second-Guessing Yourself"
   - Focus on 3 core benefits vs 14 features
   - Use emotional language over technical terms

### Phase 2: Major Improvements (1 week)

1. **Restructure Landing Page**
   - Hero: Problem + Solution + Primary CTA
   - Social Proof section
   - 3 Core Benefits (not 14 features)
   - Pricing preview
   - Risk reversal (guarantee)

2. **Optimize Pricing Page**
   - Add "Most Popular" badges
   - Include money-back guarantee
   - Simplify feature descriptions
   - Add urgency element

3. **Mobile Optimization**
   - Single column layouts
   - Larger touch targets
   - Simplified navigation

### Phase 3: Advanced Optimization (2 weeks)

1. **A/B Testing Setup**
   - Test hero headlines
   - Test CTA button colors/text
   - Test pricing presentation

2. **Conversion Funnel**
   - Track user journey from landing → pricing → signup
   - Identify drop-off points
   - Optimize each step

## Specific Code Changes Needed

### Landing Page (page.tsx)
```typescript
// BEFORE: Multiple competing CTAs
<a href="/free-narcissist-test">Free Narcissist Test</a>
<a href="/discard-stage-test">Discard Stage Test</a>
<AuthButton variant="primary" />

// AFTER: Single primary CTA
<AuthButton variant="primary" size="large">Start Free Recovery Today</AuthButton>
<div className="secondary-actions">
  <a href="/free-narcissist-test">Try Free Assessment</a>
</div>
```

### Pricing Page (pricing/page.tsx)
```typescript
// ADD: Social proof and guarantees
<div className="trust-signals">
  <p>"This saved my sanity" - Sarah M.</p>
  <p>30-day money-back guarantee</p>
  <p>Join 80,000+ survivors</p>
</div>
```

## Success Metrics to Track

### Primary KPIs
- **Conversion Rate**: Landing page → Sign up
- **Upgrade Rate**: Free → Paid subscription
- **Time to Convert**: Days from first visit to payment

### Secondary Metrics
- Bounce rate on landing page
- Pricing page engagement
- Feature usage after signup
- Customer lifetime value

## Implementation Priority

1. **Week 1**: Hero CTA simplification + social proof
2. **Week 2**: Pricing transparency + value proposition
3. **Week 3**: Mobile optimization
4. **Week 4**: A/B testing setup

## Expected Impact
- **15-25%** increase in landing page conversion
- **10-20%** increase in free-to-paid conversion
- **30%** reduction in bounce rate
- **Improved** user experience and clarity

## Next Steps
1. Implement Phase 1 quick wins
2. Set up conversion tracking
3. Begin A/B testing framework
4. Monitor and iterate based on data