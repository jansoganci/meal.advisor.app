import React from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface Meal {
  name: string;
  calories: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface DayMealCardProps {
  dayName: string;
  meals: Meal[];
  totalCalories: number;
}

export const DayMealCard: React.FC<DayMealCardProps> = ({
  dayName,
  meals,
  totalCalories
}) => {
  const getMealIcon = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '🌞';
      case 'dinner':
        return '🌙';
      case 'snack':
        return '🍎';
      default:
        return '🍽️';
    }
  };

  const handleMealPress = (mealName: string) => {
    Alert.alert('Recipe Details', 'Full recipe details coming soon.');
  };

  return (
    <ThemedView style={styles.card}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.dayName}>{dayName.toUpperCase()}</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.mealsContainer}>
        {meals.map((meal, index) => (
          <TouchableOpacity
            key={index}
            style={styles.mealItem}
            onPress={() => handleMealPress(meal.name)}
            activeOpacity={0.7}
          >
            <ThemedView style={styles.mealInfo}>
              <ThemedText style={styles.mealIcon}>
                {getMealIcon(meal.type)}
              </ThemedText>
              <ThemedText style={styles.mealName}>
                {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}: {meal.name}
              </ThemedText>
            </ThemedView>
            <ThemedText style={styles.mealCalories}>
              ({meal.calories})
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>
      
      <ThemedView style={styles.totalContainer}>
        <ThemedText style={styles.totalText}>
          Total: {totalCalories.toLocaleString()} cal
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  header: {
    marginBottom: 12,
  },
  dayName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    letterSpacing: 0.5,
  },
  mealsContainer: {
    marginBottom: 12,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  mealInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mealIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  mealName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  mealCalories: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
}); 