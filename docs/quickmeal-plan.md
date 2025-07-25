# 🚀 AI Migration to Supabase Edge Functions - Implementation Plan

**Date:** July 2025  
**Version:** 3.0  
**Status:** Migration Planning  

---

## 📋 **Current State Analysis**

### Existing AI Integration:
- ✅ **Frontend AI Service**: `lib/ai/service.ts` with DeepSeek/Gemini providers
- ✅ **Quota System**: Database functions for quota checking/incrementing
- ✅ **QuickMeal Flow**: Frontend calls AI service directly
- ✅ **Error Handling**: Comprehensive error handling in frontend
- ❌ **API Key Exposure**: API keys currently exposed to frontend via environment variables

### Security Issues Identified:
1. **API Keys in Frontend**: `EXPO_PUBLIC_DEEPSEEK_API_KEY` exposed to client
2. **Direct AI Calls**: Frontend makes direct API calls to DeepSeek/Gemini
3. **Quota Bypass Risk**: Client-side quota validation can be bypassed
4. **No Server-Side Validation**: All validation happens client-side

---

## 🎯 **Migration Plan Overview**

### **Phase 1: Create Supabase Edge Function**
### **Phase 2: Update Database Schema**  
### **Phase 3: Migrate Frontend Logic**
### **Phase 4: Testing & Deployment**

---

## 📝 **Detailed Implementation Plan**

### **Phase 1: Create Supabase Edge Function**

#### **Step 1.1: Create Edge Function Structure**
**New Files:**
- `supabase/functions/ai-service/index.ts` - Main Edge Function
- `supabase/functions/ai-service/types.ts` - Type definitions
- `supabase/functions/ai-service/providers/` - AI provider implementations
- `supabase/functions/ai-service/config.ts` - Configuration
- `supabase/functions/ai-service/validation.ts` - Response validation

**Edge Function Features:**
- ✅ Quota checking and incrementing
- ✅ DeepSeek/Gemini API calls with fallback
- ✅ Response validation and sanitization
- ✅ Comprehensive error handling
- ✅ Usage tracking and logging
- ✅ Rate limiting
- ✅ Caching (optional)

#### **Step 1.2: Environment Variables Migration**
**Current (Frontend):**
```env
EXPO_PUBLIC_DEEPSEEK_API_KEY=xxx
EXPO_PUBLIC_GEMINI_API_KEY=xxx
```

**New (Edge Function):**
```env
DEEPSEEK_API_KEY=xxx
GEMINI_API_KEY=xxx
```

**Frontend Cleanup:**
- Remove all `EXPO_PUBLIC_AI_*` environment variables
- Keep only UI-related environment variables

---

### **Phase 2: Update Database Schema**

#### **Step 2.1: Add AI Request Logging Table**
**New Migration:** `011_create_ai_request_logs.sql`

```sql
CREATE TABLE public.ai_request_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  request_type TEXT NOT NULL, -- 'quickmeal', 'recipe', 'mealplan'
  provider_used TEXT NOT NULL, -- 'deepseek', 'gemini'
  tokens_used INTEGER,
  cost_estimate DECIMAL(10,4),
  response_time_ms INTEGER,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Step 2.2: Add Edge Function Configuration Table**
**New Migration:** `012_create_ai_config.sql`

```sql
CREATE TABLE public.ai_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### **Phase 3: Migrate Frontend Logic**

#### **Step 3.1: Create New Frontend AI Service**
**New File:** `lib/ai/edge-service.ts`

**Features:**
- ✅ Single method: `generateQuickMealSuggestions(preferences)`
- ✅ Automatic quota checking
- ✅ Error handling and retry logic
- ✅ Type-safe request/response handling
- ✅ Loading states and user feedback

#### **Step 3.2: Update QuickMeal Screen**
**File:** `app/(tabs)/quickmeal.tsx`

**Changes:**
- Replace `ai.generateQuickMealSuggestions()` with `edgeService.generateQuickMealSuggestions()`
- Remove quota checking logic (handled by Edge Function)
- Simplify error handling
- Update loading states

#### **Step 3.3: Remove Old AI Service**
**Files to Remove/Update:**
- `lib/ai/service.ts` → Remove or deprecate
- `lib/ai/providers/deepseek.ts` → Remove
- `lib/ai/providers/gemini.ts` → Remove
- `lib/ai/config.ts` → Remove AI-specific config
- `lib/ai/types.ts` → Keep only frontend types

---

### **Phase 4: Testing & Deployment**

#### **Step 4.1: Edge Function Testing**
- ✅ Test quota checking and incrementing
- ✅ Test AI provider fallback
- ✅ Test error handling scenarios
- ✅ Test response validation
- ✅ Test rate limiting

