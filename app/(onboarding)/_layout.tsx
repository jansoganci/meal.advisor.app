import { Stack } from 'expo-router'
import React from 'react'

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'card',
        gestureEnabled: false, // Disable swipe-to-go-back during onboarding
      }}
    >
      <Stack.Screen name="step1" />
      <Stack.Screen name="step2" />
      <Stack.Screen name="step3" />
      <Stack.Screen name="step4" />
    </Stack>
  )
}