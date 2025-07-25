import { HeightPicker } from '@/components/onboarding/HeightPicker'
import { OnboardingButtons } from '@/components/onboarding/OnboardingButtons'
import { OnboardingContainer } from '@/components/onboarding/OnboardingContainer'
import { WeightPicker } from '@/components/onboarding/WeightPicker'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { OnboardingStep2Data } from '@/types/onboarding'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

export default function OnboardingStep2() {
  const { step2Data, setStep2Data, setCurrentStep } = useOnboarding()
  
  const [formData, setFormData] = useState<OnboardingStep2Data>({
    height_cm: step2Data?.height_cm || 0,
    weight_kg: step2Data?.weight_kg || 0,
  })

  useEffect(() => {
    setCurrentStep(2)
  }, [setCurrentStep])

  const handleHeightChange = (height_cm: number) => {
    setFormData(prev => ({ ...prev, height_cm }))
  }

  const handleWeightChange = (weight_kg: number) => {
    setFormData(prev => ({ ...prev, weight_kg }))
  }

  const handleNext = () => {
    if (formData.height_cm > 0 && formData.weight_kg > 0) {
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

  const isFormValid = formData.height_cm > 0 && formData.weight_kg > 0

  return (
    <OnboardingContainer
      step={2}
      totalSteps={4}
      title="📏 Your measurements"
      subtitle="This helps us calculate your nutrition needs"
    >
      <View style={styles.content}>
        <HeightPicker value={formData.height_cm} onValueChange={handleHeightChange} />
        <WeightPicker value={formData.weight_kg} onValueChange={handleWeightChange} />
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