#### **Step 4.2: Frontend Integration Testing**
- ✅ Test QuickMeal flow end-to-end
- ✅ Test error states and user feedback
- ✅ Test loading states
- ✅ Test quota limit scenarios

#### **Step 4.3: Security Validation**
- ✅ Verify no API keys in frontend bundle
- ✅ Verify quota enforcement on server-side
- ✅ Verify proper error handling
- ✅ Verify logging and monitoring

---

## 📁 **File Structure Changes**

### **New Files:**
```
supabase/
├── functions/
│   └── ai-service/
│       ├── index.ts
│       ├── types.ts
│       ├── config.ts
│       ├── validation.ts
│       └── providers/
│           ├── deepseek.ts
│           └── gemini.ts

lib/
└── ai/
    └── edge-service.ts (new)

supabase/migrations/
├── 011_create_ai_request_logs.sql (new)
└── 012_create_ai_config.sql (new)
```

### **Modified Files:**
```
app/(tabs)/quickmeal.tsx
├── Remove quota checking logic
├── Replace AI service calls
└── Simplify error handling

lib/ai/
├── service.ts (remove/deprecate)
├── providers/ (remove entire directory)
├── config.ts (remove)
└── types.ts (simplify)

package.json
├── Remove AI-related dependencies
└── Update environment variables
```

### **Removed Files:**
```
lib/ai/service.ts
lib/ai/providers/deepseek.ts
lib/ai/providers/gemini.ts
lib/ai/config.ts
```

---

## 🔧 **Implementation Steps**

### **Step 1: Create Edge Function**
1. Create `supabase/functions/ai-service/` directory
2. Implement main Edge Function with quota checking
3. Implement AI provider integrations
4. Add response validation and error handling
5. Test Edge Function locally

### **Step 2: Update Database**
1. Create migration for AI request logs table
2. Create migration for AI config table
3. Apply migrations to database
4. Test database functions

### **Step 3: Update Frontend**
1. Create new Edge AI service
2. Update QuickMeal screen to use Edge Function
3. Remove old AI service files
4. Update environment variables
5. Test frontend integration

### **Step 4: Deploy & Test**
1. Deploy Edge Function to Supabase
2. Test end-to-end flow
3. Verify security (no API keys in frontend)
4. Monitor logs and performance
5. Rollback plan if needed

---

## ⚠️ **Risk Mitigation**

### **Rollback Strategy:**
- Keep old AI service as backup during transition
- Feature flag to switch between old/new implementation
- Gradual rollout to test users first

### **Monitoring:**
- Edge Function logs for debugging
- Database logs for quota tracking
- Frontend error tracking
- Performance monitoring

### **Security Checklist:**
- ✅ No API keys in frontend bundle
- ✅ All quota checks server-side
- ✅ Proper error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Logging and audit trail

---

## 🎯 **Success Criteria**

### **Security:**
- ✅ No API keys exposed to frontend
- ✅ All AI calls go through Edge Function
- ✅ Quota enforcement on server-side
- ✅ Proper error handling without information leakage

### **Functionality:**
- ✅ QuickMeal feature works exactly as before
- ✅ Quota system works correctly
- ✅ Error handling provides good user experience
- ✅ Performance is maintained or improved

### **Maintainability:**
- ✅ Clean separation of concerns
- ✅ Easy to add new AI features
- ✅ Centralized AI logic
- ✅ Proper logging and monitoring

---

## 📊 **Current Implementation Status**

### **Existing Infrastructure:**
- ✅ QuickMeal screen exists (`app/(tabs)/quickmeal.tsx`)
- ✅ AI service exists (`lib/ai/service.ts`)
- ✅ User authentication exists
- ✅ Quota system exists in database
- ✅ User tier system exists

### **Security Issues to Fix:**
- ❌ API keys exposed to frontend
- ❌ Client-side quota validation
- ❌ Direct AI API calls from frontend
- ❌ No server-side validation

### **Migration Benefits:**
- 🔒 **Enhanced Security**: No API keys in frontend
- 🚀 **Better Performance**: Server-side processing
- 📊 **Improved Monitoring**: Centralized logging
- 🔧 **Easier Maintenance**: Single source of truth
- 💰 **Cost Control**: Better quota management

---

## 🚀 **Next Steps**

1. **Approve this migration plan**
2. **Start Phase 1**: Create Supabase Edge Function
3. **Implement step by step** with testing at each stage
4. **Deploy incrementally** to minimize risk
5. **Monitor and optimize** based on real usage

---

**Ready to proceed with implementation? Please approve this plan and I'll start with Phase 1: Creating the Supabase Edge Function.** 