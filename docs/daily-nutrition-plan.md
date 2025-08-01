# Daily Nutrition Goals Feature - Technical Implementation Plan

## 🎯 **OVERVIEW**

**Goal**: Implement dynamic daily nutrition tracking showing "left" values (goals - consumed) on the Home screen, with daily reset at midnight in user's timezone.

**MVP Scope**: 
- Show real nutrition goals from user profile
- Calculate daily consumption from meal history
- Display "left" values (goals - consumed)
- Daily reset at midnight (user timezone)
- Graceful fallbacks for missing data

---

## 📊 **CURRENT STATE ANALYSIS**

### ✅ **Existing Infrastructure**
- **Database**: Complete nutrition tracking schema
  - `users` table: `daily_calories`, `daily_protein_g`, `daily_carbs_g`, `daily_fat_g`
  - `user_meal_history` table: `calories_consumed`, `protein_consumed_g`, `carbs_consumed_g`, `fat_consumed_g`
  - Database function: `get_user_nutrition_summary()` for date range queries
- **Profile System**: Goals calculated and stored in user profile
- **UI Components**: Basic nutrition cards exist (currently hardcoded)

### ❌ **Missing Components**
- Daily consumption calculation service
- Daily reset logic (timezone-aware)
- Dynamic value integration with UI
- Profile context integration for daily nutrition

---

## 🚀 **IMPLEMENTATION ROADMAP**

### **Phase 1: Core Data Layer (MVP Priority)**

#### **Step 1.1: Create Daily Nutrition Service**
**File**: `lib/daily-nutrition.ts` (NEW)

```typescript
interface DailyNutrition {
  date: string
  caloriesGoal: number
  proteinGoal: number
  carbsGoal: number
  fatGoal: number
  caloriesConsumed: number
  proteinConsumed: number
  carbsConsumed: number
  fatConsumed: number
  caloriesLeft: number
  proteinLeft: number
  carbsLeft: number
  fatLeft: number
}

interface DailyNutritionService {
  getDailyNutrition(userId: string, date?: string): Promise<DailyNutrition>
  resetDailyNutrition(userId: string): Promise<void>
}
```

**Key Functions**:
- `getDailyNutrition()`: Calculate today's nutrition (goals - consumed)
- `resetDailyNutrition()`: Reset consumed values to 0 (for new day)
- Timezone handling using user's `timezone` field from profile
- Fallback to UTC if no timezone set

#### **Step 1.2: Update Profile Context**
**File**: `contexts/ProfileContext.tsx` (MODIFY)

**Add to ProfileContextType**:
```typescript
interface ProfileContextType {
  // ... existing
  dailyNutrition: DailyNutrition | null
  refreshDailyNutrition: () => Promise<void>
}
```

**Implementation**:
- Add `dailyNutrition` state
- Add `refreshDailyNutrition()` function
- Load daily nutrition when profile loads
- Handle timezone-aware daily reset

### **Phase 2: UI Integration (MVP Priority)**

#### **Step 2.1: Update Home Screen**
**File**: `app/(tabs)/index.tsx` (MODIFY)

**Changes**:
- Import daily nutrition from profile context
- Pass real values to nutrition cards
- Add loading state for daily nutrition
- Handle missing data gracefully

#### **Step 2.2: Update Nutrition Cards**
**Files to Modify**:
- `components/cards/home/CaloriesLeftCard.tsx`
- `components/cards/home/ProteinCard.tsx`
- `components/cards/home/CarbsCard.tsx`
- `components/cards/home/FatCard.tsx`

**Changes**:
- Remove hardcoded default values
- Use props from parent component
- Add fallback values for edge cases
- Ensure proper TypeScript types

### **Phase 3: Database Integration (MVP Priority)**

#### **Step 3.1: Create Database Function**
**File**: `supabase/migrations/015_daily_nutrition_functions.sql` (NEW)

