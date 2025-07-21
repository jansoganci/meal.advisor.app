# MealAdvisor – Technical Design Document (Tech Spec)

**Version:** 0.1 – Draft  
**Date:** July 13, 2025  
**Author:** jansoganci  
**Status:** In Development

---

## 1. Project Overview

### 1.1 Purpose
This document explains the technical infrastructure, main technologies used, architectural decisions, and configuration standards for the MealAdvisor iOS application.

**Goal:** To develop a sustainable, secure, easily manageable, and scalable mobile application.

### 1.2 MVP Scope (1-Month Target)
- ✅ Onboarding Flow
- ✅ AI-Powered Weekly Planning  
- ✅ Shopping List Generation
- ✅ Legal Disclaimers
- ✅ i18n Support (14 languages)
- ✅ Simple Feedback System

---

## 2. Technology Stack

### 2.1 Frontend & Mobile
- **Framework:** Expo (React Native)
- **Language:** TypeScript
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **Navigation:** Expo Router v2
- **State Management:** Zustand (sufficient for MVP)

### 2.2 Backend & Database
- **Platform:** Supabase
- **Database:** PostgreSQL
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage (recipe images)
- **Real-time:** Supabase Realtime (if needed)
- **Serverless Functions:** Supabase Edge Functions (business logic & quota enforcement)

### 2.3 AI & External Services
- **Primary AI:** Deepseek API
- **Fallback AI:** Google Gemini API (backup)
- **Image Processing:** Expo Image Manipulator

### 2.4 Development Tools
- **IDE:** VS Code + Expo DevTools
- **Testing:** Jest + React Native Testing Library
- **Linting:** ESLint + Prettier
- **Version Control:** Git + GitHub

### 2.5 Platform Requirements
- **Minimum iOS Version:** 15.0+
- **Target iOS Version:** Latest stable
- **Supported Devices:** iPhone 6s and newer

---

## 3. Project Structure

```
meal.advisor/
├── app/                    # Expo Router v2 (file-based routing)
│   ├── (auth)/            # Authentication screens
│   ├── (main)/            # Main app screens
│   └── _layout.tsx        # Root layout
├── components/             # Reusable UI components
│   ├── ui/                # Basic UI components
│   └── features/          # Feature-specific components
├── lib/                   # Utilities and configurations
│   ├── supabase.ts        # Supabase client
│   ├── ai.ts              # AI service configuration
│   └── utils.ts           # Helper functions
├── hooks/                 # Custom React hooks
├── stores/                # Zustand stores
├── types/                 # TypeScript type definitions
├── constants/             # App constants and configs
├── assets/                # Images, fonts, etc.
└── docs/                  # Documentation
```

---

## 4. Configuration and Security

### 4.1 Environment Variables (.env)
```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Configuration  
EXPO_PUBLIC_DEEPSEEK_API_KEY=your_deepseek_key
EXPO_PUBLIC_DEEPSEEK_MODEL=deepseek-chat
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_key (backup)

# App Configuration
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_APP_VERSION=0.1.0
```

**Note:** All environment variables accessed by the Expo client must be prefixed with `EXPO_PUBLIC_` to be exposed at runtime. Sensitive information should not be exposed in public environment variables; keep all secrets server-side or in Supabase Edge Functions wherever possible.

### 4.2 Business Logic Constants (constants/config.ts)
```typescript
export const APP_CONFIG = {
  // User Limits (enforced in backend)
  FREE_USER_DAILY_QUICKMEAL_LIMIT: 10,
  FREE_USER_WEEKLY_PLAN_LIMIT: 1,
  PREMIUM_USER_DAILY_LIMIT: 500,
  
  // AI Configuration
  AI_MAX_TOKENS: 2000,
  AI_TEMPERATURE: 0.7,
  AI_TIMEOUT: 30000,
  
  // App Settings
  MAX_RECIPES_PER_PLAN: 7,
  MAX_INGREDIENTS_PER_RECIPE: 20,
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
}

// Supported Languages (i18n)
export const SUPPORTED_LANGUAGES = [
  'en', // English
  'ja', // Japanese
  'ko', // Korean
  'zh', // Chinese
  'th', // Thai
  'ms', // Malay
  'vi', // Vietnamese
  'id', // Indonesian
  'es', // Spanish
  'de', // German
  'nl', // Dutch
  'lt', // Lithuanian
  'et', // Estonian
  'ar'  // Arabic
] as const;
```

