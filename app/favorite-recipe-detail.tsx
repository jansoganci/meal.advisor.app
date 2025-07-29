import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {
    InstructionsCard,
    NutritionInfoCard
} from '@/components/quickmeal';
import { useAuth } from '@/contexts/AuthContext';
import { favoritesService, type FavoriteRecipe } from '@/lib/favorites';

// Helper function to convert recipe ingredients to expected format
const convertRecipeIngredientsToObjects = (ingredients: any) => {
  if (Array.isArray(ingredients)) {
    // If it's already an array of objects, return as is
    if (ingredients.length > 0 && typeof ingredients[0] === 'object') {
      return ingredients;
    }
    
    // If it's an array of strings, convert to objects
    return ingredients.map((ingredient: string, index: number) => ({
      step: index + 1,
      name: ingredient,
      amount: 1,
      unit: '',
      notes: ''
    }));
  }
  
  return [];
};

// Helper function to convert recipe instructions to expected format  
const convertRecipeInstructionsToObjects = (instructions: any) => {
  if (Array.isArray(instructions)) {
    // If it's already an array of objects, return as is
    if (instructions.length > 0 && typeof instructions[0] === 'object') {
      return instructions.map((inst: any) => inst.instruction || inst);
    }
    
    // If it's an array of strings, return as is
    return instructions;
  }
  
  return [];
};

export default function FavoriteRecipeDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  
  const [recipe, setRecipe] = useState<FavoriteRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    try {
      if (params.recipeData) {
        const parsedRecipe = JSON.parse(params.recipeData as string) as FavoriteRecipe;
        setRecipe(parsedRecipe);
      } else {
        setError('No recipe data provided');
      }
    } catch (err) {
      console.error('Error parsing recipe data:', err);
      setError('Failed to load recipe data');
    } finally {
      setLoading(false);
    }
  }, [params.recipeData]);

  const handleBackPress = () => {
    router.back();
  };

  const handleRemoveFromFavorites = async () => {
    if (!user || !recipe) return;

    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this recipe from your favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setIsRemoving(true);
            try {
              const result = await favoritesService.removeFromFavorites(user.id, recipe.id);
              if (result.success) {
                Alert.alert('Success', 'Recipe removed from favorites', [
                  { text: 'OK', onPress: () => router.back() }
                ]);
              } else {
                Alert.alert('Error', result.error || 'Failed to remove from favorites');
              }
            } catch (err) {
              console.error('Error removing favorite:', err);
              Alert.alert('Error', 'An unexpected error occurred');
            } finally {
              setIsRemoving(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ThemedText style={styles.backButtonText}>← Back</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.title}>Recipe Details</ThemedText>
        </ThemedView>
        <ThemedView style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Loading recipe...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (error || !recipe) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ThemedText style={styles.backButtonText}>← Back</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.title}>Recipe Details</ThemedText>
        </ThemedView>
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorIcon}>⚠️</ThemedText>
          <ThemedText style={styles.errorTitle}>Unable to Load Recipe</ThemedText>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={handleBackPress}>
            <ThemedText style={styles.retryButtonText}>Go Back</ThemedText>
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
        <ThemedText style={styles.title}>Recipe Details</ThemedText>
        <TouchableOpacity 
          style={[styles.favoriteButton, isRemoving && styles.favoriteButtonDisabled]}
          onPress={handleRemoveFromFavorites}
          disabled={isRemoving}
        >
          <ThemedText style={styles.favoriteIcon}>❤️</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Recipe Header */}
        <ThemedView style={styles.recipeHeader}>
          <ThemedText style={styles.recipeTitle}>{recipe.title}</ThemedText>
          <ThemedText style={styles.recipeDescription}>
            {recipe.description || 'Delicious AI-generated recipe'}
          </ThemedText>
          
          <ThemedView style={styles.recipeMeta}>
            <ThemedView style={styles.metaItem}>
              <ThemedText style={styles.metaIcon}>⭐</ThemedText>
              <ThemedText style={styles.metaText}>
                {recipe.average_rating ? recipe.average_rating.toFixed(1) : '4.5'}
              </ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.metaItem}>
              <ThemedText style={styles.metaIcon}>⏱️</ThemedText>
              <ThemedText style={styles.metaText}>
                {recipe.total_time_minutes ? `${recipe.total_time_minutes} min` : '30 min'}
              </ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.metaItem}>
              <ThemedText style={styles.metaIcon}>🔥</ThemedText>
              <ThemedText style={styles.metaText}>
                {recipe.calories ? `${recipe.calories} cal` : '300 cal'}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.metaItem}>
              <ThemedText style={styles.metaIcon}>📊</ThemedText>
              <ThemedText style={styles.metaText}>
                {recipe.difficulty_level || 'Medium'}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedText style={styles.addedAt}>
            Added to favorites {formatTimeAgo(recipe.added_at)} ago
          </ThemedText>
        </ThemedView>

        {/* Nutrition Information */}
        <NutritionInfoCard
          nutrition={{
            protein: recipe.protein_g || 0,
            carbs: recipe.carbs_g || 0,
            fat: recipe.fat_g || 0
          }}
          calories={recipe.calories || 0}
          servings={recipe.servings || 1}
        />

        {/* Instructions */}
        <InstructionsCard
          ingredients={convertRecipeIngredientsToObjects(recipe.ingredients)}
          instructions={convertRecipeInstructionsToObjects(recipe.instructions)}
          tips={recipe.dietary_tags || []}
          title={`${recipe.title} - Instructions`}
        />

        {/* Dietary Tags */}
        {recipe.dietary_tags && recipe.dietary_tags.length > 0 && (
          <ThemedView style={styles.tagsSection}>
            <ThemedText style={styles.tagsSectionTitle}>Dietary Tags</ThemedText>
            <ThemedView style={styles.tagsContainer}>
              {recipe.dietary_tags.map((tag, idx) => (
                <ThemedView key={idx} style={styles.tag}>
                  <ThemedText style={styles.tagText}>{tag}</ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        )}

        <ThemedView style={styles.bottomPadding} />
      </ScrollView>
    </ThemedView>
  );
}

// Helper function to format time ago
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days`;
  return `${Math.floor(diffInSeconds / 604800)} weeks`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 47,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF6B35',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteButtonDisabled: {
    opacity: 0.5,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  scrollView: {
    flex: 1,
  },
  recipeHeader: {
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
  recipeTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 22,
  },
  recipeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  metaIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  addedAt: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  tagsSection: {
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
  tagsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
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
  bottomPadding: {
    height: 100,
  },
}); 