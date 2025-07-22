import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Colors } from '@/constants/Colors'
import { useAuth } from '@/contexts/AuthContext'
import { useColorScheme } from '@/hooks/useColorScheme'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SignUpScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { signUp, loading, error, clearError } = useAuth()
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters')
      return
    }

    try {
      await signUp(email, password)
      // Navigation is handled in AuthContext
    } catch (err) {
      // Error is handled in AuthContext
    }
  }

  const handleBackToLogin = () => {
    router.push('/login')
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Create Account
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign up to get started with personalized meal planning
          </ThemedText>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={(text: string) => {
              setEmail(text)
              if (error) clearError()
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={styles.input}
          />
          
          <Input
            placeholder="Password"
            value={password}
            onChangeText={(text: string) => {
              setPassword(text)
              if (error) clearError()
            }}
            secureTextEntry
            autoComplete="new-password"
            style={styles.input}
          />

          <Input
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={(text: string) => {
              setConfirmPassword(text)
              if (error) clearError()
            }}
            secureTextEntry
            autoComplete="new-password"
            style={styles.input}
          />

          {error && (
            <View style={styles.errorContainer}>
              <ThemedText style={[styles.errorText, { color: colors.error }]}>
                {error}
              </ThemedText>
            </View>
          )}

          <Button
            onPress={handleSignUp}
            loading={loading}
            disabled={loading}
            fullWidth
            style={styles.createButton}
          >
            Create Account
          </Button>
        </View>

        {/* Link */}
        <View style={styles.links}>
          <View style={styles.signInContainer}>
            <ThemedText style={[styles.signInText, { color: colors.textSecondary }]}>
              Already have an account?{' '}
            </ThemedText>
            <TouchableOpacity onPress={handleBackToLogin}>
              <ThemedText type="link" style={styles.linkText}>
                Sign in
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
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
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  form: {
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
  },
  errorContainer: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  createButton: {
    marginTop: 8,
  },
  links: {
    alignItems: 'center',
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInText: {
    fontSize: 16,
    lineHeight: 24,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '500',
  },
}) 