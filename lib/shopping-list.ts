import type { ShoppingListItem } from './database';
import { database } from './database';
import { supabase } from './supabase';

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  recipeName?: string;
}

export interface ConsolidatedItem {
  name: string;
  totalQuantity: number;
  unit: string;
  category: string;
  isPurchased: boolean;
}

export interface WeeklyPlan {
  overview: {
    avgCalories: number;
    avgProtein: number;
    estimatedCost: number;
  };
  days: Array<{
    dayName: string;
    meals: Array<{
      name: string;
      calories: number;
      type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
      ingredients?: Ingredient[];
    }>;
    totalCalories: number;
  }>;
}

// Simple ingredient categorization logic
export function categorizeIngredient(name: string): string {
  const lowerName = name.toLowerCase();
  
  // Vegetables
  if (lowerName.includes('onion') || lowerName.includes('garlic') || 
      lowerName.includes('tomato') || lowerName.includes('carrot') ||
      lowerName.includes('lettuce') || lowerName.includes('spinach') ||
      lowerName.includes('broccoli') || lowerName.includes('cauliflower') ||
      lowerName.includes('bell pepper') || lowerName.includes('cucumber') ||
      lowerName.includes('mushroom') || lowerName.includes('zucchini') ||
      lowerName.includes('potato') || lowerName.includes('sweet potato')) {
    return 'Vegetables';
  }
  
  // Fruits
  if (lowerName.includes('apple') || lowerName.includes('banana') ||
      lowerName.includes('orange') || lowerName.includes('strawberry') ||
      lowerName.includes('blueberry') || lowerName.includes('grape') ||
      lowerName.includes('lemon') || lowerName.includes('lime')) {
    return 'Fruits';
  }
  
  // Meat & Protein
  if (lowerName.includes('chicken') || lowerName.includes('beef') ||
      lowerName.includes('pork') || lowerName.includes('turkey') ||
      lowerName.includes('salmon') || lowerName.includes('tuna') ||
      lowerName.includes('shrimp') || lowerName.includes('egg') ||
      lowerName.includes('tofu') || lowerName.includes('tempeh')) {
    return 'Meat & Protein';
  }
  
  // Dairy
  if (lowerName.includes('milk') || lowerName.includes('cheese') ||
      lowerName.includes('yogurt') || lowerName.includes('cream') ||
      lowerName.includes('butter') || lowerName.includes('sour cream')) {
    return 'Dairy';
  }
  
  // Grains & Bread
  if (lowerName.includes('bread') || lowerName.includes('rice') ||
      lowerName.includes('pasta') || lowerName.includes('quinoa') ||
      lowerName.includes('oat') || lowerName.includes('flour') ||
      lowerName.includes('tortilla') || lowerName.includes('wrap')) {
    return 'Grains & Bread';
  }
  
  // Spices & Seasonings
  if (lowerName.includes('salt') || lowerName.includes('pepper') ||
      lowerName.includes('oregano') || lowerName.includes('basil') ||
      lowerName.includes('thyme') || lowerName.includes('rosemary') ||
      lowerName.includes('cumin') || lowerName.includes('paprika') ||
      lowerName.includes('cinnamon') || lowerName.includes('nutmeg') ||
      lowerName.includes('garlic powder') || lowerName.includes('onion powder')) {
    return 'Spices & Seasonings';
  }
  
  // Pantry Staples
  if (lowerName.includes('oil') || lowerName.includes('vinegar') ||
      lowerName.includes('sauce') || lowerName.includes('broth') ||
      lowerName.includes('stock') || lowerName.includes('honey') ||
      lowerName.includes('sugar') || lowerName.includes('flour') ||
      lowerName.includes('baking soda') || lowerName.includes('baking powder')) {
    return 'Pantry Staples';
  }
  
  // Nuts & Seeds
  if (lowerName.includes('almond') || lowerName.includes('walnut') ||
      lowerName.includes('cashew') || lowerName.includes('peanut') ||
      lowerName.includes('sunflower seed') || lowerName.includes('chia seed') ||
      lowerName.includes('flax seed')) {
    return 'Nuts & Seeds';
  }
  
  // Default category
  return 'Other';
}

