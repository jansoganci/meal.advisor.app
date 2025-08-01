import { DailyNutritionService, type DailyNutrition } from '@/lib/daily-nutrition'
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
  const [dailyNutrition, setDailyNutrition] = useState<DailyNutrition | null>(null)
  const [loading, setLoading] = useState(true) // Start with true to prevent premature routing
  const [error, setError] = useState<string | null>(null)

  // Load profile when user changes
  useEffect(() => {
    if (user) {
      console.log('👤 User detected, loading profile for:', user.email)
      refreshProfile()
    } else {
      console.log('❌ No user, clearing profile state')
      setProfile(null)
      setLoading(false) // No user means no profile to load
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

    console.log('🔄 Starting profile refresh for user:', user.id)
    setLoading(true)
    setError(null)

    try {
      const result = await ProfileService.getProfile(user.id)
      
      console.log('👤 Profile Debug:', {
        userId: user.id,
        serviceCallSuccess: result.success,
        profileExists: !!result.data,
        onboardingComplete: result.data?.onboarding_completed,
        profileError: result.error
      })
      
      if (result.success && result.data) {
        console.log('✅ Profile loaded successfully:', result.data.onboarding_completed ? 'onboarding complete' : 'onboarding incomplete')
        setProfile(result.data)
        
        // Load daily nutrition after profile is loaded
        await refreshDailyNutrition()
        
        setLoading(false)
        return true
      } else {
        // Profile doesn't exist yet - this is normal for new users
        console.log('⚠️ No profile found for user (normal for new users)')
        setProfile(null)
        
        // Still load default daily nutrition
        await refreshDailyNutrition()
        
        setLoading(false)
        return false
      }
    } catch (err) {
      console.error('❌ Error loading profile:', err)
      setError('An unexpected error occurred')
      setLoading(false)
      return false
    }
  }

  const refreshDailyNutrition = async (): Promise<void> => {
    if (!user) {
      console.log('❌ No user, cannot refresh daily nutrition')
      return
    }

    try {
      console.log('🍽️ Refreshing daily nutrition for user:', user.id)
      const result = await DailyNutritionService.getDailyNutrition(user.id)
      
      if (result.success && result.data) {
        console.log('✅ Daily nutrition loaded successfully')
        setDailyNutrition(result.data)
      } else {
        console.log('⚠️ Using default nutrition values:', result.error)
        setDailyNutrition(DailyNutritionService.getDefaultNutrition())
      }
    } catch (err) {
      console.error('❌ Error loading daily nutrition:', err)
      setDailyNutrition(DailyNutritionService.getDefaultNutrition())
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value: ProfileContextType = {
    profile,
    loading,
    error,
    dailyNutrition,
    createProfile,
    updateProfile,
    refreshProfile,
    refreshDailyNutrition,
    clearError,
  }

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}