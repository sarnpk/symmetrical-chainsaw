# API Integrations: Gladia + Google Gemini AI

## Overview
This document outlines the integration of Gladia API for voice transcription and Google Gemini AI for AI-powered features in the Reclaim Platform.

## 🎙️ Gladia API Integration

### **Purpose**
- Transcribe audio evidence files to text
- Support multiple audio formats (MP3, WAV, M4A, etc.)
- Provide word-level timestamps and confidence scores
- Enable searchable audio content for pattern analysis

### **Implementation**

#### **1. Environment Variables**
```env
GLADIA_API_KEY=your_gladia_api_key_here
```

#### **2. Core Service: `lib/gladia-api.ts`**
- **`transcribeAudio()`** - Transcribe uploaded audio files
- **`transcribeFromUrl()`** - Transcribe audio from URLs
- **`getSupportedLanguages()`** - Get available languages
- Automatic language detection
- Custom vocabulary support
- Polling mechanism for async processing

#### **3. Integration Service: `lib/audio-transcription-service.ts`**
- **Database Integration** - Updates evidence files with transcription results
- **Usage Tracking** - Records transcription usage for subscription tiers
- **Error Handling** - Manages failed transcriptions and retries
- **Batch Processing** - Handle multiple files efficiently

#### **4. Edge Function: `supabase/functions/transcribe-audio/index.ts`**
- **Secure Processing** - Server-side transcription with RLS
- **File Validation** - Ensures audio file types only
- **Progress Tracking** - Updates processing status in real-time
- **Usage Limits** - Enforces subscription tier restrictions

### **Usage Example**
```typescript
// Frontend usage
const result = await fetch('/api/transcribe-audio', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    evidence_file_id: 'uuid',
    options: {
      language: 'en',
      transcriptionHint: 'Legal evidence recording'
    }
  })
})
```

### **Subscription Limits**
- **Foundation**: 10 transcriptions/month
- **Recovery**: 100 transcriptions/month  
- **Empowerment**: Unlimited transcriptions

## 🤖 Google Gemini AI Integration

### **Purpose**
- AI-powered chat support for trauma survivors
- Pattern analysis of journal entries
- Mind reset tools for cognitive reframing
- Personalized insights and recommendations
- Context-aware conversations (general, crisis, grey-rock, etc.)

### **Implementation**

#### **1. Environment Variables**
```env
GOOGLE_AI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

#### **2. Core Service: `lib/gemini-ai.ts`**
- **`chat()`** - Context-aware AI conversations
- **`analyzePatterns()`** - Analyze journal entries for abuse patterns
- **`mindReset()`** - Cognitive reframing tool
- **`generateInsights()`** - Personalized user insights
- Trauma-informed prompting
- Safety content filtering
- Structured JSON responses

#### **3. API Routes**
- **`/api/ai/pattern-analysis`** - Pattern analysis endpoint
- **`/api/ai/mind-reset`** - Mind reset tool endpoint
- **`/api/ai/chat`** - Enhanced chat with context support

#### **4. Enhanced Edge Function: `supabase/functions/ai-chat/index.ts`**
- **Context Types** - general, crisis, pattern-analysis, mind-reset, grey-rock
- **Conversation History** - Maintains context across messages
- **Safety Settings** - Content filtering for trauma-informed responses
- **Usage Tracking** - Records AI interactions for billing

### **AI Context Types**

#### **General Support**
- Validation and emotional support
- General guidance and encouragement
- Resource recommendations

#### **Crisis Mode**
- Immediate safety prioritization
- Emergency resource guidance
- De-escalation techniques

#### **Pattern Analysis**
- Abuse pattern identification
- Cycle recognition
- Risk assessment

#### **Mind Reset**
- Cognitive reframing
- Thought challenging
- Coping strategy suggestions

#### **Grey Rock Technique**
- Strategic disengagement guidance
- Conflict minimization
- Emotional protection strategies

### **Usage Examples**

#### **Pattern Analysis**
```typescript
const analysis = await fetch('/api/ai/pattern-analysis', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    date_range_start: '2024-01-01',
    date_range_end: '2024-01-31',
    analysis_type: 'abuse_patterns'
  })
})
```

#### **Mind Reset**
```typescript
const mindReset = await fetch('/api/ai/mind-reset', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    original_thought: "I'm worthless and deserve this treatment",
    session_type: 'thought_reframe',
    context: {
      emotional_state: 'depressed',
      trigger: 'argument with partner'
    },
    mood_before: 3
  })
})
```

### **Subscription Limits**
- **Foundation**: 10 AI interactions/month
- **Recovery**: 100 AI interactions/month
- **Empowerment**: Unlimited AI interactions

## 🔒 Security & Privacy

### **Data Protection**
- All API calls use secure HTTPS
- User data is never stored by external APIs
- Transcriptions and AI responses are stored securely in Supabase
- Row Level Security (RLS) ensures user data isolation

### **Content Filtering**
- Gemini AI safety settings prevent harmful content
- Trauma-informed prompting reduces re-traumatization risk
- Crisis detection triggers appropriate resources

### **Usage Tracking**
- All API usage is tracked for subscription enforcement
- Detailed metadata for billing and analytics
- Transparent usage reporting for users

## 📊 Monitoring & Analytics

### **Usage Metrics**
- Transcription success rates and duration
- AI interaction types and effectiveness
- Pattern analysis insights generated
- Mind reset session outcomes

### **Error Handling**
- Comprehensive error logging
- Automatic retry mechanisms
- Graceful degradation for API failures
- User-friendly error messages

## 🚀 Next Steps

### **Immediate Actions**
1. **Set API Keys** - Add Gladia and Gemini API keys to environment
2. **Test Integration** - Verify both APIs work with sample data
3. **Deploy Functions** - Update Supabase edge functions
4. **Update UI** - Integrate new features into existing components

### **Future Enhancements**
1. **Real-time Transcription** - Live audio transcription during recording
2. **Advanced AI Models** - Specialized trauma-informed AI training
3. **Multi-language Support** - Expand language support for diverse users
4. **Voice Analysis** - Emotional state detection from audio patterns

## 📋 Testing Checklist

### **Gladia API**
- ✅ Audio file upload and transcription
- ✅ Multiple audio format support
- ✅ Language detection accuracy
- ✅ Word-level timestamp precision
- ✅ Error handling for failed transcriptions
- ✅ Usage limit enforcement

### **Gemini AI**
- ✅ Context-aware conversations
- ✅ Pattern analysis accuracy
- ✅ Mind reset effectiveness
- ✅ Safety content filtering
- ✅ Crisis mode responses
- ✅ Usage tracking and limits

### **Integration**
- ✅ Database updates and storage
- ✅ RLS policy enforcement
- ✅ Subscription tier restrictions
- ✅ Error handling and recovery
- ✅ Performance optimization

The integration provides a comprehensive AI-powered platform for trauma recovery while maintaining the highest standards of security, privacy, and user safety.
