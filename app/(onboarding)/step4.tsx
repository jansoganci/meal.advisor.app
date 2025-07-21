import React, { useState, useEffect } from 'react'
import { View, ScrollView, StyleSheet, Alert } from 'react-native'
import { router } from 'expo-router'
import { OnboardingContainer } from '@/components/onboarding/OnboardingContainer'
import { OnboardingButtons } from '@/components/onboarding/OnboardingButtons'
import { ActivityLevelSlider } from '@/components/onboarding/ActivityLevelSlider'
import { GoalSelection } from '@/components/onboarding/GoalSelection'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { useProfile } from '@/contexts/ProfileContext'
import { OnboardingStep4Data } from '@/types/onboarding'

export default function OnboardingStep4() {
  const { step4Data, setStep4Data, setCurrentStep, step1Data, step2Data, step3Data } = useOnboarding()
  const { createProfile } = useProfile()
  
  const [formData, setFormData] = useState<OnboardingStep4Data>({
    activity_level: step4Data?.activity_level || ('') as any,
    fitness_goal: step4Data?.fitness_goal || ('') as any,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setCurrentStep(4)
  }, [setCurrentStep])

  const handleActivityLevelChange = (level: string) => {
    setFormData(prev => ({ ...prev, activity_level: level as any }))
  }

  const handleGoalChange = (goal: string) => {
    setFormData(prev => ({ ...prev, fitness_goal: goal as any }))
  }

  const handleComplete = async () => {
    if (!step1Data || !step2Data || !step3Data || !formData.activity_level || !formData.fitness_goal) {
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

      const success = await createProfile(profileData)

      if (success) {
        // Navigate to main app
        router.replace('/(tabs)')
      } else {
        Alert.alert('Error', 'Failed to create profile. Please try again.')
      }
    } catch (error) {
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

  const isFormValid = formData.activity_level && formData.fitness_goal

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
          value={formData.fitness_goal}
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