### 4.3 Security Rules
- ✅ API keys only in .env files
- ✅ No secret information in code
- ✅ .env files in .gitignore
- ✅ Supabase RLS active
- ✅ All API calls via HTTPS

---

## 5. Data Model

### 5.1 Main Tables (Supabase)
```sql
-- Users (automatic with Supabase Auth)
users (
  id: uuid (primary key)
  email: string
  created_at: timestamp
  updated_at: timestamp
)

-- User Profiles
user_profiles (
  id: uuid (primary key)
  user_id: uuid (foreign key)
  name: string
  dietary_restrictions: jsonb
  allergies: jsonb
  health_goals: jsonb
  created_at: timestamp
)

-- Meal Plans
meal_plans (
  id: uuid (primary key)
  user_id: uuid (foreign key)
  week_start_date: date
  plan_data: jsonb
  created_at: timestamp
)

-- Recipes
recipes (
  id: uuid (primary key)
  user_id: uuid (foreign key)
  title: string
  ingredients: jsonb
  instructions: jsonb
  nutrition_info: jsonb
  image_url: string
  is_favorite: boolean
  created_at: timestamp
)

-- Shopping Lists
shopping_lists (
  id: uuid (primary key)
  user_id: uuid (foreign key)
  plan_id: uuid (foreign key)
  items: jsonb
  created_at: timestamp
)
```

---

## 6. AI Integration

### 6.1 Deepseek API Usage
```typescript
// lib/ai.ts
export class AIService {
  private apiKey: string;
  private model: string;
  
  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY!;
    this.model = process.env.EXPO_PUBLIC_DEEPSEEK_MODEL!;
  }
  
  async generateMealPlan(userPreferences: UserPreferences): Promise<MealPlan> {
    // AI prompt engineering
    // Error handling
    // Rate limiting
  }
}
```

### 6.2 AI Security Measures
- ✅ API keys in environment
- ✅ Rate limiting will be implemented
- ✅ Comprehensive error handling
- ✅ Fallback AI service ready (Deepseek → Gemini)
- ✅ User input validation
- ✅ Quota enforcement server-side (Supabase Edge Functions)

---

## 7. State Management

### 7.1 Zustand Store Structure
```typescript
// stores/mealStore.ts
interface MealStore {
  currentPlan: MealPlan | null;
  userPreferences: UserPreferences;
  isLoading: boolean;
  
  // Actions
  generateMealPlan: () => Promise<void>;
  saveMealPlan: (plan: MealPlan) => Promise<void>;
  updatePreferences: (prefs: UserPreferences) => void;
}

export const useMealStore = create<MealStore>((set, get) => ({
  // Implementation
}));
```

---

## 8. UI/UX Standards

### 8.1 Design System
- **Colors:** iOS native colors + food-friendly palette
- **Typography:** SF Pro Display (iOS native)
- **Spacing:** 8px grid system
- **Components:** Consistent with NativeWind

### 8.2 Modular Card-Based Architecture
**Core UI Principle:** All main screens must be implemented as modular, card-based components. Each screen should be composed of reusable, self-contained components (e.g., Card1.tsx, Card2.tsx, etc.), with the main screen aggregating these cards for a clean and maintainable codebase.

