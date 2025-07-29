import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/contexts/ProfileContext'
import { supabase } from '@/lib/supabase'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface StatsCardProps {
  meals?: number
  favorites?: number
  weeks?: number
  rating?: number
}

export const StatsCard: React.FC<StatsCardProps> = React.memo(({
  meals,
  favorites,
  weeks,
  rating
}) => {
  const { user } = useAuth()
  const { profile } = useProfile()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Real stats state
  const [realMeals, setRealMeals] = useState(meals || 0)
  const [realFavorites, setRealFavorites] = useState(favorites || 0)
  const [realWeeks, setRealWeeks] = useState(weeks || 0)
  const [realRating, setRealRating] = useState(rating || 0)

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchStats = useCallback(async () => {
    if (!user?.id) return

    setLoading(true)
    setError(null)

    try {
      // Fetch meal plans count
      const { count: mealPlansCount, error: mealError } = await supabase
        .from('meal_plans')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if (mealError) {
        console.error('Error fetching meal plans:', mealError)
      } else {
        setRealMeals(mealPlansCount || 0)
      }

      // Fetch favorites count (assuming there's a favorites table)
      const { count: favoritesCount, error: favError } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if (favError) {
        console.error('Error fetching favorites:', favError)
      } else {
        setRealFavorites(favoritesCount || 0)
      }

      // Calculate weeks of usage based on profile creation date
      if (profile?.created_at) {
        const createdDate = new Date(profile.created_at)
        const now = new Date()
        const weeksDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 7))
        setRealWeeks(Math.max(1, weeksDiff)) // At least 1 week
      } else {
        setRealWeeks(1) // Default to 1 week
      }

      // For now, use a default rating - this could be calculated from user feedback later
      setRealRating(4.8)

    } catch (err) {
      console.error('Error fetching stats:', err)
      setError('Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }, [user?.id, profile?.created_at])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // Memoized stats data to prevent unnecessary re-renders
  const statsData = useMemo(() => [
    { icon: '🍽️', value: realMeals, label: 'meals' },
    { icon: '❤️', value: realFavorites, label: 'favorites' },
    { icon: '📅', value: realWeeks, label: 'weeks' },
    { icon: '⭐', value: realRating, label: 'rating' }
  ], [realMeals, realFavorites, realWeeks, realRating])

  if (loading) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Your Stats</Text>
        <View style={styles.statsGrid}>
          {[1, 2, 3, 4].map((index) => (
            <View key={index} style={styles.statItem}>
              <View style={styles.skeletonIcon} />
              <View style={styles.skeletonValue} />
              <View style={styles.skeletonLabel} />
            </View>
          ))}
        </View>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Your Stats</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchStats}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Your Stats</Text>
      
      <View style={styles.statsGrid}>
        {statsData.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statIcon}>{stat.icon}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  )
})

StatsCard.displayName = 'StatsCard'

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'lowercase',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  skeletonIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 8,
  },
  skeletonValue: {
    width: 50,
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 2,
  },
  skeletonLabel: {
    width: 60,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
  },
}) 