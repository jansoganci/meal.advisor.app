import React, { createContext, useContext, useState } from 'react'
import {
  OnboardingContextType,
  OnboardingStep1Data,
  OnboardingStep2Data,
  OnboardingStep3Data,
  OnboardingStep4Data,
} from '@/types/onboarding'

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}

interface OnboardingProviderProps {
  children: React.ReactNode
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [step1Data, setStep1Data] = useState<OnboardingStep1Data | null>(null)
  const [step2Data, setStep2Data] = useState<OnboardingStep2Data | null>(null)
  const [step3Data, setStep3Data] = useState<OnboardingStep3Data | null>(null)
  const [step4Data, setStep4Data] = useState<OnboardingStep4Data | null>(null)
  const [currentStep, setCurrentStep] = useState(1)

  const resetOnboarding = () => {
    setStep1Data(null)
    setStep2Data(null)
    setStep3Data(null)
    setStep4Data(null)
    setCurrentStep(1)
  }

  const isComplete = !!(step1Data && step2Data && step3Data && step4Data)

  const value: OnboardingContextType = {
    step1Data,
    step2Data,
    step3Data,
    step4Data,
    currentStep,
    setStep1Data,
    setStep2Data,
    setStep3Data,
    setStep4Data,
    setCurrentStep,
    resetOnboarding,
    isComplete,
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}