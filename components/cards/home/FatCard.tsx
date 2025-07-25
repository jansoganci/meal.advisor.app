import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface FatCardProps {
  fatLeft?: number;
}

export function FatCard({ fatLeft = 25 }: FatCardProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.amount}>{fatLeft}g left</ThemedText>
      <ThemedText style={styles.icon}>🥑</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 12,
    alignSelf: 'center',
    minWidth: 120,
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