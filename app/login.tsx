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

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, signInWithGoogle, loading, error, clearError } = useAuth()
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password')
      return
    }

    try {
      await signIn(email, password)
      // Navigation is handled in AuthContext
    } catch (err) {
      // Error is handled in AuthContext
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      // Navigation is handled in AuthContext
    } catch (err) {
      // Error is handled in AuthContext
    }
  }

  const handleForgotPassword = () => {
    router.push('/forgot-password')
  }

  const handleSignUpPress = () => {
    router.push('/signup')
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Welcome Back
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign in to your account
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
            autoComplete="password"
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
            onPress={handleSignIn}
            loading={loading}
            disabled={loading}
            fullWidth
            style={styles.signInButton}
          >
            Sign In
          </Button>

          {/* OR Divider */}
          <View style={styles.orContainer}>
            <View style={[styles.orLine, { backgroundColor: colors.border }]} />
            <ThemedText style={[styles.orText, { color: colors.textSecondary }]}>
              or
            </ThemedText>
            <View style={[styles.orLine, { backgroundColor: colors.border }]} />
          </View>

          {/* Google Sign In Button */}
          <Button
            onPress={handleGoogleSignIn}
            loading={loading}
            disabled={loading}
            fullWidth
            variant="outline"
            style={styles.googleButton}
          >
            Continue with Google
          </Button>
        </View>

        {/* Links */}
        <View style={styles.links}>
          <TouchableOpacity onPress={handleForgotPassword} style={styles.linkButton}>
            <ThemedText type="link" style={styles.linkText}>
              Forgot Password?
            </ThemedText>
          </TouchableOpacity>
          
          <View style={styles.signUpContainer}>
            <ThemedText style={[styles.signUpText, { color: colors.textSecondary }]}>
              Don't have an account?{' '}
            </ThemedText>
            <TouchableOpacity onPress={handleSignUpPress}>
              <ThemedText type="link" style={styles.linkText}>
                Sign up
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
  signInButton: {
    marginTop: 8,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 24,
  },
  orLine: {
    flex: 1,
    height: 1,
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  googleButton: {
    marginTop: 16,
  },
  links: {
    alignItems: 'center',
    gap: 24,
  },
  linkButton: {
    padding: 4,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '500',
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpText: {
    fontSize: 16,
    lineHeight: 24,
  },
}) 