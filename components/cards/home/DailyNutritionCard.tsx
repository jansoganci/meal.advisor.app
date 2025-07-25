import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface DailyNutritionCardProps {
  dailyCalories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export function DailyNutritionCard({ 
  dailyCalories = 2000, 
  protein = 150, 
  carbs = 200, 
  fat = 67 
}: DailyNutritionCardProps) {
  return (
    <ThemedView style={styles.container}>
      {/* Daily Calories Section */}
      <ThemedView style={styles.caloriesSection}>
        <ThemedText style={styles.caloriesLabel}>Daily Calories</ThemedText>
        <ThemedText style={styles.caloriesNumber}>{dailyCalories}</ThemedText>
      </ThemedView>
      
      {/* Macros Section */}
      <ThemedView style={styles.macrosSection}>
        <ThemedView style={styles.macroColumn}>
          <ThemedText style={styles.macroNumber}>{protein}g</ThemedText>
          <ThemedText style={styles.macroLabel}>Protein</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.macroColumn}>
          <ThemedText style={styles.macroNumber}>{carbs}g</ThemedText>
          <ThemedText style={styles.macroLabel}>Carbs</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.macroColumn}>
          <ThemedText style={styles.macroNumber}>{fat}g</ThemedText>
          <ThemedText style={styles.macroLabel}>Fat</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    gap: 16,
  },
  caloriesSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  caloriesLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  caloriesNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FF6B35',
  },
  macrosSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  macroColumn: {
    alignItems: 'center',
    flex: 1,
  },
  macroNumber: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
}); 