**Functions**:
```sql
-- Get user's daily nutrition summary
CREATE OR REPLACE FUNCTION public.get_daily_nutrition(
  p_user_id UUID,
  p_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
  calories_goal INTEGER,
  protein_goal INTEGER,
  carbs_goal INTEGER,
  fat_goal INTEGER,
  calories_consumed BIGINT,
  protein_consumed NUMERIC,
  carbs_consumed NUMERIC,
  fat_consumed NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.daily_calories,
    u.daily_protein_g,
    u.daily_carbs_g,
    u.daily_fat_g,
    COALESCE(SUM(umh.calories_consumed), 0)::BIGINT,
    COALESCE(SUM(umh.protein_consumed_g), 0),
    COALESCE(SUM(umh.carbs_consumed_g), 0),
    COALESCE(SUM(umh.fat_consumed_g), 0)
  FROM public.users u
  LEFT JOIN public.user_meal_history umh ON 
    umh.user_id = u.id AND 
    umh.meal_date = p_date
  WHERE u.id = p_user_id
  GROUP BY u.daily_calories, u.daily_protein_g, u.daily_carbs_g, u.daily_fat_g;
END;
$$ LANGUAGE plpgsql;
```

#### **Step 3.2: Update TypeScript Types**
**File**: `types/database.ts` (MODIFY)

**Add to Database interface**:
```typescript
Functions: {
  get_daily_nutrition: {
    Args: {
      p_user_id: string
      p_date?: string
    }
    Returns: {
      calories_goal: number | null
      protein_goal: number | null
      carbs_goal: number | null
      fat_goal: number | null
      calories_consumed: number | null
      protein_consumed: number | null
      carbs_consumed: number | null
      fat_consumed: number | null
    }[]
  }
}
```

---

## 📁 **DETAILED FILE CHANGES**

### **NEW FILES**
1. `lib/daily-nutrition.ts` - Daily nutrition calculation service
2. `supabase/migrations/015_daily_nutrition_functions.sql` - Database functions

### **MODIFIED FILES**

#### **High Priority (MVP)**
1. **`contexts/ProfileContext.tsx`**
   - Add `dailyNutrition` state
   - Add `refreshDailyNutrition()` function
   - Integrate with existing profile loading

2. **`app/(tabs)/index.tsx`**
   - Import daily nutrition from context
   - Pass real values to nutrition cards
   - Add loading state handling

3. **`components/cards/home/CaloriesLeftCard.tsx`**
   - Remove hardcoded `caloriesLeft = 1000`
   - Use `caloriesLeft` prop from parent
   - Add fallback to 0 if no data

4. **`components/cards/home/ProteinCard.tsx`**
   - Remove hardcoded `proteinLeft = 100`
   - Use `proteinLeft` prop from parent
   - Add fallback to 0 if no data

5. **`components/cards/home/CarbsCard.tsx`**
   - Remove hardcoded `carbsLeft = 99`
   - Use `carbsLeft` prop from parent
   - Add fallback to 0 if no data

6. **`components/cards/home/FatCard.tsx`**
   - Remove hardcoded `fatLeft = 25`
   - Use `fatLeft` prop from parent
   - Add fallback to 0 if no data

#### **Medium Priority (Post-MVP)**
7. **`types/profile.ts`**
   - Add `DailyNutrition` interface
   - Add daily nutrition to `ProfileContextType`

8. **`types/database.ts`**
   - Add database function types
   - Update Database interface

---

## ⚡ **IMPLEMENTATION STEPS**

### **Step 1: Database Layer (30 minutes)**
1. Create migration file `015_daily_nutrition_functions.sql`
2. Add `get_daily_nutrition()` database function
3. Test function with sample data
4. Update TypeScript types in `types/database.ts`

### **Step 2: Service Layer (45 minutes)**
1. Create `lib/daily-nutrition.ts`
2. Implement `DailyNutritionService` class
3. Add timezone handling logic
4. Add error handling and fallbacks
5. Test with mock data

### **Step 3: Context Integration (30 minutes)**
1. Update `contexts/ProfileContext.tsx`
2. Add daily nutrition state management
3. Integrate with existing profile loading
4. Add refresh function
5. Test context integration

### **Step 4: UI Integration (45 minutes)**
1. Update `app/(tabs)/index.tsx`
2. Pass real values to nutrition cards
3. Add loading state handling
4. Test with real user data

### **Step 5: Component Updates (30 minutes)**
1. Update all 4 nutrition card components
2. Remove hardcoded values
3. Add proper TypeScript types
4. Test component rendering

### **Step 6: Testing & Polish (30 minutes)**
1. Test with new users (no consumption data)
2. Test with existing users (with consumption data)
3. Test timezone edge cases
4. Test daily reset functionality
5. Performance testing

