import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/contexts/ProfileContext'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'

export default function Index() {
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useProfile()

  useEffect(() => {
    // Wait for both auth and profile to finish loading
    if (authLoading || profileLoading) {
      console.log('🔄 Loading...', { authLoading, profileLoading, user: !!user, profile: !!profile })
      return
    }

    // Add small delay to prevent race condition between auth and profile state
    const timer = setTimeout(() => {
      console.log('🚀 Routing Decision Debug:', { 
        user: !!user, 
        userId: user?.id,
        userEmail: user?.email,
        profile: !!profile, 
        profileId: profile?.id,
        onboardingComplete: profile?.onboarding_completed,
        authLoading,
        profileLoading,
        timestamp: new Date().toISOString()
      })

      if (!user) {
        // No user, redirect to login
        console.log('➡️ Redirecting to login (no user)')
        router.replace('/login')
      } else if (!profile || !profile.onboarding_completed) {
        // User exists but no profile or onboarding not completed - redirect to onboarding
        console.log('➡️ Redirecting to onboarding (no profile or incomplete onboarding)')
        router.replace('/(onboarding)/step1')
      } else {
        // User and complete profile exist - redirect to main app
        console.log('➡️ Redirecting to main app (user + complete profile)')
        router.replace('/(tabs)')
      }
    }, 100) // 100ms delay to prevent race conditions

    return () => clearTimeout(timer)
  }, [user, profile, authLoading, profileLoading])

  // Show nothing while loading or redirecting
  return <View />
}