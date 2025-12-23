# Ko-fi Setup

## Quick Setup
1. Create Ko-fi account at https://ko-fi.com
2. Get your Ko-fi page URL (e.g., `https://ko-fi.com/yourname`)
3. Replace donation links in components

## Integration Points
- `/donate` route → redirect to Ko-fi page
- Donation buttons in result pages
- Replace `Link href="/donate"` with Ko-fi URL

## Environment Variables
```
NEXT_PUBLIC_KOFI_URL=https://ko-fi.com/yourname
```

## Usage
```tsx
<Link href={process.env.NEXT_PUBLIC_KOFI_URL} target="_blank">
  💜 Donate $5
</Link>
```