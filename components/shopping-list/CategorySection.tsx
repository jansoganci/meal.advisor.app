import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import type { ShoppingListItem as ShoppingListItemType } from '@/lib/database';
import { ShoppingListItem } from './ShoppingListItem';

interface CategorySectionProps {
  category: string;
  items: ShoppingListItemType[];
  onToggleItem: (itemId: string, isPurchased: boolean) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  items,
  onToggleItem
}) => {
  if (items.length === 0) {
    return null;
  }

  const purchasedCount = items.filter(item => item.is_purchased).length;
  const totalCount = items.length;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.categoryTitle}>{category}</ThemedText>
        <ThemedText style={styles.itemCount}>
          {purchasedCount} of {totalCount}
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.itemsContainer}>
        {items.map((item) => (
          <ShoppingListItem
            key={item.id}
            item={item}
            onToggle={onToggleItem}
            checked={item.is_purchased || false}
          />
        ))}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  itemsContainer: {
    paddingLeft: 4,
  },
}); 