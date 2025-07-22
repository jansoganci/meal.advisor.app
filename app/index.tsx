import { useAuth } from '@/contexts/AuthContext'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'

export default function Index() {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    if (!user) {
      // No user, redirect to login
      router.replace('/login')
    }
    // If user exists, AuthContext handles navigation in signIn/signUp methods
  }, [user, loading])

  // Show nothing while loading or redirecting
  return <View />
}