**Implementation Guidelines:**
- **Card Components:** Create individual card components for each functional unit (e.g., RecipeCard, PlanCard, ProfileCard)
- **Screen Aggregators:** Main screens should aggregate multiple card components rather than implementing monolithic layouts
- **Consistent Styling:** All cards should follow consistent design patterns and spacing
- **State Management:** Each card should manage its own internal state while communicating with parent screens
- **Reusability:** Cards should be designed for reuse across different screens and contexts

**Benefits:**
- **Maintainability:** Easier to update and modify individual components
- **Reusability:** Cards can be reused across different screens
- **Testing:** Individual cards can be tested in isolation
- **Performance:** Better code splitting and lazy loading opportunities

### 8.3 Accessibility
- ✅ VoiceOver support
- ✅ Dynamic Type support
- ✅ High contrast mode
- ✅ Screen reader friendly

---

## 9. Performance Optimization

### 9.1 Mobile-First Approach
- ✅ Lazy loading images
- ✅ Optimized bundle size
- ✅ Minimal background processing
- ✅ Careful memory management

### 9.2 Caching Strategy
- ✅ Recipe images cached
- ✅ User preferences cached
- ✅ Offline fallback ready

---

## 10. Testing Strategy

### 10.1 Test Pyramid
- **Unit Tests:** Jest + React Native Testing Library
- **Integration Tests:** API calls, database operations
- **E2E Tests:** Detox (future)

### 10.2 Test Coverage Targets
- Core business logic: 80%+
- UI components: 60%+
- API integration: 90%+

---

## 11. Deployment and CI/CD

### 11.1 Development Workflow
1. **Local Development:** Testing with Expo Go
2. **Staging:** Expo EAS Build
3. **Production:** App Store Connect

### 11.2 Build Configuration
```json
// eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "distribution": "store"
    }
  }
}
```

### 11.3 Backend Architecture Notes
- **MVP:** Supabase Edge Functions will be used (serverless API endpoints)
- **Scale:** As the product grows, heavy business logic may be moved to dedicated backend
- **Maintainability:** Backend services may be managed as separate project in the future

---

## 12. Monitoring and Analytics

### 12.1 Error Tracking
- **Development:** Console logs
- **Production:** Sentry (future)

### 12.2 Analytics
- **User Behavior:** Simple custom tracking
- **Performance:** Expo Performance Monitor
- **Business Metrics:** Custom events

---

## 13. Security and Privacy

### 13.1 Data Protection
- ✅ KVKK/GDPR compliant
- ✅ User consent management
- ✅ Data export capability
- ✅ Account deletion

### 13.2 App Store Requirements
- ✅ Privacy Policy
- ✅ Terms of Service
- ✅ App Store Guidelines compliance

---

## 14. Future Plans (Phase 2)

### 14.1 Premium Features
- Advanced meal planning
- Detailed nutrition tracking
- Social features
- Offline access

### 14.2 Technical Improvements
- **Push Notifications:** Will be implemented in Phase 2
  - Local notifications can be tested in MVP
  - Real push notifications require Apple Developer account ($99/year)
  - Will be prioritized post-MVP and App Store distribution
- Camera integration
- Advanced AI features
- Performance optimizations

---

## 15. Risk Management

### 15.1 Technical Risks
- **AI API Limits:** Fallback services ready (Deepseek → Gemini)
- **Supabase Downtime:** Offline mode
- **App Store Rejection:** Guidelines compliance
- **Quota Bypass:** All quota logic enforced server-side

### 15.2 Business Risks
- **User Adoption:** MVP feedback loop
- **Competition:** Unique value proposition
- **Monetization:** Freemium model

---

## 16. Documentation Standards

### 16.1 Code Documentation
- ✅ JSDoc comments
- ✅ README files
- ✅ API documentation
- ✅ Component stories

**Note:** No dedicated component library or Storybook is planned for MVP. UI components will be documented inline via JSDoc and README files.

### 16.2 Maintenance
- ✅ Regular dependency updates
- ✅ Security patches
- ✅ Performance monitoring
- ✅ User feedback integration

---

**Last Updated:** July 13, 2025  
**Next Review:** After MVP completion

