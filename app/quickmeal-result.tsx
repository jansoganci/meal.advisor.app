import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {
    InstructionsCard,
    MealSuggestionCard,
    NutritionInfoCard
} from '@/components/quickmeal';
import { useAuth } from '@/contexts/AuthContext';
import type { QuickMealSuggestion } from '@/lib/ai/types';
import { favoritesService } from '@/lib/favorites';
import { validateQuickMealResponse } from '@/lib/validation';

// Helper function to convert string ingredients to Ingredient objects
const convertStringIngredientsToObjects = (ingredients: string[]) => {
  return ingredients.map((ingredient) => ({
    name: ingredient,
    amount: 1, // Default amount since we don't have structured data
    unit: '', // Empty unit since we don't have structured data
    notes: ''
  }));
};

export default function QuickMealResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  
  const [suggestions, setSuggestions] = useState<QuickMealSuggestion[]>([]);
  const [mealPrepIdeas, setMealPrepIdeas] = useState<string[]>([]);
  const [timeSavingTips, setTimeSavingTips] = useState<string[]>([]);
  const [budgetTips, setBudgetTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Favorites state
  const [favoritedRecipes, setFavoritedRecipes] = useState<Set<string>>(new Set());
  const [togglingFavorites, setTogglingFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      // Parse the data from route params
      if (params.suggestions) {
        const parsedSuggestions = JSON.parse(params.suggestions as string);
        
        // Validate the response data
        const validation = validateQuickMealResponse({ suggestions: parsedSuggestions });
        if (!validation.isValid) {
          console.error('Response validation failed:', validation.errors);
          setError('Invalid meal data received. Please try generating new suggestions.');
          return;
        }
        
        setSuggestions(parsedSuggestions);
      }
      if (params.mealPrepIdeas) {
        setMealPrepIdeas(JSON.parse(params.mealPrepIdeas as string));
      }
      if (params.timeSavingTips) {
        setTimeSavingTips(JSON.parse(params.timeSavingTips as string));
      }
      if (params.budgetTips) {
        setBudgetTips(JSON.parse(params.budgetTips as string));
      }
    } catch (error) {
      console.error('Error parsing QuickMeal results:', error);
      setError('Failed to load meal suggestions. The data may be corrupted or incomplete.');
      Alert.alert(
        'Error Loading Results', 
        'Failed to load meal suggestions. Please try generating new suggestions.',
        [
          { text: 'Go Back', onPress: () => router.back() },
          { text: 'Try Again', onPress: () => router.back() }
        ]
      );
    } finally {
      setLoading(false);
    }
  }, [
    params.suggestions,
    params.mealPrepIdeas,
    params.timeSavingTips,
    params.budgetTips
  ]);

  const handleBackPress = () => {
    router.back();
  };

  const handleTryAgain = () => {
    router.back();
  };

  const handleMealPress = () => {
    // Handle meal selection - could navigate to detailed view or trigger favoriting
  };

  // Handle favorite toggle
  const handleToggleFavorite = async (suggestion: QuickMealSuggestion) => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to save favorites');
      return;
    }

    const recipeKey = generateRecipeKey(suggestion);
    const isFavorited = favoritedRecipes.has(recipeKey);
    
    // Optimistic update
    setTogglingFavorites(prev => new Set([...prev, recipeKey]));
    
    try {
      if (isFavorited) {
        // Remove from favorites - we need to find the recipe ID first
        // For MVP, we'll just show an alert since we don't store recipe IDs locally
        Alert.alert('Remove Favorite', 'Go to the Favorites tab to remove this recipe');
      } else {
        // Add to favorites
        const result = await favoritesService.addToFavorites(user.id, suggestion);
        if (result.success) {
          setFavoritedRecipes(prev => new Set([...prev, recipeKey]));
          Alert.alert('Success', 'Recipe added to favorites!');
        } else {
          Alert.alert('Error', result.error || 'Failed to add to favorites');
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setTogglingFavorites(prev => {
        const updated = new Set(prev);
        updated.delete(recipeKey);
        return updated;
      });
    }
  };

  // Generate a unique key for a recipe suggestion
  const generateRecipeKey = (suggestion: QuickMealSuggestion): string => {
    return `${suggestion.title}-${suggestion.calories}-${suggestion.ingredients.slice(0, 3).join(',')}`;
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ThemedText style={styles.backButtonText}>← Back</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.title}>Your Quick Meals</ThemedText>
        </ThemedView>
        <ThemedView style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Loading your meal suggestions...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ThemedText style={styles.backButtonText}>← Back</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.title}>Your Quick Meals</ThemedText>
        </ThemedView>
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorIcon}>⚠️</ThemedText>
          <ThemedText style={styles.errorTitle}>Unable to Load Results</ThemedText>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={handleTryAgain}>
            <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ThemedText style={styles.backButtonText}>← Back</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.title}>Your Quick Meals</ThemedText>
      </ThemedView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Meal Suggestions */}
        {suggestions.map((suggestion, index) => {
          const recipeKey = generateRecipeKey(suggestion);
          return (
            <ThemedView key={index} style={styles.suggestionContainer}>
              <MealSuggestionCard
                suggestion={suggestion}
                onPress={() => handleMealPress()}
                onToggleFavorite={handleToggleFavorite}
                isFavorited={favoritedRecipes.has(recipeKey)}
                isToggling={togglingFavorites.has(recipeKey)}
              />
            
            <NutritionInfoCard
              nutrition={suggestion.nutrition}
              calories={suggestion.calories}
              servings={1}
            />
            
            <InstructionsCard
              ingredients={convertStringIngredientsToObjects(suggestion.ingredients)}
              instructions={suggestion.quickInstructions}
              tips={suggestion.tips || []}
              title={`${suggestion.title} - Instructions`}
            />
          </ThemedView>
          );
        })}

        {/* Additional Tips Section */}
        {(mealPrepIdeas.length > 0 || timeSavingTips.length > 0 || budgetTips.length > 0) && (
          <ThemedView style={styles.tipsSection}>
            <ThemedText style={styles.tipsSectionTitle}>Additional Tips & Ideas</ThemedText>
            
            {mealPrepIdeas.length > 0 && (
              <ThemedView style={styles.tipCategory}>
                <ThemedText style={styles.tipCategoryTitle}>🍳 Meal Prep Ideas:</ThemedText>
                {mealPrepIdeas.map((idea, idx) => (
                  <ThemedText key={idx} style={styles.tipItem}>• {idea}</ThemedText>
                ))}
              </ThemedView>
            )}

            {timeSavingTips.length > 0 && (
              <ThemedView style={styles.tipCategory}>
                <ThemedText style={styles.tipCategoryTitle}>⏰ Time-Saving Tips:</ThemedText>
                {timeSavingTips.map((tip, idx) => (
                  <ThemedText key={idx} style={styles.tipItem}>• {tip}</ThemedText>
                ))}
              </ThemedView>
            )}

            {budgetTips.length > 0 && (
              <ThemedView style={styles.tipCategory}>
                <ThemedText style={styles.tipCategoryTitle}>💰 Budget Tips:</ThemedText>
                {budgetTips.map((tip, idx) => (
                  <ThemedText key={idx} style={styles.tipItem}>• {tip}</ThemedText>
                ))}
              </ThemedView>
            )}
          </ThemedView>
        )}

        {/* Action Buttons */}
        <ThemedView style={styles.actionContainer}>
          <TouchableOpacity style={styles.tryAgainButton} onPress={handleTryAgain}>
            <ThemedText style={styles.tryAgainText}>Try Different Preferences</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.bottomPadding} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 47,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF6B35',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  suggestionContainer: {
    marginBottom: 24,
  },
  tipsSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tipsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  tipCategory: {
    marginBottom: 16,
  },
  tipCategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    lineHeight: 20,
  },
  actionContainer: {
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  tryAgainButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tryAgainText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  bottomPadding: {
    height: 100,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
}); 