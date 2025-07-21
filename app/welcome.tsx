import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { router } from 'expo-router'
import React from 'react'
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function WelcomeScreen() {
  const colorScheme = useColorScheme()
  const colors = Colors.light

  const handleGetStarted = () => {
    router.push('/(onboarding)/step1')
  }

  const handleSignIn = () => {
    // TODO: Navigate to sign in screen
    router.push('/(tabs)')
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🍽️</Text>
        <Text style={[styles.title, { color: colors.text }]}>MealAdvisor</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          AI-powered meal planning made simple
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.tint }]}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Continue with Google 🔵</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.tabIconDefault }]}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
              Continue with Email ⚪
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={handleSignIn} style={styles.signInLink}>
          <Text style={[styles.signInText, { color: colors.text }]}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 64,
    opacity: 0.7,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  signInLink: {
    marginTop: 32,
    paddingVertical: 12,
  },
  signInText: {
    fontSize: 16,
    opacity: 0.7,
  },
})