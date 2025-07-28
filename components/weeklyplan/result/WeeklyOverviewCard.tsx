import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface WeeklyOverviewCardProps {
  avgCalories: number;
  avgProtein: number;
  estimatedCost: number;
}

export const WeeklyOverviewCard: React.FC<WeeklyOverviewCardProps> = ({
  avgCalories,
  avgProtein,
  estimatedCost
}) => {
  const formatCost = (cost: number) => {
    return `$${cost.toFixed(0)}`;
  };

  return (
    <ThemedView style={styles.card}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>📊 This Week Overview</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.statsContainer}>
        <ThemedView style={styles.statItem}>
          <ThemedText style={styles.statLabel}>Avg calories/day</ThemedText>
          <ThemedText style={styles.statValue}>{avgCalories}</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.statItem}>
          <ThemedText style={styles.statLabel}>Avg protein/day</ThemedText>
          <ThemedText style={styles.statValue}>{avgProtein}g</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.statItem}>
          <ThemedText style={styles.statLabel}>Est. cost</ThemedText>
          <ThemedText style={styles.statValue}>{formatCost(estimatedCost)}</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
  },
}); 