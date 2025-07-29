# 🛒 Shopping List Feature - MVP Implementation Plan

## 📋 Overview
MVP shopping list feature with two access points: Weekly Plan result screen and Home screen. Focus on simplicity, usability, and existing app patterns.

## 🎯 Core Requirements
- Generate shopping list from weekly plan ingredients (consolidate duplicates)
- Access from Weekly Plan result screen (existing button)
- Access from Home screen (new card)
- Group items by category (Vegetables, Meat, Spices, etc.)
- Checkbox functionality with visual feedback
- Data persistence (Supabase)
- No extras: no sharing, history, or complex editing

## 🏗️ Technical Architecture

### Database Schema (Already Exists)
- `shopping_lists` table ✅
- `shopping_list_items` table ✅
- Database functions for creation ✅
- RLS policies ✅

### File Structure Plan

```
app/
├── shopping-list.tsx (new - main shopping list screen)
components/
├── shopping-list/
│   ├── index.ts (new - exports)
│   ├── ShoppingListCard.tsx (new - home screen card)
│   ├── ShoppingListItem.tsx (new - individual item component)
│   ├── ShoppingListHeader.tsx (new - header with actions)
│   └── CategorySection.tsx (new - grouped items by category)
lib/
├── shopping-list.ts (new - shopping list utilities)
```

## 📝 Implementation Tasks

### Phase 1: Core Infrastructure

#### 1.1 Create Shopping List Utilities (`lib/shopping-list.ts`)
- `generateShoppingListFromWeeklyPlan(weeklyPlan: WeeklyPlan): ShoppingListItem[]`
- `consolidateIngredients(items: ShoppingListItem[]): ShoppingListItem[]`
- `groupByCategory(items: ShoppingListItem[]): Record<string, ShoppingListItem[]>`
- `categorizeIngredient(name: string): string` (simple categorization logic)

#### 1.2 Create Shopping List Components

**ShoppingListItem.tsx**
- Checkbox with visual feedback (opacity change when checked)
- Item name, quantity, unit display
- Simple, clean design matching app patterns
- Props: `item`, `onToggle`, `checked`

**CategorySection.tsx**
- Section header with category name
- List of items in that category
- Props: `category`, `items`, `onToggleItem`

**ShoppingListHeader.tsx**
- Title and back button
- Clear all / uncheck all actions
- Props: `title`, `onBack`, `onClearAll`

**ShoppingListCard.tsx** (for Home screen)
- Shows current/last shopping list preview
- Quick access button
- Props: `shoppingList`, `onPress`

#### 1.3 Create Main Shopping List Screen (`app/shopping-list.tsx`)
- Full-screen shopping list view
- Grouped items by category
- Checkbox functionality
- Data persistence with Supabase
- Loading and error states
- Props: `listId` (optional - for existing list) or `weeklyPlan` (for new list)

### Phase 2: Integration Points

#### 2.1 Update Weekly Plan Result Screen
**File: `components/weeklyplan/result/WeeklyActionsCard.tsx`**
- Replace placeholder `handleShoppingListPress` with actual navigation
- Pass weekly plan data to shopping list screen
- Add loading state during list generation

**Changes:**
```typescript
// Replace Alert.alert with:
router.push({
  pathname: '/shopping-list',
  params: { weeklyPlan: JSON.stringify(weeklyPlan) }
})
```

#### 2.2 Update Home Screen
**File: `app/(tabs)/index.tsx`**
- Add shopping list card to home screen
- Fetch current/last shopping list on mount
- Handle empty state

**File: `components/cards/home/index.ts`**
- Export new ShoppingListCard

**File: `components/cards/home/ShoppingListCard.tsx` (new)**
- Display current shopping list preview
- Show item count and completion status
- Navigate to full shopping list screen

### Phase 3: Data Flow & State Management

#### 3.1 Shopping List Generation Logic
**File: `lib/shopping-list.ts`**

```typescript
interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  recipeName?: string;
}

interface ConsolidatedItem {
  name: string;
  totalQuantity: number;
  unit: string;
  category: string;
  isPurchased: boolean;
}

// Main function to generate shopping list from weekly plan
export async function generateShoppingListFromWeeklyPlan(
  userId: string,
  weeklyPlan: WeeklyPlan
): Promise<string | null> {
  // 1. Extract all ingredients from weekly plan meals
  // 2. Consolidate duplicate ingredients
  // 3. Categorize ingredients
  // 4. Create shopping list in database
  // 5. Return shopping list ID
}
```

