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
  if (!shoppingList) {
    return (
      <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
        <ThemedView style={styles.content}>
          <ThemedText style={styles.title}>Shopping List</ThemedText>
          <ThemedText style={styles.subtitle}>No active list</ThemedText>
          <ThemedText style={styles.actionText}>Create from weekly plan →</ThemedText>
        </ThemedView>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <ThemedView style={styles.content}>
        <ThemedText style={styles.title}>Shopping List</ThemedText>
        <ThemedText style={styles.subtitle}>{shoppingList.title}</ThemedText>
        <ThemedText style={styles.actionText}>View list →</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6B35',
  },
}); 