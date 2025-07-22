import { CheckboxList } from '@/components/onboarding/CheckboxList'
import { OnboardingButtons } from '@/components/onboarding/OnboardingButtons'
import { OnboardingContainer } from '@/components/onboarding/OnboardingContainer'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { ALLERGY_OPTIONS, CHRONIC_ILLNESS_OPTIONS, OnboardingStep3Data } from '@/types/onboarding'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

export default function OnboardingStep3() {
  const { step3Data, setStep3Data, setCurrentStep } = useOnboarding()
  
  const [formData, setFormData] = useState<OnboardingStep3Data>({
    allergies: step3Data?.allergies || [],
    chronic_illnesses: step3Data?.chronic_illnesses || [],
  })

  useEffect(() => {
    setCurrentStep(3)
  }, [setCurrentStep])

  const handleAllergyToggle = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy],
    }))
  }

  const handleChronicIllnessToggle = (illness: string) => {
    if (illness === 'none') {
      // If "none" is selected, clear all other selections
      setFormData(prev => ({
        ...prev,
        chronic_illnesses: prev.chronic_illnesses.includes('none') ? [] : ['none'],
      }))
    } else {
      // If any other illness is selected, remove "none"
      setFormData(prev => ({
        ...prev,
        chronic_illnesses: prev.chronic_illnesses.includes(illness)
          ? prev.chronic_illnesses.filter(i => i !== illness)
          : [...prev.chronic_illnesses.filter(i => i !== 'none'), illness],
      }))
    }
  }

  const handleNext = () => {
    setStep3Data(formData)
    router.push('/(onboarding)/step4')
  }

  const handleBack = () => {
    router.back()
  }

  const handleSkip = () => {
    // Skip to main app with incomplete profile
    router.replace('/(tabs)')
  }

  return (
    <OnboardingContainer
      step={3}
      totalSteps={4}
      title="🏥 Health considerations"
      subtitle="This helps us ensure your meals are safe and suitable"
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <CheckboxList
          title="⚠️ Allergies"
          options={ALLERGY_OPTIONS}
          selectedOptions={formData.allergies}
          onOptionToggle={handleAllergyToggle}
          multiSelect={true}
        />

        <CheckboxList
          title="🩺 Chronic illnesses"
          options={CHRONIC_ILLNESS_OPTIONS}
          selectedOptions={formData.chronic_illnesses}
          onOptionToggle={handleChronicIllnessToggle}
          multiSelect={true}
        />
      </ScrollView>

      <OnboardingButtons
        onBack={handleBack}
        onNext={handleNext}
        onSkip={handleSkip}
        nextDisabled={false}
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