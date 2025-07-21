import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { UserProfile } from '@/types/profile'

interface StatsCardProps {
  profile: UserProfile
}

export const StatsCard: React.FC<StatsCardProps> = ({ profile }) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#3B82F6' }
    if (bmi < 25) return { category: 'Normal', color: '#10B981' }
    if (bmi < 30) return { category: 'Overweight', color: '#F59E0B' }
    return { category: 'Obese', color: '#EF4444' }
  }

  const bmiInfo = profile.bmi ? getBMICategory(profile.bmi) : null

  return (
    <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}>
      <Text style={[styles.title, { color: colors.text }]}>📊 Your Stats</Text>
      
      <View style={styles.statsContainer}>
        {profile.bmi && (
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.text }]}>🔥 BMI</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {profile.bmi.toFixed(1)}
            </Text>
            {bmiInfo && (
              <Text style={[styles.statCategory, { color: bmiInfo.color }]}>
                {bmiInfo.category}
              </Text>
            )}
          </View>
        )}
        
        {profile.daily_calorie_goal && (
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.text }]}>🎯 Daily Calories</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {profile.daily_calorie_goal}
            </Text>
            <Text style={[styles.statUnit, { color: colors.text }]}>
              calories
            </Text>
          </View>
        )}
        
        {profile.daily_protein_goal && (
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.text }]}>💪 Daily Protein</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {profile.daily_protein_goal}g
            </Text>
            <Text style={[styles.statUnit, { color: colors.text }]}>
              protein
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statCategory: {
    fontSize: 12,
    fontWeight: '600',
  },
  statUnit: {
    fontSize: 12,
    opacity: 0.7,
  },
})