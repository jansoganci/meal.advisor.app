# Weekly Meal Plan Feature - Technical Specification

## A. Wireframes

### Screen 1: Weekly Plan Input (Single Screen)

```
┌─────────────────────────────────────┐
│ ← Back        🗓️ Weekly Plan       │
│ Quick & personalized meal planning  │
├─────────────────────────────────────┤
│                                     │
│ 🎯 Plan Goals                      │
│ [Lose Weight] [Gain Muscle]        │
│ [Maintain] [Build Strength]        │
│                                     │
│ 🍽️ Meals to Include              │
│ [Breakfast] [Lunch] [Dinner]       │
│ [Snacks]                           │
│                                     │
│ 🌍 Cuisine Focus                  │
│ [Mediterranean] [Asian] [Italian]   │
│ [Mexican]                          │
│                                     │
│ 📅 Plan Focus                     │
│ [Quick & Easy] [Try New Recipes]   │
│ [Healthy Focus] [Comfort Foods]    │
│                                     │
│ ⚙️ Nutrition (from your profile)  │
│ 1800 cal/day • 120g protein       │
│ [Adjust]                           │
│                                     │
│ [Generate Weekly Plan 📅]          │
│                                     │
└─────────────────────────────────────┘
```

### Screen 2: Weekly Plan Result

```
┌─────────────────────────────────────┐
│ ← Back        Your Weekly Plan      │
├─────────────────────────────────────┤
│ 📊 This Week Overview              │
│ Avg: 1850 cal/day • 125g protein   │
│ Est. cost: $85                      │
├─────────────────────────────────────┤
│                                     │
│ MONDAY                              │
│ 🌅 Breakfast: Oatmeal Bowl (320)   │
│ 🌞 Lunch: Chicken Salad (450)      │
│ 🌙 Dinner: Salmon Teriyaki (580)   │
│ Total: 1,350 cal                    │
│                                     │
│ TUESDAY                             │
│ 🌅 Breakfast: Smoothie Bowl (280)  │
│ 🌞 Lunch: Turkey Wrap (420)        │
│ 🌙 Dinner: Beef Stir Fry (650)     │
│ Total: 1,350 cal                    │
│                                     │
│ [... Wednesday - Sunday ...]        │
│                                     │
│ [📋 Shopping List] [🔄 Regenerate] │
│                                     │
└─────────────────────────────────────┘
```

## B. Task Lists

### Frontend – Input Screen

1. **Create base components structure**
   - Create `components/weeklyplan/selection/` folder
   - Create index.ts export file
   - Copy base card styling from QuickMeal

2. **Build GoalsCard component**
   - Create `GoalsCard.tsx` with 4 fitness goal options
   - Touch-friendly button grid layout
   - Pre-select from user profile `primary_goal`

3. **Build MealsCard component** 
   - Create `MealsCard.tsx` with meal type multi-select
   - Default to Breakfast, Lunch, Dinner selected
   - Large touch targets, visual selection state

4. **Build CuisineCard component**
   - Create `CuisineCard.tsx` with cuisine multi-select
   - Pre-populate from user `cuisine_preferences`
   - Same styling as QuickMeal CuisineCard

5. **Build PlanFocusCard component**
   - Create `PlanFocusCard.tsx` with 4 plan focus options
   - Single select, clear visual states
   - Default to "Quick & Easy"

6. **Build NutritionCard component**
   - Create `NutritionCard.tsx` showing profile calories/protein
   - Collapsible adjustment controls
   - Auto-populate from `daily_calories`/`daily_protein_g`
   - Use defaults if profile incomplete: 1800 kcal, 60g protein
   - Display "Default values used" note when defaults applied

7. **Create main WeeklyPlan screen**
   - Create `app/(tabs)/weeklyplan.tsx`
   - Copy QuickMeal screen structure exactly
   - Integrate all cards with state management

### Frontend – Result Screen  

8. **Create result components structure**
   - Create `components/weeklyplan/result/` folder
   - Create index.ts export file

