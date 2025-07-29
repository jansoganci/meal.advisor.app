import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import { CategorySection, ShoppingListHeader } from '@/components/shopping-list';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import type { ShoppingList, ShoppingListItem } from '@/lib/database';
import { database } from '@/lib/database';
import { clearShoppingList, generateShoppingListFromWeeklyPlan, groupByCategory, updateShoppingListItem } from '@/lib/shopping-list';

interface WeeklyPlan {
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
      ingredients?: Array<{
        name: string;
        quantity: number;
        unit: string;
      }>;
    }>;
    totalCalories: number;
  }>;
}

export default function ShoppingListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse weekly plan from params if provided
  const weeklyPlan = params.weeklyPlan ? JSON.parse(params.weeklyPlan as string) as WeeklyPlan : null;
  const listId = params.listId as string | undefined;

  useEffect(() => {
    loadShoppingList();
  }, [listId]);

  const loadShoppingList = async () => {
    if (!user?.id) {
      setError('Please sign in to view shopping lists.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (listId) {
        // Load existing shopping list by ID
        const userLists = await database.shoppingLists.getUserLists(user.id);
        const list = userLists.find(l => l.id === listId);
        const listItems = await database.shoppingLists.getItems(listId);
        
        if (list && listItems) {
          setShoppingList(list);
          setItems(listItems);
        } else {
          setError('Shopping list not found.');
        }
      } else if (weeklyPlan) {
        // Generate new shopping list from weekly plan
        await generateFromWeeklyPlan();
      } else {
        // Load current shopping list
        const currentList = await database.shoppingLists.getUserLists(user.id);
        if (currentList.length > 0) {
          const listItems = await database.shoppingLists.getItems(currentList[0].id);
          setShoppingList(currentList[0]);
          setItems(listItems);
        } else {
          setError('No shopping list found. Create one from a weekly plan.');
        }
      }
    } catch (err: any) {
      console.error('Error loading shopping list:', err);
      setError('Failed to load shopping list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateFromWeeklyPlan = async () => {
    if (!user?.id || !weeklyPlan) return;

    try {
      setGenerating(true);
      setError(null);

      const newListId = await generateShoppingListFromWeeklyPlan(user.id, weeklyPlan);
      
      if (newListId) {
        const userLists = await database.shoppingLists.getUserLists(user.id);
        const list = userLists.find(l => l.id === newListId);
        const listItems = await database.shoppingLists.getItems(newListId);
        
        if (list && listItems) {
          setShoppingList(list);
          setItems(listItems);
        }
      } else {
        setError('Failed to generate shopping list. Please try again.');
      }
    } catch (err: any) {
      console.error('Error generating shopping list:', err);
      setError('Failed to generate shopping list. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleItem = useCallback(async (itemId: string, isPurchased: boolean) => {
    try {
      const success = await updateShoppingListItem(itemId, { is_purchased: isPurchased });
      
      if (success) {
        setItems(prevItems => 
          prevItems.map(item => 
            item.id === itemId 
              ? { ...item, is_purchased: isPurchased }
              : item
          )
        );
      }
    } catch (err: any) {
      console.error('Error updating item:', err);
      Alert.alert('Error', 'Failed to update item. Please try again.');
    }
  }, []);

  const handleClearAll = async () => {
    if (!shoppingList?.id) return;

    try {
      const success = await clearShoppingList(shoppingList.id);
      
      if (success) {
        setItems(prevItems => 
          prevItems.map(item => ({ ...item, is_purchased: true }))
        );
      }
    } catch (err: any) {
      console.error('Error clearing shopping list:', err);
      Alert.alert('Error', 'Failed to clear shopping list. Please try again.');
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ShoppingListHeader
          title="Shopping List"
          onBack={handleBack}
          onClearAll={handleClearAll}
          hasItems={items.length > 0}
        />
        <ThemedView style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>
            {generating ? 'Generating shopping list...' : 'Loading shopping list...'}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ShoppingListHeader
          title="Shopping List"
          onBack={handleBack}
          onClearAll={handleClearAll}
          hasItems={false}
        />
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorIcon}>⚠️</ThemedText>
          <ThemedText style={styles.errorTitle}>Unable to Load List</ThemedText>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (!shoppingList || items.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ShoppingListHeader
          title="Shopping List"
          onBack={handleBack}
          onClearAll={handleClearAll}
          hasItems={false}
        />
        <ThemedView style={styles.emptyContainer}>
          <ThemedText style={styles.emptyIcon}>🛒</ThemedText>
          <ThemedText style={styles.emptyTitle}>No Items</ThemedText>
          <ThemedText style={styles.emptyText}>
            Your shopping list is empty. Create a weekly plan to generate a shopping list.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  // Group items by category - convert ShoppingListItem to the format expected by groupByCategory
  const itemsForGrouping = items.map(item => ({
    name: item.name,
    totalQuantity: item.quantity || 0,
    unit: item.unit || '',
    category: item.category || 'Other',
    isPurchased: item.is_purchased || false
  }));
  
  const groupedItems = groupByCategory(itemsForGrouping);

  return (
    <ThemedView style={styles.container}>
      <ShoppingListHeader
        title={shoppingList.title}
        onBack={handleBack}
        onClearAll={handleClearAll}
        hasItems={items.length > 0}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <CategorySection
            key={category}
            category={category}
            items={items.filter(item => (item.category || 'Other') === category)}
            onToggleItem={handleToggleItem}
          />
        ))}
        
        <ThemedView style={styles.bottomPadding} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 47,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomPadding: {
    height: 100,
  },
}); 