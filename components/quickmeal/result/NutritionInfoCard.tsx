import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface NutritionInfo {
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionInfoCardProps {
  nutrition: NutritionInfo;
  calories: number;
  servings?: number;
}

export const NutritionInfoCard: React.FC<NutritionInfoCardProps> = ({
  nutrition,
  calories,
  servings = 1
}) => {
  const totalCalories = calories * servings;
  const totalProtein = nutrition.protein * servings;
  const totalCarbs = nutrition.carbs * servings;
  const totalFat = nutrition.fat * servings;

  const getMacroPercentage = (macro: number) => {
    const macroCalories = macro * 4; // 4 calories per gram for protein and carbs
    return Math.round((macroCalories / totalCalories) * 100);
  };

  const getFatPercentage = (fat: number) => {
    const fatCalories = fat * 9; // 9 calories per gram for fat
    return Math.round((fatCalories / totalCalories) * 100);
  };

  return (
    <ThemedView style={styles.card}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Nutrition Information</ThemedText>
        <ThemedView style={styles.caloriesBadge}>
          <ThemedText style={styles.caloriesText}>{totalCalories} cal</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.macrosGrid}>
        <ThemedView style={styles.macroCard}>
          <ThemedText style={styles.macroLabel}>Protein</ThemedText>
          <ThemedText style={styles.macroAmount}>{totalProtein}g</ThemedText>
          <ThemedView style={styles.progressBar}>
            <ThemedView 
              style={[
                styles.progressFill, 
                styles.proteinFill,
                { width: `${getMacroPercentage(nutrition.protein)}%` }
              ]} 
            />
          </ThemedView>
          <ThemedText style={styles.percentageText}>
            {getMacroPercentage(nutrition.protein)}% of calories
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.macroCard}>
          <ThemedText style={styles.macroLabel}>Carb.</ThemedText>
          <ThemedText style={styles.macroAmount}>{totalCarbs}g</ThemedText>
          <ThemedView style={styles.progressBar}>
            <ThemedView 
              style={[
                styles.progressFill, 
                styles.carbsFill,
                { width: `${getMacroPercentage(nutrition.carbs)}%` }
              ]} 
            />
          </ThemedView>
          <ThemedText style={styles.percentageText}>
            {getMacroPercentage(nutrition.carbs)}% of calories
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.macroCard}>
          <ThemedText style={styles.macroLabel}>Fat</ThemedText>
          <ThemedText style={styles.macroAmount}>{totalFat}g</ThemedText>
          <ThemedView style={styles.progressBar}>
            <ThemedView 
              style={[
                styles.progressFill, 
                styles.fatFill,
                { width: `${getFatPercentage(nutrition.fat)}%` }
              ]} 
            />
          </ThemedView>
          <ThemedText style={styles.percentageText}>
            {getFatPercentage(nutrition.fat)}% of calories
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  caloriesBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  caloriesText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  macroCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  macroAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  proteinFill: {
    backgroundColor: '#28a745',
  },
  carbsFill: {
    backgroundColor: '#ffc107',
  },
  fatFill: {
    backgroundColor: '#dc3545',
  },
  percentageText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    lineHeight: 12,
  },
}); 