9. **Build WeeklyOverviewCard component**
   - Create `WeeklyOverviewCard.tsx` with summary stats
   - Average calories, protein, estimated cost
   - Clean, scannable layout

10. **Build DayMealCard component**
     - Create `DayMealCard.tsx` for each day's meals
     - Show day name, meals with calories, daily total
     - Tapping meal shows "Full recipe details coming soon" message
     - Simple list layout, no modals

11. **Build WeeklyActionsCard component**
    - Create `WeeklyActionsCard.tsx` with Shopping List/Regenerate
    - Shopping List button shows "Coming soon" message when clicked
    - Only 2 buttons, large touch targets
    - Match QuickMeal button styling

12. **Create WeeklyPlan result screen**
    - Create `app/weeklyplan-result.tsx`
    - Copy QuickMeal result screen structure exactly
    - Integrate all result cards

### Backend – Edge Function

13. **Create AI types for WeeklyPlan**
    - Add `WeeklyPlanPreferences` interface to `lib/ai/types.ts`
    - Add `WeeklyPlanResponse` interface
    - Add `DayMealPlan` and `MealItem` interfaces

14. **Extend EdgeAIService**
    - Add `generateWeeklyPlan()` method to `lib/ai/edge-service.ts`
    - Copy QuickMeal service pattern exactly
    - Handle user profile data merging

15. **Create ai-weekly edge function**
    - Create `supabase/functions/ai-weekly/` folder
    - Copy `ai-service/index.ts` structure exactly
    - Create `types.ts` for edge function types

16. **Build WeeklyPlan AI logic**
    - Create weekly plan generation in edge function
    - Merge user preferences with profile data
    - Format response for frontend consumption

17. **Add validation**
    - Add `validateWeeklyPlanPreferences()` to `lib/validation.ts`
    - Copy QuickMeal validation pattern
    - Handle required fields and constraints

### Integration & Testing

18. **Add navigation**
    - Add WeeklyPlan as second tab in bottom navigation: Home | Weekly | Profile
    - Update `app/(tabs)/_layout.tsx` with new tab configuration

19. **Test user profile integration**
    - Verify profile data pre-population
    - Test with users with/without complete profiles
    - Handle missing profile data gracefully

20. **End-to-end testing**
    - Test complete input → generation → result flow
    - Verify AI responses format correctly
    - Test error handling and loading states

## C. Premium Limits

**Usage Restrictions:**
- **Free users**: Maximum 2 weekly plan generations per week
- **Premium users**: Maximum 20 weekly plan generations per week
- **Enforcement**: Limits are enforced at the backend level through existing quota system
- **Over-quota behavior**: Show clear warning/toast when limits exceeded

## D. Error Handling

**AI Generation Failures:**
- Show toast: "Plan creation failed. Please try again."
- Provide "Retry" button for immediate retry
- On repeated failures: "Check your internet or try again later."

**Plan Storage:**
- All generated weekly plans saved to `weekly_plans` database table
- Store for user history and future access

**Cost Estimation:**
- AI generates estimated cost using its own logic
- No fixed formula or database required
- Display AI-provided cost value in results screen

## E. File/Folder Structure

### Frontend Structure

```
components/weeklyplan/
├── selection/
│   ├── index.ts
│   ├── GoalsCard.tsx
│   ├── MealsCard.tsx
│   ├── CuisineCard.tsx
│   ├── PlanFocusCard.tsx
│   └── NutritionCard.tsx
├── result/
│   ├── index.ts
│   ├── WeeklyOverviewCard.tsx
│   ├── DayMealCard.tsx
│   └── WeeklyActionsCard.tsx
└── index.ts
```

```
app/
├── (tabs)/
│   └── weeklyplan.tsx
└── weeklyplan-result.tsx
```

```
lib/ai/
├── types.ts (extended with WeeklyPlan interfaces)
└── edge-service.ts (extended with generateWeeklyPlan method)
```

### Backend Structure

```
supabase/functions/ai-weekly/
├── index.ts
├── types.ts
├── weeklyPlan.ts
└── deno.json
```

## F. Missing/Uncertain Points

All major specifications have been clarified. Implementation can proceed with the defined requirements. 