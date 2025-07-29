import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/contexts/ProfileContext'
import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface ProfileCardProps {
  name?: string
  email?: string
  avatar?: string
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  email,
  avatar = '👤'
}) => {
  const { profile, loading, error, refreshProfile } = useProfile()
  const { user } = useAuth()
  const fadeAnim = useRef(new Animated.Value(0)).current

  // Use real data if available, fallback to props, then defaults
  const displayName = name || profile?.full_name || user?.email?.split('@')[0] || 'User'
  const displayEmail = email || profile?.email || user?.email || 'user@email.com'

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      fadeAnim.setValue(0)
    }
  }, [loading, fadeAnim])

  if (loading) {
    return (
      <Animated.View 
        style={[styles.card, { opacity: fadeAnim }]}
        accessible={true}
        accessibilityLabel="Profile card loading"
        accessibilityHint="Profile information is being loaded"
      >
        <View style={styles.avatarContainer}>
          <View style={styles.skeletonAvatar} />
        </View>
        <View style={styles.skeletonName} />
        <View style={styles.skeletonEmail} />
      </Animated.View>
    )
  }

  if (error) {
    return (
      <Animated.View 
        style={[styles.card, { opacity: fadeAnim }]}
        accessible={true}
        accessibilityLabel="Profile card error"
        accessibilityHint="There was an error loading the profile"
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>⚠️</Text>
        </View>
        <Text style={styles.name}>Error Loading Profile</Text>
        <Text style={styles.email}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={refreshProfile}
          accessible={true}
          accessibilityLabel="Retry loading profile"
          accessibilityHint="Tap to retry loading profile information"
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  return (
    <Animated.View 
      style={[styles.card, { opacity: fadeAnim }]}
      accessible={true}
      accessibilityLabel={`Profile for ${displayName}`}
      accessibilityHint="User profile information"
    >
      <View 
        style={styles.avatarContainer}
        accessible={true}
        accessibilityLabel="Profile avatar"
      >
        <Text style={styles.avatar}>{avatar}</Text>
      </View>
      
      <Text 
        style={styles.name}
        accessible={true}
        accessibilityLabel={`Name: ${displayName}`}
      >
        {displayName}
      </Text>
      <Text 
        style={styles.email}
        accessible={true}
        accessibilityLabel={`Email: ${displayEmail}`}
      >
        {displayEmail}
      </Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    fontSize: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666666',
  },
  // Skeleton styles
  skeletonAvatar: {
    backgroundColor: '#E5E5EA',
    borderRadius: 40,
  },
  skeletonName: {
    width: 120,
    height: 24,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonEmail: {
    width: 160,
    height: 16,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
  },
  // Error state styles
  retryButton: {
    marginTop: 12,
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
}) 