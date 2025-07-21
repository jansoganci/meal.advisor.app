export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_in: number
  user: User
}

export interface AuthState {
  user: User | null
  session: AuthSession | null
  loading: boolean
  error: string | null
}

export interface SignUpData {
  email: string
  password: string
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthContextType {
  user: User | null
  session: AuthSession | null
  loading: boolean
  error: string | null
  signUp: (data: SignUpData) => Promise<boolean>
  signIn: (data: SignInData) => Promise<boolean>
  signInWithGoogle: () => Promise<boolean>
  signOut: () => Promise<boolean>
  resetPassword: (email: string) => Promise<boolean>
  clearError: () => void
}