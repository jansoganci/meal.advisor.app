import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import type { ShoppingList } from '@/lib/database';

interface ShoppingListCardProps {
  shoppingList: ShoppingList | null;
  onPress: () => void;
}

export const ShoppingListCard: React.FC<ShoppingListCardProps> = ({
  shoppingList,
  onPress
}) => {
  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
        <ThemedText style={styles.buttonText}>Shopping List</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
}); 