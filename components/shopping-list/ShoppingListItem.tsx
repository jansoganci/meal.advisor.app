import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import type { ShoppingListItem as ShoppingListItemType } from '@/lib/database';

interface ShoppingListItemProps {
  item: ShoppingListItemType;
  onToggle: (itemId: string, isPurchased: boolean) => void;
  checked: boolean;
}

export const ShoppingListItem: React.FC<ShoppingListItemProps> = ({
  item,
  onToggle,
  checked
}) => {
  const handleToggle = () => {
    onToggle(item.id, !checked);
  };

  const formatQuantity = () => {
    if (!item.quantity) return '';
    const quantity = parseFloat(item.quantity.toString());
    const unit = item.unit || '';
    
    if (quantity === Math.floor(quantity)) {
      return `${quantity} ${unit}`.trim();
    } else {
      return `${quantity} ${unit}`.trim();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, checked && styles.checkedContainer]}
      onPress={handleToggle}
      activeOpacity={0.7}
    >
      <ThemedView style={[styles.checkbox, checked && styles.checkedCheckbox]}>
        {checked && (
          <ThemedText style={styles.checkmark}>✓</ThemedText>
        )}
      </ThemedView>
      
      <ThemedView style={styles.content}>
        <ThemedText style={[styles.itemName, checked && styles.checkedText]}>
          {item.name}
        </ThemedText>
        {item.quantity && (
          <ThemedText style={[styles.quantity, checked && styles.checkedText]}>
            {formatQuantity()}
          </ThemedText>
        )}
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  checkedContainer: {
    opacity: 0.5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF6B35',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkedCheckbox: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  quantity: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
}); 