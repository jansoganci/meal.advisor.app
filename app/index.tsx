import { useEffect } from 'react'
import { router } from 'expo-router'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/contexts/ProfileContext'

export default function Index() {
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useProfile()

  useEffect(() => {
    if (authLoading || profileLoading) return

    if (!user) {
      // Not authenticated, go to welcome
      router.replace('/welcome')
    } else if (!profile) {
      // Authenticated but no profile, go to onboarding
      router.replace('/(onboarding)/step1')
    } else {
      // Authenticated with profile, go to main app
      router.replace('/(tabs)')
    }
  }, [user, profile, authLoading, profileLoading])

  return null
}