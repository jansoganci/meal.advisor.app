# 🎯 **FAVORITES FEATURE IMPLEMENTATION PLAN**

## 📋 **OVERVIEW**

This document outlines the **MVP implementation plan** for building the Favorites feature in the MealAdvisor React Native/Expo app. Focus is on shipping fast with core functionality only - no advanced polish features.

### **MVP Requirements:**
- ✅ Prevent duplicate favorites (enforced by existing UNIQUE constraint)
- ✅ Support favorite toggle (add/remove functionality)
- ✅ User-specific favorites only (secured by RLS policies)
- ✅ Simple search within favorites (no debouncing needed for <20 recipes)
- ✅ Empty state with call-to-action
- ✅ Consistent design with existing app patterns

### **MVP Scope - What We're NOT Building:**
- ❌ Global FavoritesContext (logic stays in Favorites tab)
- ❌ FavoritesStats component
- ❌ Pagination (simple FlatList is enough)
- ❌ Debounced search (basic search sufficient)
- ❌ Advanced loading states/skeletons
- ❌ Fancy animations or toasts
- ❌ Extensive automated testing

---

## 🔧 **BACKEND TASKS**

### **Task 1: Create Favorites Service Layer**
**File:** `lib/favorites.ts`
**Description:** Create a centralized service for all favorites-related database operations following the established pattern in `lib/database.ts`.

**Technologies:**
- Supabase client for database operations
- TypeScript for type safety
- RLS policies for security

**Functions to implement:**
```typescript
export const favoritesService = {
  // Get user's favorites with optional search
  async getUserFavorites(userId: string, searchQuery?: string): Promise<FavoriteRecipe[]>
  
  // Add recipe to favorites (with duplicate prevention)
  async addToFavorites(userId: string, recipeData: QuickMealSuggestion): Promise<boolean>
  
  // Remove recipe from favorites
  async removeFromFavorites(userId: string, recipeId: string): Promise<boolean>
  
  // Check if recipe is favorited by user
  async isFavorited(userId: string, recipeId: string): Promise<boolean>
  
  // Get total favorites count for user
  async getFavoritesCount(userId: string): Promise<number>
}
```

**Database Operations:**
- Query `recipe_favorites` table with JOIN to `recipes`
- Handle search with ILIKE on recipe title
- Use existing RLS policies for security
- Proper error handling and logging

---

### **Task 2: Recipe Data Conversion Utility**
**File:** `lib/recipe-utils.ts`
**Description:** Create utility functions to convert AI-generated QuickMealSuggestion data into the proper Recipe format for database storage.

**Technologies:**
- TypeScript for type definitions
- JSON handling for ingredients/instructions
- UUID generation for new recipes

**Functions to implement:**
```typescript
// Convert QuickMealSuggestion to Recipe database format
export function convertSuggestionToRecipe(
  suggestion: QuickMealSuggestion, 
  userId: string
): RecipeInsert

// Generate unique recipe ID based on content hash
export function generateRecipeHash(suggestion: QuickMealSuggestion): string

// Validate recipe data before database insertion
export function validateRecipeData(recipe: RecipeInsert): boolean
```

---

## 🎨 **FRONTEND TASKS**

### **Task 3: Add Favorites Tab to Navigation**
**File:** `app/(tabs)/_layout.tsx`
**Description:** Add the favorites tab to the main bottom navigation following the established pattern.

**Technologies:**
- Expo Router for navigation
- IconSymbol component for consistency
- Tab bar styling from existing patterns

**Changes required:**
```typescript
<Tabs.Screen
  name="favorites"
  options={{
    title: 'Favorites',
    tabBarIcon: ({ color }) => <IconSymbol size={28} name="heart.fill" color={color} />,
  }}
/>
```

**Tab order:** [🏠 Home] [❤️ Favorites] [📅 Weekly] [👤 Profile]

---

### **Task 4: Create Main Favorites Screen**
**File:** `app/(tabs)/favorites.tsx`
**Description:** Build the main favorites listing screen with search functionality and empty state handling.

**Technologies:**
- React Native components (ScrollView, FlatList)
- ThemedText and ThemedView for consistency
- Search debouncing with useEffect and useState
- Loading states with proper UX

**Features to implement:**
- Header with title "❤️ My Favorite Recipes"
- Search bar at the top
- FlatList of favorite recipe cards
- Empty state when no favorites
- Loading states during fetch
- Error handling with retry functionality
- Pull-to-refresh capability

**State management:**
```typescript
const [favorites, setFavorites] = useState<FavoriteRecipe[]>([])
const [searchQuery, setSearchQuery] = useState('')
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
```

---

