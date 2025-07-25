import { supabase } from '@/lib/supabase'
import { router } from 'expo-router'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper function to create user profile in database
  const createUserProfile = async (userId: string, email: string) => {
    try {
      const { error: userCreationError } = await supabase
        .from('users')
        .upsert({
          id: userId,
          email: email,
          preferred_language: 'en',
          timezone: 'UTC',
          notifications_enabled: true,
          onboarding_completed: false
        }, {
          onConflict: 'id'
        })

      if (userCreationError) {
        console.warn('User profile creation failed:', userCreationError.message)
      } else {
        console.log('User profile created successfully')
      }
    } catch (err) {
      console.error('Error creating user profile:', err)
    }
  }

  useEffect(() => {
    // Check for existing session on app start
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!
          })
          
          // Check if user has a profile
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('id, onboarding_completed')
            .eq('id', session.user.id)
            .single()
          
          if (profileError || !profile) {
            // User doesn't have a profile, will be handled by index.tsx
            console.log('User authenticated but no profile found')
          } else if (!profile.onboarding_completed) {
            // User has profile but onboarding not completed, will be handled by index.tsx
            console.log('User authenticated but onboarding not completed')
          } else {
            // User has completed profile
            console.log('User authenticated with completed profile')
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const userId = session.user.id
          const email = session.user.email!
          
          // Create user profile in database when user is authenticated
          await createUserProfile(userId, email)
          
          setUser({
            id: userId,
            email: email
          })
          
          // Check if user has a profile after creation attempt
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('id, onboarding_completed')
            .eq('id', userId)
            .single()
          
          if (profileError || !profile || !profile.onboarding_completed) {
            // User doesn't have a profile or onboarding not completed
            console.log('User signed in but needs onboarding')
          } else {
            console.log('User signed in with completed profile')
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email!
        })
        
        // Check if user has a profile before navigating
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('id, onboarding_completed')
          .eq('id', data.user.id)
          .single()
        
        if (profileError || !profile) {
          // User doesn't have a profile, redirect to onboarding
          router.replace('/(onboarding)/step1')
        } else if (!profile.onboarding_completed) {
          // User has profile but onboarding not completed
          router.replace('/(onboarding)/step1')
        } else {
          // User has completed profile, navigate to main app
          router.replace('/(tabs)')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Sign in failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Don't create user profile here - wait for auth state change
        // If email confirmation is required, profile will be created when user signs in
        // If autoconfirm is enabled, profile will be created immediately via auth state change
        setUser({
          id: data.user.id,
          email: data.user.email!
        })
        
        // Check if email confirmation is required
        if (data.session) {
          // User is immediately authenticated (autoconfirm enabled)
          router.replace('/(onboarding)/step1')
        } else {
          // Email confirmation required - user will be redirected after confirming email
          // The auth state change listener will handle profile creation when they sign in
          router.replace('/login')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Sign up failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      router.replace('/login')
    } catch (err: any) {
      setError(err.message || 'Sign out failed')
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
    } catch (err: any) {
      setError(err.message || 'Password reset failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    clearError,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}