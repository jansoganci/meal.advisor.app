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
    if (authLoading || profileLoading) return

    if (!user) {
      // No user, redirect to login
      router.replace('/login')
    } else if (!profile) {
      // User exists but no profile - redirect to onboarding
      router.replace('/(onboarding)/step1')
    }
    // If user and profile both exist, AuthContext handles navigation in signIn/signUp methods
  }, [user, profile, authLoading, profileLoading])

  // Show nothing while loading or redirecting
  return <View />
}