// Consolidate duplicate ingredients
export function consolidateIngredients(items: Ingredient[]): ConsolidatedItem[] {
  const consolidated: Record<string, ConsolidatedItem> = {};
  
  items.forEach(item => {
    const key = `${item.name.toLowerCase()}-${item.unit.toLowerCase()}`;
    
    if (consolidated[key]) {
      consolidated[key].totalQuantity += item.quantity;
    } else {
      consolidated[key] = {
        name: item.name,
        totalQuantity: item.quantity,
        unit: item.unit,
        category: categorizeIngredient(item.name),
        isPurchased: false
      };
    }
  });
  
  return Object.values(consolidated);
}

// Group items by category
export function groupByCategory(items: ConsolidatedItem[]): Record<string, ConsolidatedItem[]> {
  return items.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, ConsolidatedItem[]>);
}

// Extract ingredients from weekly plan
export function extractIngredientsFromWeeklyPlan(weeklyPlan: WeeklyPlan): Ingredient[] {
  const ingredients: Ingredient[] = [];
  
  weeklyPlan.days.forEach(day => {
    day.meals.forEach(meal => {
      if (meal.ingredients) {
        meal.ingredients.forEach(ingredient => {
          ingredients.push({
            ...ingredient,
            recipeName: meal.name
          });
        });
      }
    });
  });
  
  return ingredients;
}

// Generate shopping list from weekly plan
export async function generateShoppingListFromWeeklyPlan(
  userId: string,
  weeklyPlan: WeeklyPlan,
  title?: string
): Promise<string | null> {
  try {
    // Extract all ingredients from weekly plan
    const ingredients = extractIngredientsFromWeeklyPlan(weeklyPlan);
    
    if (ingredients.length === 0) {
      console.warn('No ingredients found in weekly plan');
      return null;
    }
    
    // Consolidate duplicate ingredients
    const consolidatedItems = consolidateIngredients(ingredients);
    
    // Create shopping list in database
    const listTitle = title || `Shopping List - ${new Date().toLocaleDateString()}`;
    
    // For now, we'll create a simple shopping list
    // In a real implementation, you'd use the database.createFromMealPlan function
    // But since we don't have meal plan IDs, we'll create a basic list
    
    const shoppingListId = await createBasicShoppingList(userId, listTitle, consolidatedItems);
    
    return shoppingListId;
  } catch (error) {
    console.error('Error generating shopping list:', error);
    return null;
  }
}

// Create a basic shopping list (fallback when meal plan ID is not available)
async function createBasicShoppingList(
  userId: string,
  title: string,
  items: ConsolidatedItem[]
): Promise<string | null> {
  try {
    // Create shopping list
    const { data: listData, error: listError } = await supabase
      .from('shopping_lists')
      .insert({
        user_id: userId,
        title,
        description: 'Generated from weekly plan'
      })
      .select()
      .single();
    
    if (listError) {
      console.error('Error creating shopping list:', listError);
      return null;
    }
    
    // Create shopping list items
    const itemsToInsert = items.map(item => ({
      shopping_list_id: listData.id,
      name: item.name,
      quantity: item.totalQuantity,
      unit: item.unit,
      category: item.category,
      is_purchased: false
    }));
    
    const { error: itemsError } = await supabase
      .from('shopping_list_items')
      .insert(itemsToInsert);
    
    if (itemsError) {
      console.error('Error creating shopping list items:', itemsError);
      return null;
    }
    
    return listData.id;
  } catch (error) {
    console.error('Error creating basic shopping list:', error);
    return null;
  }
}

// Get current shopping list for user
export async function getCurrentShoppingList(userId: string) {
  try {
    const lists = await database.shoppingLists.getUserLists(userId);
    return lists.length > 0 ? lists[0] : null;
  } catch (error) {
    console.error('Error fetching current shopping list:', error);
    return null;
  }
}

// Update shopping list item
export async function updateShoppingListItem(
  itemId: string,
  updates: Partial<ShoppingListItem>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('shopping_list_items')
      .update(updates)
      .eq('id', itemId);
    
    if (error) {
      console.error('Error updating shopping list item:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating shopping list item:', error);
    return false;
  }
}

// Clear all items in shopping list
export async function clearShoppingList(listId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('shopping_list_items')
      .update({ is_purchased: true })
      .eq('shopping_list_id', listId);
    
    if (error) {
      console.error('Error clearing shopping list:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing shopping list:', error);
    return false;
  }
} 