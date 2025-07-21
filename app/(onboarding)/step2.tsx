import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { OnboardingContainer } from '@/components/onboarding/OnboardingContainer'
import { OnboardingButtons } from '@/components/onboarding/OnboardingButtons'
import { HeightPicker } from '@/components/onboarding/HeightPicker'
import { WeightPicker } from '@/components/onboarding/WeightPicker'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { OnboardingStep2Data } from '@/types/onboarding'

export default function OnboardingStep2() {
  const { step2Data, setStep2Data, setCurrentStep } = useOnboarding()
  
  const [formData, setFormData] = useState<OnboardingStep2Data>({
    height: step2Data?.height || 0,
    weight: step2Data?.weight || 0,
  })

  useEffect(() => {
    setCurrentStep(2)
  }, [setCurrentStep])

  const handleHeightChange = (height: number) => {
    setFormData(prev => ({ ...prev, height }))
  }

  const handleWeightChange = (weight: number) => {
    setFormData(prev => ({ ...prev, weight }))
  }

  const handleNext = () => {
    if (formData.height > 0 && formData.weight > 0) {
      setStep2Data(formData)
      router.push('/(onboarding)/step3')
    }
  }

  const handleBack = () => {
    router.back()
  }

  const handleSkip = () => {
    // Skip to main app with incomplete profile
    router.replace('/(tabs)')
  }

  const isFormValid = formData.height > 0 && formData.weight > 0

  return (
    <OnboardingContainer
      step={2}
      totalSteps={4}
      title="📏 Your measurements"
      subtitle="This helps us calculate your nutrition needs"
    >
      <View style={styles.content}>
        <HeightPicker value={formData.height} onValueChange={handleHeightChange} />
        <WeightPicker value={formData.weight} onValueChange={handleWeightChange} />
      </View>

      <OnboardingButtons
        onBack={handleBack}
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