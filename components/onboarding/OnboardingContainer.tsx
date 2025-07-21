import React from 'react'
import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'

interface OnboardingContainerProps {
  step: number
  totalSteps: number
  title: string
  subtitle?: string
  children: React.ReactNode
}

export const OnboardingContainer: React.FC<OnboardingContainerProps> = ({
  step,
  totalSteps,
  title,
  subtitle,
  children,
}) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Progress indicators */}
      <View style={styles.progressContainer}>
        <Text style={[styles.stepText, { color: colors.text }]}>
          Step {step} of {totalSteps}
        </Text>
        <View style={styles.progressBar}>
          {Array.from({ length: totalSteps }, (_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                {
                  backgroundColor: index < step ? colors.tint : colors.tabIconDefault,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.text }]}>{subtitle}</Text>
        )}
        {children}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  progressContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  stepText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.7,
  },
})