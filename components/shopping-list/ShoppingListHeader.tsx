import React from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface ShoppingListHeaderProps {
  title: string;
  onBack: () => void;
  onClearAll: () => void;
  hasItems: boolean;
}

export const ShoppingListHeader: React.FC<ShoppingListHeaderProps> = ({
  title,
  onBack,
  onClearAll,
  hasItems
}) => {
  const handleClearAll = () => {
    Alert.alert(
      'Clear All Items',
      'Are you sure you want to mark all items as purchased?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: onClearAll }
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ThemedText style={styles.backButtonText}>← Back</ThemedText>
        </TouchableOpacity>
        
        <ThemedText style={styles.title}>{title}</ThemedText>
        
        {hasItems && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
            <ThemedText style={styles.clearButtonText}>Clear All</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF6B35',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6B35',
  },
}); 