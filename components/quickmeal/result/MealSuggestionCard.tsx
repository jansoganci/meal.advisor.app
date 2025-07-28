import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import type { QuickMealSuggestion } from '@/lib/ai/types';

interface MealSuggestionCardProps {
  suggestion: QuickMealSuggestion;
  onPress?: () => void;
}

export const MealSuggestionCard: React.FC<MealSuggestionCardProps> = ({
  suggestion,
  onPress
}) => {
  const formatCalories = (calories: number) => {
    return `${calories} cal`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return '#28a745';
      case 'medium':
        return '#ffc107';
      case 'hard':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <ThemedView style={styles.header}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText style={styles.title}>{suggestion.title}</ThemedText>
          <TouchableOpacity style={styles.favoriteButton}>
            <ThemedText style={styles.favoriteIcon}>🤍</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedView style={styles.metaContainer}>
          <ThemedView style={styles.metaItem}>
            <ThemedText style={styles.metaIcon}>⏱️</ThemedText>
            <ThemedText style={styles.metaText}>
              {suggestion.totalTime}
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.metaItem}>
            <ThemedText style={styles.metaIcon}>🔥</ThemedText>
            <ThemedText style={styles.metaText}>
              {formatCalories(suggestion.calories)}
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.metaItem}>
            <ThemedText style={styles.metaIcon}>💰</ThemedText>
            <ThemedText style={styles.metaText}>
              {suggestion.estimatedCost}
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.metaItem}>
            <ThemedText style={styles.metaIcon}>📊</ThemedText>
            <ThemedText style={[
              styles.metaText,
              { color: getDifficultyColor(suggestion.difficulty) }
            ]}>
              {suggestion.difficulty}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedText style={styles.description}>
        {suggestion.description}
      </ThemedText>

      {/* Tags */}
      {suggestion.tags.length > 0 && (
        <ThemedView style={styles.tagsContainer}>
          {suggestion.tags.map((tag, idx) => (
            <ThemedView key={idx} style={styles.tag}>
              <ThemedText style={styles.tagText}>{tag}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      )}
    </TouchableOpacity>
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
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  metaIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '500',
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 20,
  },
}); 