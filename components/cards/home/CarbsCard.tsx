import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface CarbsCardProps {
  carbsLeft?: number;
}

export function CarbsCard({ carbsLeft = 99 }: CarbsCardProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.amount}>{carbsLeft}g left</ThemedText>
      <ThemedText style={styles.icon}>🍞</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
  },
}); 