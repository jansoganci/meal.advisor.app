import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { OnboardingContainer } from '@/components/onboarding/OnboardingContainer'
import { OnboardingButtons } from '@/components/onboarding/OnboardingButtons'
import { AgePicker } from '@/components/onboarding/AgePicker'
import { GenderPicker } from '@/components/onboarding/GenderPicker'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { OnboardingStep1Data } from '@/types/onboarding'

export default function OnboardingStep1() {
  const { step1Data, setStep1Data, setCurrentStep } = useOnboarding()
  
  const [formData, setFormData] = useState<OnboardingStep1Data>({
    age: step1Data?.age || 0,
    gender: step1Data?.gender || ('') as any,
  })

  useEffect(() => {
    setCurrentStep(1)
  }, [setCurrentStep])

  const handleAgeChange = (age: number) => {
    setFormData(prev => ({ ...prev, age }))
  }

  const handleGenderChange = (gender: 'male' | 'female' | 'other') => {
    setFormData(prev => ({ ...prev, gender }))
  }

  const handleNext = () => {
    if (formData.age > 0 && formData.gender) {
      setStep1Data(formData)
      router.push('/(onboarding)/step2')
    }
  }

  const handleSkip = () => {
    // Skip to main app with incomplete profile
    router.replace('/(tabs)')
  }

  const isFormValid = formData.age > 0 && formData.gender

  return (
    <OnboardingContainer
      step={1}
      totalSteps={4}
      title="👤 Tell us about yourself"
      subtitle="This helps us create personalized meal plans"
    >
      <View style={styles.content}>
        <AgePicker value={formData.age} onValueChange={handleAgeChange} />
        <GenderPicker value={formData.gender} onValueChange={handleGenderChange} />
      </View>

      <OnboardingButtons
        onNext={handleNext}
        onSkip={handleSkip}
        nextDisabled={!isFormValid}
        showSkip={true}
      />
    </OnboardingContainer>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
  },
})