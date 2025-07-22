import { ProfileService } from '@/lib/profile'
import { OnboardingData, ProfileContextType, UserProfile } from '@/types/profile'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}

interface ProfileProviderProps {
  children: React.ReactNode
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load profile when user changes
  useEffect(() => {
    if (user) {
      refreshProfile()
    } else {
      setProfile(null)
    }
  }, [user])

  const createProfile = async (data: OnboardingData): Promise<boolean> => {
    if (!user) {
      console.error('❌ ProfileContext: No authenticated user found during profile creation')
      setError('Please sign in first to create your profile')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      console.log('🚀 Creating profile for user:', user.id, 'with data:', data)
      const result = await ProfileService.createProfile(user.id, data, user.email)
      
      if (result.success && result.data) {
        console.log('✅ Profile creation successful in context')
        setProfile(result.data)
        setLoading(false)
        return true
      } else {
        console.error('❌ Profile creation failed in context:', result.error)
        setError(result.error || 'Failed to create profile')
        setLoading(false)
        return false
      }
    } catch (err) {
      console.error('❌ Unexpected error in ProfileContext.createProfile:', err)
      setError('An unexpected error occurred')
      setLoading(false)
      return false
    }
  }

  const updateProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    if (!user) {
      setError('No authenticated user')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const result = await ProfileService.updateProfile(user.id, data)
      
      if (result.success && result.data) {
        setProfile(result.data)
        setLoading(false)
        return true
      } else {
        setError(result.error || 'Failed to update profile')
        setLoading(false)
        return false
      }
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(false)
      return false
    }
  }

  const refreshProfile = async (): Promise<boolean> => {
    if (!user) {
      setError('No authenticated user')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const result = await ProfileService.getProfile(user.id)
      
      if (result.success && result.data) {
        setProfile(result.data)
        setLoading(false)
        return true
      } else {
        // Profile doesn't exist yet - this is normal for new users
        setProfile(null)
        setLoading(false)
        return false
      }
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(false)
      return false
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value: ProfileContextType = {
    profile,
    loading,
    error,
    createProfile,
    updateProfile,
    refreshProfile,
    clearError,
  }

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}