### **Task 5: Create Favorite Recipe Card Component**
**File:** `components/favorites/list/FavoriteRecipeCard.tsx`
**Description:** Create individual recipe card component that matches the existing MealSuggestionCard design pattern.

**Technologies:**
- React Native TouchableOpacity for interactions
- Consistent styling with existing cards
- Heart icon toggle functionality
- Haptic feedback for interactions

**Props interface:**
```typescript
interface FavoriteRecipeCardProps {
  recipe: FavoriteRecipe
  onPress: (recipe: FavoriteRecipe) => void
  onToggleFavorite: (recipeId: string) => void
  isRemoving?: boolean
}
```

**Design elements:**
- Recipe title and description
- Rating, time, cost metadata
- "Added X ago" timestamp
- Filled heart icon (removable)
- Touch feedback and animations

---

### **Task 6: Create Empty State Component**
**File:** `components/favorites/empty-state/EmptyFavoritesCard.tsx`
**Description:** Build empty state component that appears when user has no favorites, with call-to-action to discover meals.

**Technologies:**
- ThemedView and ThemedText for consistency
- Button styling matching QuickMealButton pattern
- Navigation integration to home/quickmeal

**Design elements:**
```typescript
// Empty state design
<View style={emptyStateStyles}>
  <Text style={emptyIconStyles}>❤️</Text>
  <Text style={emptyTitleStyles}>No favorites yet!</Text>
  <Text style={emptyDescriptionStyles}>
    Start exploring meals and tap the heart icon to save your favorites here
  </Text>
  <TouchableOpacity style={discoverButtonStyles} onPress={onDiscoverMeals}>
    <Text style={buttonTextStyles}>Discover Meals 🍽️</Text>
  </TouchableOpacity>
</View>
```

---

### **Task 7: Create Search Bar Component**
**File:** `components/favorites/list/FavoritesSearchBar.tsx`
**Description:** Build simple search input component with basic filtering (no debouncing needed for MVP).

**Technologies:**
- React Native TextInput
- IconSymbol for search icon
- Basic onChange filtering
- Consistent input styling

**Features:**
- Search icon on the left
- Placeholder text "Search favorites..."
- Instant filter on text change
- Clear search functionality

---

### **Task 8: Add Heart Icon Functionality**
**File:** `components/quickmeal/result/MealSuggestionCard.tsx`
**Description:** Make the existing heart icon functional by adding proper toggle functionality and state management.

**Technologies:**
- React hooks for state management
- Optimistic UI updates
- Error handling with rollback
- Haptic feedback

**Changes required:**
```typescript
// Add to props interface
onToggleFavorite?: (suggestion: QuickMealSuggestion) => void
isFavorited?: boolean

// Update heart button JSX
<TouchableOpacity 
  style={styles.favoriteButton} 
  onPress={() => onToggleFavorite?.(suggestion)}
>
  <Text style={styles.favoriteIcon}>
    {isFavorited ? '❤️' : '🤍'}
  </Text>
</TouchableOpacity>
```

**Integration points:**
- QuickMeal result screen
- Weekly plan result screen
- Any other screens showing recipes

---

### **Task 9: ~~Create Favorites Context~~ (REMOVED FROM MVP)**
**Status:** ❌ **REMOVED FOR MVP** - Keep logic inside Favorites tab for simplicity

**MVP Alternative:** Handle favorites state directly in the Favorites screen and pass heart toggle functions as props to individual cards. No global context needed for MVP scope.

---

### **Task 9: Create Recipe Detail Screen**
**File:** `app/favorite-recipe-detail.tsx`
**Description:** Build dedicated screen for viewing full recipe details when user taps on a favorite recipe card.

**Technologies:**
- Expo Router for navigation
- Reuse existing components (InstructionsCard, NutritionInfoCard)
- ScrollView for content layout
- Navigation params for recipe data

**Components to reuse:**
- `InstructionsCard` from quickmeal components
- `NutritionInfoCard` from quickmeal components
- `MealSuggestionCard` style header
- Consistent back button navigation

**Navigation pattern:**
```typescript
// Navigate to detail screen
router.push({
  pathname: '/favorite-recipe-detail',
  params: { recipeData: JSON.stringify(recipe) }
})
```

---

## 🔗 **INTEGRATION TASKS**

### **Task 10: Update Navigation Routes**
**File:** `lib/navigation.ts`
**Description:** Add favorites-related routes to the navigation constants and service functions.

**Technologies:**
- TypeScript route constants
- NavigationService class methods
- Route type definitions

**Routes to add:**
```typescript
export const Routes = {
  // ... existing routes
  FAVORITES: '/(tabs)/favorites',
  FAVORITE_RECIPE_DETAIL: '/favorite-recipe-detail',
} as const
```

