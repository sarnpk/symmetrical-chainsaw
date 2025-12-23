# Quick Start - Narcissist Features

## 🚀 Get Started in 3 Steps

### Step 1: Run Database Migrations

```bash
cd reclaim-app
supabase db push
```

This will create/fix all necessary tables.

### Step 2: Test the Features

**Narcissist Detector** (`/narcissist-detector`):
1. Click any analysis tab
2. Enter text or select traits
3. Click analyze
4. Check "Recent Analyses" sidebar updates

**Narcissist Simulator** (`/narcissist-simulator`):
1. Select narcissist type and scenario
2. Click "Start Simulation"
3. Practice responses
4. Click "Predict Next Move" to see what's coming

**Manipulation Decoder** (`/manipulation-decoder`):
1. Enter a message
2. Click "AI Analyze"
3. Check history updates

### Step 3: Verify Everything Works

Open browser console and check for:
- ✅ "Analysis saved successfully"
- ✅ "AI analysis saved successfully"
- ✅ No error messages
- ✅ History updates in UI

---

## 🔍 Quick Troubleshooting

### History Not Saving?

**Check Console Logs**:
```
Look for: "Saving analysis:", "Insert data:", "saved successfully"
If you see errors, check the error message
```

**Common Fixes**:
1. Run migrations: `supabase db push`
2. Check user is authenticated
3. Verify RLS policies: `SELECT * FROM pg_policies WHERE tablename = 'narcissist_analyses'`

### Predictions Not Working?

**Check**:
1. Need at least 2 messages in conversation
2. Check console for "Prediction error"
3. Verify GOOGLE_AI_API_KEY is set

### AI Analysis Failing?

**Check**:
1. GOOGLE_AI_API_KEY environment variable
2. Usage limits not exceeded
3. Console logs for specific error

---

## 📚 Documentation Quick Links

- **User Guides**:
  - [Narcissist Detector Guide](docs/NARCISSIST_DETECTOR_GUIDE.md)
  - [Custom Context Guide](docs/NARCISSIST_SIMULATOR_CUSTOM_CONTEXT_GUIDE.md)

- **Technical Docs**:
  - [Simulator Implementation](NARCISSIST_SIMULATOR_IMPLEMENTATION.md)
  - [Predict Feature](PREDICT_NEXT_MOVE_FEATURE.md)
  - [Session Summary](SESSION_SUMMARY_NARCISSIST_FEATURES.md)

- **Fix Guides**:
  - [Detector History Fix](FIX_NARCISSIST_DETECTOR_HISTORY.md)
  - [Decoder History Fix](FIX_MANIPULATION_DECODER_HISTORY.md)

---

## ✨ Key Features

### Narcissist Simulator
- 🎭 3 narcissist types
- 📝 5 scenarios (including custom context)
- 💬 Real-time feedback
- 🔮 Predict next moves
- 📊 Effectiveness ratings

### Narcissist Detector
- ✓ Trait checklist
- 📝 Behavior description
- 💬 Single message analysis
- 💬 Full conversation analysis
- 📜 History tracking

### Manipulation Decoder
- 🔍 Basic keyword analysis
- 🤖 AI deep analysis
- 💡 Grey rock responses
- 📜 History tracking

---

## 🎯 Quick Tips

**For Best Results**:
1. Use Custom Context in simulator for realistic practice
2. Try Predict Next Move to prepare for interactions
3. Save analyses to track patterns over time
4. Check help buttons (?) for detailed guides

**For Debugging**:
1. Always check browser console first
2. Look for specific error messages
3. Verify database migrations ran
4. Check RLS policies if permission errors

---

## 🆘 Need Help?

1. Check browser console for errors
2. Review fix guides for your specific issue
3. Verify migrations ran successfully
4. Check database directly if needed

---

**Ready to go!** All features are implemented and documented. Run the migrations and start testing! 🎉
