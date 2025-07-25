import { ActivityLevelSlider } from '@/components/onboarding/ActivityLevelSlider'
import { GoalSelection } from '@/components/onboarding/GoalSelection'
import { OnboardingButtons } from '@/components/onboarding/OnboardingButtons'
import { OnboardingContainer } from '@/components/onboarding/OnboardingContainer'
import { useAuth } from '@/contexts/AuthContext'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { useProfile } from '@/contexts/ProfileContext'
import { OnboardingStep4Data } from '@/types/onboarding'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet } from 'react-native'

export default function OnboardingStep4() {
  const { user } = useAuth()
  const { step4Data, setStep4Data, setCurrentStep, step1Data, step2Data, step3Data } = useOnboarding()
  const { createProfile } = useProfile()
  
  const [formData, setFormData] = useState<OnboardingStep4Data>({
    activity_level: step4Data?.activity_level || ('') as any,
    primary_goal: step4Data?.primary_goal || ('') as any,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  // Authentication checking is handled directly via user prop

  useEffect(() => {
    setCurrentStep(4)
    
    const checkAuthentication = async () => {
      // Verify user is authenticated
      console.log('🔐 Step 4: Authentication check:', {
        userExists: !!user,
        userId: user?.id,
        userEmail: user?.email
      })
      
      if (!user) {
        console.log('⏳ Step 4: No user object, waiting for authentication...')
        // User not authenticated
        
        if (!user) {
          console.error('❌ Step 4: User not authenticated, redirecting to welcome')
          Alert.alert('Authentication Required', 'Please sign in to complete your profile setup.', [
            { text: 'OK', onPress: () => router.replace('/login') }
          ])
        } else {
          console.log('✅ Step 4: User authentication confirmed')
        }
        
        // Auth check complete
      }
    }

    checkAuthentication()
  }, [setCurrentStep, user])

  const handleActivityLevelChange = (level: string) => {
    setFormData(prev => ({ ...prev, activity_level: level as any }))
  }

  const handleGoalChange = (goal: string) => {
    setFormData(prev => ({ ...prev, primary_goal: goal as any }))
  }

  const handleComplete = async () => {
    // Additional auth check before profile creation
    if (!user) {
      console.error('❌ Step 4: No authenticated user during profile creation')
      Alert.alert('Authentication Required', 'Please sign in to create your profile.', [
        { text: 'OK', onPress: () => router.replace('/welcome') }
      ])
      return
    }

    if (!step1Data || !step2Data || !step3Data || !formData.activity_level || !formData.primary_goal) {
      Alert.alert('Error', 'Please complete all steps before proceeding')
      return
    }

    setIsSubmitting(true)
    setStep4Data(formData)

    try {
      // Combine all onboarding data
      const profileData = {
        ...step1Data,
        ...step2Data,
        ...step3Data,
        ...formData,
        language: 'en', // Default language
      }

      console.log('🎯 Step 4: Starting profile creation with data:', profileData)
      console.log('🔐 Step 4: User authentication status:', {
        userExists: !!user,
        userId: user?.id,
        userEmail: user?.email
      })
      
      const success = await createProfile(profileData)
      console.log('🎯 Step 4: Profile creation result:', success)

      if (success) {
        console.log('🎉 Profile created successfully, navigating to main app')
        // Navigate to main app
        router.replace('/(tabs)')
      } else {
        console.error('❌ Step 4: Profile creation failed')
        Alert.alert('Error', 'Failed to create profile. Please try again.')
      }
    } catch (error) {
      console.error('❌ Step 4: Unexpected error during profile creation:', error)
      Alert.alert('Error', 'An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    router.back()
  }

  const handleSkip = () => {
    // Skip to main app with incomplete profile
    router.replace('/(tabs)')
  }

  const isFormValid = formData.activity_level && formData.primary_goal

  return (
    <OnboardingContainer
      step={4}
      totalSteps={4}
      title="🎯 Your goals & lifestyle"
      subtitle="This helps us create the perfect meal plan for you"
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ActivityLevelSlider
          value={formData.activity_level}
          onValueChange={handleActivityLevelChange}
        />

        <GoalSelection
          value={formData.primary_goal}
          onValueChange={handleGoalChange}
        />
      </ScrollView>

      <OnboardingButtons
        onBack={handleBack}
        onNext={handleComplete}
        onSkip={handleSkip}
        nextDisabled={!isFormValid || isSubmitting}
        nextText={isSubmitting ? 'Creating Profile...' : 'Complete Setup 🎉'}
        showSkip={true}
      />
    </OnboardingContainer>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingVertical: 20,
  },
})