**NavigationService methods:**
```typescript
static goToFavorites() {
  router.push('/(tabs)/favorites')
}

static goToFavoriteRecipeDetail(recipe: FavoriteRecipe) {
  router.push({
    pathname: '/favorite-recipe-detail',
    params: { recipeData: JSON.stringify(recipe) }
  })
}
```

---

### **Task 11: Basic Error Handling & Loading States (MVP)**
**File:** Multiple files
**Description:** Add basic error handling and loading states for core functionality only.

**MVP Technologies:**
- Simple loading booleans
- Basic error text display
- Alert() for error messages

**MVP Error scenarios:**
- Database query failures
- Basic network errors
- Duplicate favorite attempts

**MVP Loading states:**
- Simple loading spinner for favorites list
- Disabled buttons during operations

**MVP UX patterns:**
- Basic "Loading..." text
- Simple error text with "Try again" button
- Alert() for critical errors

---

## 📦 **MVP COMPONENT STRUCTURE**

```
components/favorites/
├── index.ts                          // Export barrel
├── empty-state/
│   └── EmptyFavoritesCard.tsx       // Empty state with CTA
└── list/
    ├── FavoriteRecipeCard.tsx       // Individual recipe card
    └── FavoritesSearchBar.tsx       // Simple search input

app/(tabs)/
└── favorites.tsx                     // Main favorites screen (contains all state logic)

app/
└── favorite-recipe-detail.tsx       // Recipe detail screen

lib/
├── favorites.ts                      // Favorites service layer
└── recipe-utils.ts                  // Recipe conversion utilities
```

**Removed from MVP:**
- ❌ `FavoritesStats.tsx` - Not needed for MVP
- ❌ `FavoritesContext.tsx` - Logic stays in favorites screen
- ❌ `detail/` folder - Keep detail screen at app level for simplicity

---

## 🎯 **MVP IMPLEMENTATION ORDER**

### **Phase 1: Backend Foundation**
1. ✅ Task 1: Create Favorites Service Layer
2. ✅ Task 2: Recipe Data Conversion Utility

### **Phase 2: Core Frontend**
3. ✅ Task 3: Add Favorites Tab to Navigation
4. ✅ Task 4: Create Main Favorites Screen (with local state)
5. ✅ Task 5: Create Favorite Recipe Card Component
6. ✅ Task 6: Create Empty State Component

### **Phase 3: MVP Complete**
7. ✅ Task 7: Create Simple Search Bar Component
8. ✅ Task 8: Add Heart Icon Functionality
9. ✅ Task 9: Create Recipe Detail Screen
10. ✅ Task 10: Update Navigation Routes
11. ✅ Task 11: Basic Error Handling & Loading States

**MVP Ready after Phase 3! 🚀**

---

## 🔐 **SECURITY CONSIDERATIONS**

### **Data Protection:**
- ✅ RLS policies already in place for recipe_favorites table
- ✅ User can only see their own favorites
- ✅ Validate all user inputs before database operations
- ✅ Sanitize search queries to prevent injection

### **MVP Performance:**
- ✅ Use FlatList for efficient rendering
- ✅ Basic database queries (optimization comes later)
- ✅ Simple search filtering (no debouncing needed for <20 recipes)

---

## 📊 **SUCCESS METRICS**

### **Technical Metrics:**
- ✅ Favorites list loads in < 2 seconds
- ✅ Search responds in < 500ms
- ✅ Heart toggle feedback in < 200ms
- ✅ < 0.1% error rate for favorites operations

### **User Experience Metrics:**
- ✅ > 15% of viewed recipes get favorited
- ✅ > 60% of favorited recipes get viewed again
- ✅ < 2% user complaints about favorites functionality

---

## 🧪 **MVP TESTING STRATEGY**

### **Manual Testing Only:**
- ✅ Test favorites service functions work correctly
- ✅ Verify recipe data conversion works
- ✅ Test complete user journey: discover → favorite → view → unfavorite
- ✅ Test search functionality with different queries
- ✅ Test empty state and call-to-action
- ✅ Verify database operations with RLS work properly
- ✅ Test error scenarios (network failures, etc.)

**No automated tests for MVP - ship fast and iterate!**

---

## 📝 **NOTES**

### **MVP Scope:**
- ❌ No offline caching (as per requirements)
- ❌ No social sharing of favorites
- ❌ No favorites organization/categories
- ❌ No export functionality

### **Future Enhancements:**
- 🔮 Favorites categories/tags
- 🔮 Share favorite recipes
- 🔮 Collaborative favorite lists
- 🔮 Recipe recommendations based on favorites

---

**Total MVP Tasks: 11** (down from 12)
**Estimated Development Time: 1-2 days** (streamlined!)
**MVP Ready: Phase 3 completion**
**Ship Fast → Iterate Based on User Feedback! 🚀** 