import { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface NutritionCardProps {
  profileCalories?: number | null;
  profileProtein?: number | null;
  calories?: number;
  protein?: number;
  onCaloriesChange?: (value: number) => void;
  onProteinChange?: (value: number) => void;
  error?: string | null;
}

const DEFAULT_CALORIES = 1800;
const DEFAULT_PROTEIN = 60;

export function NutritionCard({ 
  profileCalories,
  profileProtein,
  calories,
  protein,
  onCaloriesChange,
  onProteinChange,
  error
}: NutritionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Use profile values or defaults
  const finalCalories = calories ?? profileCalories ?? DEFAULT_CALORIES;
  const finalProtein = protein ?? profileProtein ?? DEFAULT_PROTEIN;
  
  // Check if we're using defaults
  const usingDefaultCalories = !profileCalories && !calories;
  const usingDefaultProtein = !profileProtein && !protein;
  const usingDefaults = usingDefaultCalories || usingDefaultProtein;

  const calorieOptions = [1400, 1600, 1800, 2000, 2200, 2400];
  const proteinOptions = [40, 60, 80, 100, 120, 150];

  const handleCaloriesSelect = (value: number) => {
    onCaloriesChange?.(value);
  };

  const handleProteinSelect = (value: number) => {
    onProteinChange?.(value);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>⚙️ Nutrition (from your profile)</ThemedText>
      
      <ThemedView style={styles.displayRow}>
        <ThemedText style={styles.displayText}>
          {finalCalories} cal/day • {finalProtein}g protein
        </ThemedText>
        <TouchableOpacity 
          style={styles.adjustButton}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <ThemedText style={styles.adjustButtonText}>
            {isExpanded ? 'Done' : 'Adjust'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {usingDefaults && (
        <ThemedText style={styles.defaultNote}>Default values used</ThemedText>
      )}

      {isExpanded && (
        <ThemedView style={styles.adjustmentContainer}>
          <ThemedView style={styles.adjustmentSection}>
            <ThemedText style={styles.adjustmentLabel}>Daily Calories</ThemedText>
            <ThemedView style={styles.optionsGrid}>
              {calorieOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    finalCalories === option && styles.selectedButton
                  ]}
                  onPress={() => handleCaloriesSelect(option)}
                >
                  <ThemedText style={[
                    styles.optionText,
                    finalCalories === option && styles.selectedText
                  ]}>
                    {option}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.adjustmentSection}>
            <ThemedText style={styles.adjustmentLabel}>Daily Protein (g)</ThemedText>
            <ThemedView style={styles.optionsGrid}>
              {proteinOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    finalProtein === option && styles.selectedButton
                  ]}
                  onPress={() => handleProteinSelect(option)}
                >
                  <ThemedText style={[
                    styles.optionText,
                    finalProtein === option && styles.selectedText
                  ]}>
                    {option}g
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </ThemedView>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  displayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  displayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  adjustButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  adjustButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  defaultNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  adjustmentContainer: {
    marginTop: 16,
  },
  adjustmentSection: {
    marginBottom: 20,
  },
  adjustmentLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    color: '#333',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minWidth: 70,
  },
  selectedButton: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  optionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  selectedText: {
    color: 'white',
  },
}); 