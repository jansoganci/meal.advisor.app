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
      <ThemedText style={styles.title}>Nutrition Information</ThemedText>
      
      <ThemedView style={styles.caloriesContainer}>
        <ThemedText style={styles.caloriesLabel}>Total Calories</ThemedText>
        <ThemedText style={styles.caloriesValue}>{totalCalories} cal</ThemedText>
        {servings > 1 && (
          <ThemedText style={styles.servingsText}>
            ({calories} cal per serving × {servings} servings)
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.macrosContainer}>
        <ThemedText style={styles.macrosTitle}>Macronutrients:</ThemedText>
        
        <ThemedView style={styles.macroItem}>
          <ThemedView style={styles.macroHeader}>
            <ThemedText style={styles.macroLabel}>Protein</ThemedText>
            <ThemedText style={styles.macroValue}>{totalProtein}g</ThemedText>
          </ThemedView>
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

        <ThemedView style={styles.macroItem}>
          <ThemedView style={styles.macroHeader}>
            <ThemedText style={styles.macroLabel}>Carbohydrates</ThemedText>
            <ThemedText style={styles.macroValue}>{totalCarbs}g</ThemedText>
          </ThemedView>
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

        <ThemedView style={styles.macroItem}>
          <ThemedView style={styles.macroHeader}>
            <ThemedText style={styles.macroLabel}>Fat</ThemedText>
            <ThemedText style={styles.macroValue}>{totalFat}g</ThemedText>
          </ThemedView>
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

      <ThemedView style={styles.nutritionNotes}>
        <ThemedText style={styles.notesTitle}>Nutrition Notes:</ThemedText>
        <ThemedText style={styles.notesText}>
          • Protein: {totalProtein}g ({getMacroPercentage(nutrition.protein)}% of calories)
        </ThemedText>
        <ThemedText style={styles.notesText}>
          • Carbs: {totalCarbs}g ({getMacroPercentage(nutrition.carbs)}% of calories)
        </ThemedText>
        <ThemedText style={styles.notesText}>
          • Fat: {totalFat}g ({getFatPercentage(nutrition.fat)}% of calories)
        </ThemedText>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  caloriesContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  caloriesLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  caloriesValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B35',
  },
  servingsText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  macrosContainer: {
    marginBottom: 16,
  },
  macrosTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  macroItem: {
    marginBottom: 16,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  macroLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
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
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  nutritionNotes: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  notesText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    lineHeight: 16,
  },
}); 