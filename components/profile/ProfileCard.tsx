import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { UserProfile } from '@/types/profile'
import { User } from '@/types/auth'

interface ProfileCardProps {
  profile: UserProfile | null
  user: User | null
  onEditPress: () => void
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, user, onEditPress }) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const getProfileCompletionPercentage = () => {
    if (!profile) return 0
    
    const fields = [
      profile.age,
      profile.gender,
      profile.height,
      profile.weight,
      profile.activity_level,
      profile.fitness_goal,
    ]
    
    const completedFields = fields.filter(field => field !== null && field !== undefined).length
    return Math.round((completedFields / fields.length) * 100)
  }

  const formatGender = (gender: string) => {
    return gender.charAt(0).toUpperCase() + gender.slice(1)
  }

  const formatActivityLevel = (level: string) => {
    return level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatFitnessGoal = (goal: string) => {
    return goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>👤</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.name, { color: colors.text }]}>
            {profile ? `${formatGender(profile.gender)}, ${profile.age}` : 'User'}
          </Text>
          <Text style={[styles.email, { color: colors.text }]}>
            {user?.email || 'user@example.com'}
          </Text>
        </View>
      </View>

      {profile && (
        <View style={styles.profileDetails}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>Height & Weight</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {profile.height}cm, {profile.weight}kg
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>Activity Level</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {formatActivityLevel(profile.activity_level)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>Fitness Goal</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {formatFitnessGoal(profile.fitness_goal)}
            </Text>
          </View>
          
          {profile.bmi && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.text }]}>BMI</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {profile.bmi.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.completionContainer}>
        <Text style={[styles.completionText, { color: colors.text }]}>
          Profile {getProfileCompletionPercentage()}% complete
        </Text>
        <View style={[styles.progressBar, { backgroundColor: colors.tabIconDefault }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.tint,
                width: `${getProfileCompletionPercentage()}%`,
              },
            ]}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.editButton, { backgroundColor: colors.tint }]}
        onPress={onEditPress}
        activeOpacity={0.8}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    fontSize: 48,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
  },
  profileDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 16,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  completionContainer: {
    marginBottom: 20,
  },
  completionText: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  editButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})