import { supabase } from './supabase'
import { AuthError, AuthResponse } from '@supabase/supabase-js'

export interface AuthResult {
  success: boolean
  error?: string
  data?: any
}

export class AuthService {
  // Email and password authentication
  static async signUpWithEmail(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  static async signInWithEmail(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Google OAuth authentication
  static async signInWithGoogle(): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'com.mealadvisor://auth/callback',
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Sign out
  static async signOut(): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Password reset
  static async resetPassword(email: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'com.mealadvisor://auth/reset-password',
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data: user }
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Get current session
  static async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data: session }
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }
}