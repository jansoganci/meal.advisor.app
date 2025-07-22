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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const { resetPassword, loading, error, clearError } = useAuth()
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address')
      return
    }

    try {
      await resetPassword(email)
      setEmailSent(true)
    } catch (err) {
      // Error is handled in AuthContext
    }
  }

  const handleBackToLogin = () => {
    router.push('/login')
  }

  if (emailSent) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ThemedView style={styles.content}>
          {/* Success State */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: colors.success + '20' }]}>
              <ThemedText style={[styles.icon, { color: colors.success }]}>
                ✉️
              </ThemedText>
            </View>
            <ThemedText type="title" style={styles.title}>
              Email Sent
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
              We've sent a password reset link to:
            </ThemedText>
            <ThemedText style={[styles.emailText, { color: colors.primary }]}>
              {email}
            </ThemedText>
          </View>

          <View style={styles.messageContainer}>
            <ThemedText style={[styles.message, { color: colors.textSecondary }]}>
              Please check your email and follow the instructions to reset your password. 
              The link will expire in 24 hours.
            </ThemedText>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              onPress={handleBackToLogin}
              fullWidth
            >
              Back to Login
            </Button>
          </View>
        </ThemedView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <ThemedText style={[styles.icon, { color: colors.primary }]}>
              🔒
            </ThemedText>
          </View>
          <ThemedText type="title" style={styles.title}>
            Reset Password
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter your email address and we'll send you a link to reset your password
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

          {error && (
            <View style={styles.errorContainer}>
              <ThemedText style={[styles.errorText, { color: colors.error }]}>
                {error}
              </ThemedText>
            </View>
          )}

          <Button
            onPress={handleResetPassword}
            loading={loading}
            disabled={loading}
            fullWidth
            style={styles.resetButton}
          >
            Reset Password
          </Button>
        </View>

        {/* Link */}
        <View style={styles.links}>
          <TouchableOpacity onPress={handleBackToLogin} style={styles.linkButton}>
            <ThemedText type="link" style={styles.linkText}>
              Back to Login
            </ThemedText>
          </TouchableOpacity>
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
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 36,
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
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  messageContainer: {
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
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
  resetButton: {
    marginTop: 8,
  },
  buttonContainer: {
    // For success state
  },
  links: {
    alignItems: 'center',
  },
  linkButton: {
    padding: 4,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '500',
  },
}) 