---

## 🚨 **EDGE CASES & ERROR HANDLING**

### **Data Edge Cases**
- **New Users**: Show full goals as "left" values (no consumption data)
- **Missing Profile**: Show default values (2000 cal, 150g protein, etc.)
- **No Consumption Data**: Treat as 0 consumed
- **Invalid Goals**: Use reasonable defaults (2000 cal, 150g protein, etc.)

### **Timezone Edge Cases**
- **No User Timezone**: Default to UTC
- **Invalid Timezone**: Fallback to UTC
- **Daylight Saving**: Handle DST transitions
- **Midnight Reset**: Use user's local midnight

### **Database Edge Cases**
- **Connection Errors**: Show cached data or defaults
- **Function Errors**: Fallback to client-side calculation
- **Missing Tables**: Graceful degradation
- **Permission Errors**: Handle RLS policy issues

### **Performance Considerations**
- **Caching**: Cache daily nutrition for 5 minutes
- **Lazy Loading**: Load nutrition data on demand
- **Background Refresh**: Update in background when app becomes active
- **Memory Usage**: Limit cache size and cleanup

---

## 🎯 **SUCCESS CRITERIA**

### **Functional Requirements**
- ✅ User sees their actual daily nutrition goals (not hardcoded)
- ✅ "Left" values reflect real consumption (goals - eaten)
- ✅ Values reset daily at midnight (user's timezone)
- ✅ Graceful handling of missing data
- ✅ No performance impact on app startup

### **Technical Requirements**
- ✅ TypeScript types are complete and accurate
- ✅ Error handling covers all edge cases
- ✅ Database functions are optimized
- ✅ UI components handle loading states
- ✅ Context integration is seamless

### **User Experience Requirements**
- ✅ Loading states are smooth and informative
- ✅ Fallback values are reasonable
- ✅ No crashes or errors visible to user
- ✅ Performance is fast (< 500ms for nutrition data)
- ✅ Timezone handling is transparent

---

## 📋 **TESTING CHECKLIST**

### **Data Scenarios**
- [ ] New user with no consumption data
- [ ] Existing user with consumption data
- [ ] User with partial consumption data
- [ ] User with no nutrition goals set
- [ ] User with invalid nutrition goals

### **Timezone Scenarios**
- [ ] User in UTC timezone
- [ ] User in EST timezone
- [ ] User in PST timezone
- [ ] User with invalid timezone
- [ ] Daylight saving time transitions

### **Error Scenarios**
- [ ] Database connection failure
- [ ] Network connectivity issues
- [ ] Invalid user ID
- [ ] Missing database tables
- [ ] Permission errors

### **Performance Scenarios**
- [ ] App startup with nutrition data
- [ ] Background app refresh
- [ ] Multiple rapid navigation
- [ ] Memory usage under load
- [ ] Battery usage impact

---

## 🚀 **DEPLOYMENT STRATEGY**

### **Database Migration**
1. Deploy migration during low-traffic period
2. Test function with sample data
3. Monitor for any performance impact
4. Rollback plan ready if issues arise

### **App Deployment**
1. Deploy service layer first
2. Deploy context changes
3. Deploy UI changes
4. Monitor error rates and performance
5. Feature flag ready for rollback

### **Monitoring**
- Track daily nutrition API calls
- Monitor database function performance
- Watch for timezone-related errors
- Monitor user engagement with nutrition data

---

## 💡 **FUTURE ENHANCEMENTS (Post-MVP)**

### **Advanced Features**
- Weekly nutrition summaries
- Nutrition trend analysis
- Goal achievement tracking
- Social sharing of nutrition goals
- Integration with fitness apps

### **Performance Optimizations**
- Background sync of nutrition data
- Offline nutrition tracking
- Predictive nutrition suggestions
- Smart caching strategies

### **User Experience**
- Nutrition goal editing in profile
- Visual nutrition progress charts
- Meal logging integration
- Nutrition insights and tips

---

**Total Estimated Time**: 3-4 hours for MVP implementation
**Risk Level**: Low (uses existing infrastructure)
**User Impact**: High (immediate value for nutrition tracking)
**Technical Debt**: Minimal (follows existing patterns) 