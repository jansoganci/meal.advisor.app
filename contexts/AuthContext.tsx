import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContextType, AuthState, SignUpData, SignInData, User } from '@/types/auth'
import { AuthService } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

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
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    // Check for existing session on app start
    const initializeAuth = async () => {
      try {
        const sessionResult = await AuthService.getCurrentSession()
        if (sessionResult.success && sessionResult.data) {
          const userResult = await AuthService.getCurrentUser()
          if (userResult.success && userResult.data) {
            setAuthState(prev => ({
              ...prev,
              user: userResult.data,
              session: sessionResult.data,
              loading: false,
            }))
          } else {
            setAuthState(prev => ({ ...prev, loading: false }))
          }
        } else {
          setAuthState(prev => ({ ...prev, loading: false }))
        }
      } catch (error) {
        setAuthState(prev => ({
          ...prev,
          error: 'Failed to initialize authentication',
          loading: false,
        }))
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setAuthState(prev => ({
            ...prev,
            user: session.user as User,
            session,
            loading: false,
            error: null,
          }))
        } else if (event === 'SIGNED_OUT') {
          setAuthState(prev => ({
            ...prev,
            user: null,
            session: null,
            loading: false,
            error: null,
          }))
        } else if (event === 'TOKEN_REFRESHED' && session) {
          setAuthState(prev => ({
            ...prev,
            session,
          }))
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (data: SignUpData): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const result = await AuthService.signUpWithEmail(data.email, data.password)
    
    if (result.success) {
      setAuthState(prev => ({ ...prev, loading: false }))
      return true
    } else {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: result.error || 'Sign up failed',
      }))
      return false
    }
  }

  const signIn = async (data: SignInData): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const result = await AuthService.signInWithEmail(data.email, data.password)
    
    if (result.success) {
      setAuthState(prev => ({ ...prev, loading: false }))
      return true
    } else {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: result.error || 'Sign in failed',
      }))
      return false
    }
  }

  const signInWithGoogle = async (): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const result = await AuthService.signInWithGoogle()
    
    if (result.success) {
      setAuthState(prev => ({ ...prev, loading: false }))
      return true
    } else {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: result.error || 'Google sign in failed',
      }))
      return false
    }
  }

  const signOut = async (): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const result = await AuthService.signOut()
    
    if (result.success) {
      setAuthState(prev => ({
        ...prev,
        user: null,
        session: null,
        loading: false,
      }))
      return true
    } else {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: result.error || 'Sign out failed',
      }))
      return false
    }
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const result = await AuthService.resetPassword(email)
    
    if (result.success) {
      setAuthState(prev => ({ ...prev, loading: false }))
      return true
    } else {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: result.error || 'Password reset failed',
      }))
      return false
    }
  }

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }))
  }

  const value: AuthContextType = {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    error: authState.error,
    signUp,
    signIn,
    signInWithGoogle,
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