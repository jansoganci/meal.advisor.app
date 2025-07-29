import { AppSettingsCard, PersonalInfoCard, ProfileCard, StatsCard } from '@/components/profile'
import { ErrorBoundary } from '@/components/profile/ErrorBoundary'
import { Colors } from '@/constants/Colors'
import { useProfile } from '@/contexts/ProfileContext'
import React, { useCallback, useEffect } from 'react'
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ProfileScreen() {
  const { refreshProfile, loading } = useProfile()

  // Analytics tracking
  useEffect(() => {
    // Track profile screen view
    console.log('📊 Analytics: Profile screen viewed')
    // In a real app, you'd send this to your analytics service
    // analytics.track('Profile Screen Viewed')
  }, [])

  const onRefresh = useCallback(async () => {
    console.log('📊 Analytics: Profile refresh triggered')
    // analytics.track('Profile Refresh')
    await refreshProfile()
  }, [refreshProfile])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.light.background }]}>
      <ErrorBoundary>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              tintColor={Colors.light.tint}
              colors={[Colors.light.tint]}
            />
          }
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: Colors.light.text }]}>👤 Profile</Text>
          </View>

          <View style={styles.content}>
            <ProfileCard />
            <StatsCard />
            <PersonalInfoCard />
            <AppSettingsCard />
          </View>
        </ScrollView>
      </ErrorBoundary>
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
    paddingBottom: 60, // Increased from 24 to 40 to add space from tab bar
    gap: 20,
  },
})