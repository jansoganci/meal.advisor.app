import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface WeeklyActionsCardProps {
  onRegenerate: () => void;
  loading?: boolean;
  weeklyPlan?: any; // Add weekly plan prop
}

export const WeeklyActionsCard: React.FC<WeeklyActionsCardProps> = ({
  onRegenerate,
  loading = false,
  weeklyPlan
}) => {
  const router = useRouter();

  const handleShoppingListPress = () => {
    if (weeklyPlan) {
      router.push({
        pathname: '/shopping-list',
        params: { weeklyPlan: JSON.stringify(weeklyPlan) }
      });
    } else {
      Alert.alert('Shopping List', 'Weekly plan data not available');
    }
  };

  const handleRegeneratePress = () => {
    onRegenerate();
  };

  return (
    <ThemedView style={styles.card}>
      <ThemedView style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.shoppingButton]}
          onPress={handleShoppingListPress}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.shoppingButtonText}>
            📋 Shopping List
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.regenerateButton,
            loading && styles.regenerateButtonDisabled
          ]}
          onPress={handleRegeneratePress}
          disabled={loading}
          activeOpacity={0.8}
        >
          <ThemedText style={[
            styles.regenerateButtonText,
            loading && styles.regenerateButtonTextDisabled
          ]}>
            {loading ? '🔄 Generating...' : '🔄 Regenerate'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
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
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shoppingButton: {
    backgroundColor: '#28a745',
    borderWidth: 2,
    borderColor: '#28a745',
  },
  regenerateButton: {
    backgroundColor: '#FF6B35',
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  regenerateButtonDisabled: {
    backgroundColor: '#ccc',
    borderColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  shoppingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  regenerateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  regenerateButtonTextDisabled: {
    color: '#666',
  },
}); 