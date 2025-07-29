import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { favoritesService, type FavoriteRecipe } from '@/lib/favorites';

export default function FavoritesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Local state for MVP (no global context)
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<FavoriteRecipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load favorites on mount
  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  // Filter favorites when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFavorites(favorites);
    } else {
      const filtered = favorites.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFavorites(filtered);
    }
  }, [searchQuery, favorites]);

  // Load favorites from database
  const loadFavorites = async () => {
    if (!user) {
      console.log('❌ No user found, cannot load favorites');
      return;
    }

    console.log('🔄 Loading favorites for user:', user.id);

    try {
      setError(null);
      const data = await favoritesService.getUserFavorites(user.id);
      console.log('📋 Favorites loaded:', data.length, 'items');
      console.log('📋 Raw favorites data:', data);
      setFavorites(data);
    } catch (err) {
      console.error('❌ Error loading favorites:', err);
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  // Handle pull to refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  // Handle remove from favorites
  const handleRemoveFavorite = async (recipeId: string) => {
    if (!user) return;

    try {
      const result = await favoritesService.removeFromFavorites(user.id, recipeId);
      if (result.success) {
        // Optimistic update - remove from local state
        setFavorites(prev => prev.filter(recipe => recipe.id !== recipeId));
      } else {
        Alert.alert('Error', result.error || 'Failed to remove from favorites');
      }
    } catch (err) {
      console.error('Error removing favorite:', err);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  // Handle recipe press - navigate to detail screen
  const handleRecipePress = (recipe: FavoriteRecipe) => {
    router.push({
      pathname: '/favorite-recipe-detail',
      params: { recipeData: JSON.stringify(recipe) }
    });
  };

  // Handle discover meals button (empty state)
  const handleDiscoverMeals = () => {
    router.push('/(tabs)/');
  };

  // Render individual recipe card
  const renderRecipeCard = ({ item }: { item: FavoriteRecipe }) => (
    <TouchableOpacity 
      style={styles.recipeCard}
      onPress={() => handleRecipePress(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
          <TouchableOpacity 
            style={styles.heartButton}
            onPress={() => handleRemoveFavorite(item.id)}
          >
            <ThemedText style={styles.heartIcon}>❤️</ThemedText>
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <ThemedText style={styles.metaIcon}>⭐</ThemedText>
            <ThemedText style={styles.metaText}>
              {item.average_rating ? item.average_rating.toFixed(1) : '4.5'}
            </ThemedText>
          </View>
          
          <View style={styles.metaItem}>
            <ThemedText style={styles.metaIcon}>⏱️</ThemedText>
            <ThemedText style={styles.metaText}>
              {item.total_time_minutes ? `${item.total_time_minutes} min` : '30 min'}
            </ThemedText>
          </View>
          
          <View style={styles.metaItem}>
            <ThemedText style={styles.metaIcon}>🔥</ThemedText>
            <ThemedText style={styles.metaText}>
              {item.calories ? `${item.calories} cal` : '300 cal'}
            </ThemedText>
          </View>
        </View>
      </View>

      <ThemedText style={styles.cardDescription}>
        {item.description || 'Delicious AI-generated recipe'}
      </ThemedText>

      <ThemedText style={styles.addedAt}>
        Added {formatTimeAgo(item.added_at)} ago
      </ThemedText>
    </TouchableOpacity>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <ThemedText style={styles.emptyIcon}>❤️</ThemedText>
      <ThemedText style={styles.emptyTitle}>No favorites yet!</ThemedText>
      <ThemedText style={styles.emptyDescription}>
        Start exploring meals and tap the heart icon to save your favorites here
      </ThemedText>
      <TouchableOpacity style={styles.discoverButton} onPress={handleDiscoverMeals}>
        <ThemedText style={styles.discoverButtonText}>Discover Meals 🍽️</ThemedText>
      </TouchableOpacity>
    </View>
  );

  // Render loading state
  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ThemedText style={styles.loadingText}>Loading your favorites...</ThemedText>
    </View>
  );

  // Render error state
  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <ThemedText style={styles.errorIcon}>⚠️</ThemedText>
      <ThemedText style={styles.errorTitle}>Unable to Load Favorites</ThemedText>
      <ThemedText style={styles.errorText}>{error}</ThemedText>
      <TouchableOpacity style={styles.retryButton} onPress={loadFavorites}>
        <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>❤️ My Favorite Recipes</ThemedText>
        </ThemedView>
        {renderLoadingState()}
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>❤️ My Favorite Recipes</ThemedText>
        </ThemedView>
        {renderErrorState()}
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>❤️ My Favorite Recipes</ThemedText>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search favorites..."
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <IconSymbol name="xmark.circle.fill" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </ThemedView>

      {/* Favorites List */}
      {filteredFavorites.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredFavorites}
          renderItem={renderRecipeCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#FF6B35"
            />
          }
        />
      )}

      {/* Stats Footer */}
      {favorites.length > 0 && (
        <View style={styles.statsFooter}>
          <ThemedText style={styles.statsText}>
            📊 {favorites.length} recipe{favorites.length === 1 ? '' : 's'} in favorites
          </ThemedText>
        </View>
      )}
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
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  heartButton: {
    padding: 4,
  },
  heartIcon: {
    fontSize: 20,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
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
  cardDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  addedAt: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  discoverButton: {
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
  discoverButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
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
  statsFooter: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
}); 