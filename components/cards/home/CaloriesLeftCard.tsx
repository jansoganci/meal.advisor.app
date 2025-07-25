import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface CaloriesLeftCardProps {
  caloriesLeft?: number;
  totalCalories?: number;
}

export function CaloriesLeftCard({ 
  caloriesLeft = 1000, 
  totalCalories = 2000 
}: CaloriesLeftCardProps) {
  const progress = (caloriesLeft / totalCalories) * 100;
  
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Calories Left</ThemedText>
      <ThemedView style={styles.ringContainer}>
        <ThemedView style={styles.ring}>
          <ThemedText style={styles.caloriesNumber}>{caloriesLeft}</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 12,
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  caloriesNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B35',
  },
}); 