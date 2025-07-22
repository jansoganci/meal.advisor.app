import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'

// Environment variable validation
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('EXPO_PUBLIC_SUPABASE_URL is required. Please add it to your .env file.')
}

if (!supabaseAnonKey) {
  throw new Error('EXPO_PUBLIC_SUPABASE_ANON_KEY is required. Please add it to your .env file.')
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  throw new Error('EXPO_PUBLIC_SUPABASE_URL must be a valid URL.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Add logging at the end of the file
console.log('🔗 Supabase client initialized:', {
  url: supabaseUrl?.substring(0, 30) + '...',
  hasAnonKey: !!supabaseAnonKey,
  hasUrl: !!supabaseUrl,
  client: !!supabase
})

// Test connection on startup
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1)
    if (error) {
      console.error('❌ Supabase connection test failed:', error)
    } else {
      console.log('✅ Supabase connection test successful')
    }
  } catch (err) {
    console.error('❌ Supabase connection test error:', err)
  }
}

testConnection()