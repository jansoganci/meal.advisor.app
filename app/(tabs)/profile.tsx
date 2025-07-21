import { ProfileCard } from '@/components/profile/ProfileCard'
import { SettingsCard } from '@/components/profile/SettingsCard'
import { StatsCard } from '@/components/profile/StatsCard'
import { Colors } from '@/constants/Colors'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/contexts/ProfileContext'
import { useColorScheme } from '@/hooks/useColorScheme'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ProfileScreen() {
  const colorScheme = useColorScheme()
  const colors = Colors.light
  const { user, signOut } = useAuth()
  const { profile, loading } = useProfile()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleEditProfile = () => {
    router.push('/profile/edit')
  }

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setIsSigningOut(true)
            await signOut()
            setIsSigningOut(false)
          },
        },
      ]
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>👤 Profile</Text>
        </View>

        <View style={styles.content}>
          <ProfileCard
            profile={profile}
            user={user}
            onEditPress={handleEditProfile}
          />

          {profile && (
            <StatsCard profile={profile} />
          )}

          <SettingsCard
            profile={profile}
            onSignOut={handleSignOut}
            isSigningOut={isSigningOut}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
})