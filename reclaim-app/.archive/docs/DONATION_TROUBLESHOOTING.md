# Donation System Troubleshooting Guide

## ✅ Issues Fixed

### 1. All Buttons Showing Loading State
**Problem**: Single `loading` state affected all buttons
**Solution**: Changed to `loadingAmount` that tracks which specific button is loading

### 2. Nothing Happens After Click
**Problem**: No error handling or console logging
**Solution**: Added comprehensive error handling and console logs

---

## 🧪 How to Test

### Step 1: Check Browser Console
1. Open donation page: `http://localhost:3000/donate`
2. Open browser console (F12)
3. Click any donation button
4. Look for these logs:
   ```
   Initiating donation for $ 5
   Donation API called with amount: 5
   Checkout response: { url: "..." }
   Redirecting to: https://...
   ```

### Step 2: Test Without Stripe (Ko-fi Fallback)
If you see:
```
Checkout response: { url: "https://ko-fi.com/reclaim?amount=5" }
```
This means Stripe is NOT configured, and it's using Ko-fi fallback.

**To use Ko-fi**:
1. Create account at ko-fi.com
2. Change URL in API to your Ko-fi username
3. Users will be redirected to Ko-fi to donate

### Step 3: Test With Stripe
If you want to use Stripe:

1. **Get Stripe Keys**:
   - Go to stripe.com
   - Create account
   - Get test keys from Dashboard

2. **Add to `.env.local`**:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. **Install Stripe**:
   ```bash
   npm install stripe
   ```

4. **Restart Server**:
   ```bash
   npm run dev
   ```

5. **Test Again**:
   - Click donate button
   - Should redirect to Stripe checkout
   - Use test card: 4242 4242 4242 4242

---

## 🐛 Common Errors & Solutions

### Error: "Invalid amount"
**Cause**: Amount is 0 or negative
**Solution**: Check that amount is being passed correctly

### Error: "No checkout URL received"
**Cause**: API didn't return URL
**Solution**: Check console logs in API route

### Error: "Payment failed"
**Cause**: Stripe API error
**Solution**: Check Stripe keys are correct

### Error: "Cannot read property 'auth' of undefined"
**Cause**: Supabase client not initialized
**Solution**: Check supabase-server.ts exists and exports createServerSupabaseClient

### Nothing happens, no error
**Cause**: API route not found
**Solution**: Check file exists at `src/app/api/donations/create-checkout/route.ts`

---

## 🔍 Debug Checklist

- [ ] Browser console shows "Initiating donation"
- [ ] Network tab shows POST to `/api/donations/create-checkout`
- [ ] API returns 200 status code
- [ ] Response includes `url` field
- [ ] URL is valid (starts with https://)
- [ ] Page redirects to checkout

---

## 📝 What Each Button Should Do

### Tier Buttons ($5, $25, $100):
1. Click button
2. Button shows "Processing..." (only that button)
3. API call made
4. Redirect to Stripe or Ko-fi
5. Button resets if error

### Custom Amount Button:
1. Enter amount (e.g., 50)
2. Click "Donate $50"
3. Button shows "Processing..."
4. API call made
5. Redirect to checkout

---

## 🚀 Quick Test Script

Open browser console and run:
```javascript
fetch('/api/donations/create-checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount: 5 })
})
.then(r => r.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err))
```

**Expected Response (Ko-fi)**:
```json
{
  "url": "https://ko-fi.com/reclaim?amount=5",
  "message": "Redirecting to Ko-fi..."
}
```

**Expected Response (Stripe)**:
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

---

## 🔧 Current Setup

### Without Stripe (Default):
- ✅ Redirects to Ko-fi
- ✅ No setup required
- ❌ No automatic tracking
- ❌ No donor badges

### With Stripe (Recommended):
- ✅ Professional checkout
- ✅ Automatic tracking
- ✅ Donor badges
- ✅ Webhook integration
- ⚠️ Requires setup

---

## 💡 Recommended Next Steps

1. **Test Ko-fi Flow**:
   - Click donate button
   - Should redirect to Ko-fi
   - Change URL to your Ko-fi username

2. **Or Setup Stripe**:
   - Create Stripe account
   - Add keys to .env.local
   - Install stripe package
   - Test with test card

3. **Run Database Migration**:
   ```bash
   cd reclaim-app
   supabase db push
   ```

4. **Test Full Flow**:
   - Donate → Checkout → Thank You page
   - Check database for donation record
   - Verify donor badge appears

---

## 📞 Still Not Working?

Check these files exist:
- [ ] `src/app/donate/page.tsx`
- [ ] `src/app/api/donations/create-checkout/route.ts`
- [ ] `src/lib/supabase-server.ts`
- [ ] `.env.local` (with NEXT_PUBLIC_BASE_URL)

Check console for errors:
- Browser console (F12)
- Terminal where `npm run dev` is running

If still stuck, share:
1. Browser console logs
2. Terminal error messages
3. Network tab response

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ Only clicked button shows "Processing..."
- ✅ Console shows donation logs
- ✅ Page redirects to checkout
- ✅ No errors in console
- ✅ Thank you page appears after payment

**The fixes are now in place. Test it and check the console logs!**