#### 3.2 Database Integration
**File: `lib/database.ts`** (extend existing)
- Add `getCurrentShoppingList(userId: string)` function
- Add `updateShoppingListItem(itemId: string, updates: Partial<ShoppingListItem>)` function
- Add `clearShoppingList(listId: string)` function

### Phase 4: UI/UX Implementation

#### 4.1 Shopping List Screen Design
- Card-based layout matching app patterns
- Category sections with clear headers
- Checkbox items with smooth animations
- Empty state when no items
- Loading spinner during generation

#### 4.2 Home Screen Integration
- Shopping list card shows:
  - "Shopping List" title
  - Item count (e.g., "12 items")
  - Completion status (e.g., "3 of 12 purchased")
  - Quick access button

#### 4.3 Visual Feedback
- Checked items: reduced opacity (0.5)
- Smooth transitions for state changes
- Haptic feedback on checkbox toggle
- Clear visual hierarchy

### Phase 5: Error Handling & Edge Cases

#### 5.1 Error States
- Network errors during list generation
- Invalid weekly plan data
- Database connection issues
- Graceful fallbacks for all scenarios

#### 5.2 Edge Cases
- Empty weekly plan
- No ingredients in meals
- Duplicate ingredients with different units
- Very long ingredient names
- Special characters in ingredient names

## 🚀 Implementation Order

### Week 1: Core Components
1. Create `lib/shopping-list.ts` with utility functions
2. Create `ShoppingListItem.tsx` component
3. Create `CategorySection.tsx` component
4. Create `ShoppingListHeader.tsx` component
5. Create main `app/shopping-list.tsx` screen

### Week 2: Integration
1. Update `WeeklyActionsCard.tsx` to navigate to shopping list
2. Create `ShoppingListCard.tsx` for home screen
3. Update home screen to include shopping list card
4. Test shopping list generation from weekly plan

### Week 3: Polish & Testing
1. Add loading states and error handling
2. Implement haptic feedback
3. Test edge cases and error scenarios
4. Performance optimization
5. Final UI/UX polish

## 🎨 Design Guidelines

### Visual Consistency
- Use existing card patterns from `components/ui/Card.tsx`
- Match typography from `components/ThemedText.tsx`
- Follow color scheme from `constants/Colors.ts`
- Use existing button styles and spacing

### Interaction Patterns
- Checkbox toggle with opacity change
- Smooth animations for state transitions
- Haptic feedback on important actions
- Clear visual hierarchy

### Accessibility
- Proper touch targets (44px minimum)
- Screen reader support
- High contrast for important elements
- Clear focus indicators

## 📊 Success Metrics
- Shopping list generates correctly from weekly plan
- Items consolidate properly (2 chicken breasts + 1 chicken breast = 3 chicken breasts)
- Checkbox functionality works smoothly
- Data persists across app sessions
- Home screen integration feels natural
- No performance impact on existing features

## 🔧 Technical Notes

### Performance Considerations
- Lazy load shopping list data
- Debounce checkbox updates
- Optimize ingredient consolidation algorithm
- Cache categorized ingredient mappings

### Data Flow
1. Weekly Plan → Extract Ingredients → Consolidate → Categorize → Save to DB
2. Home Screen → Fetch Current List → Display Preview
3. Shopping List Screen → Load Full List → Group by Category → Display

### Testing Strategy
- Unit tests for ingredient consolidation logic
- Integration tests for database operations
- UI tests for checkbox functionality
- End-to-end tests for complete shopping list flow

## 🎯 MVP Scope Boundaries

### ✅ Included
- Shopping list generation from weekly plan
- Home screen access to current list
- Checkbox functionality with visual feedback
- Category grouping
- Data persistence
- Basic error handling

### ❌ Excluded (Post-MVP)
- Sharing functionality
- List history/archives
- Complex item editing
- Price tracking
- Store location mapping
- Barcode scanning
- Recipe substitution suggestions

## 🚀 Launch Checklist
- [ ] Shopping list generates from weekly plan
- [ ] Home screen shows shopping list card
- [ ] Checkbox functionality works
- [ ] Data persists correctly
- [ ] Error states handled gracefully
- [ ] Performance is acceptable
- [ ] UI matches app design patterns
- [ ] Accessibility requirements met
- [ ] Edge cases handled
- [ ] User testing completed 