import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'

interface OnboardingButtonsProps {
  onBack?: () => void
  onNext: () => void
  onSkip?: () => void
  nextDisabled?: boolean
  nextText?: string
  showSkip?: boolean
  skipText?: string
}

export const OnboardingButtons: React.FC<OnboardingButtonsProps> = ({
  onBack,
  onNext,
  onSkip,
  nextDisabled = false,
  nextText = 'Next',
  showSkip = false,
  skipText = 'Complete later',
}) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  return (
    <View style={styles.container}>
      {showSkip && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={onSkip}
          activeOpacity={0.7}
        >
          <Text style={[styles.skipText, { color: colors.text }]}>
            {skipText}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.buttonContainer}>
        {onBack && (
          <TouchableOpacity
            style={[styles.backButton, { borderColor: colors.tabIconDefault }]}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={[styles.backText, { color: colors.text }]}>
              ← Back
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: nextDisabled ? colors.tabIconDefault : colors.tint },
            !onBack && styles.nextButtonFull,
          ]}
          onPress={onNext}
          disabled={nextDisabled}
          activeOpacity={0.7}
        >
          <Text style={[styles.nextText, { color: '#fff' }]}>
            {nextText} →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 20,
  },
  skipText: {
    fontSize: 16,
    opacity: 0.7,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonFull: {
    flex: 2,
  },
  nextText: {
    fontSize: 16,
    fontWeight: '600',
  },
})