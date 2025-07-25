// Global type definitions for MealAdvisor

declare global {
  interface Window {
    __DEV__: boolean
  }
}

// Environment variables
declare module '@env' {
  export const EXPO_PUBLIC_SUPABASE_URL: string
  export const EXPO_PUBLIC_SUPABASE_ANON_KEY: string
  export const EXPO_PUBLIC_DEEPSEEK_API_KEY: string
  export const EXPO_PUBLIC_DEEPSEEK_MODEL: string
  export const EXPO_PUBLIC_GEMINI_API_KEY: string
  export const EXPO_PUBLIC_APP_ENV: string
  export const EXPO_PUBLIC_APP_VERSION: string
}

// React Native specific types
declare module '*.svg' {
  import { SvgProps } from 'react-native-svg'
  const content: React.FC<SvgProps>
  export default content
}

declare module '*.png' {
  const content: number
  export default content
}

declare module '*.jpg' {
  const content: number
  export default content
}

declare module '*.jpeg' {
  const content: number
  export default content
}

declare module '*.gif' {
  const content: number
  export default content
}

declare module '*.webp' {
  const content: number
  export default content
}

// Expo specific types
declare module 'expo-constants' {
  export interface AppConfig {
    name: string
    slug: string
    version: string
    orientation: string
    icon: string
    splash: {
      image: string
      backgroundColor: string
    }
    updates: {
      fallbackToCacheTimeout: number
    }
    assetBundlePatterns: string[]
  }
}

declare module 'structured-clone' {
  function structuredClone<T>(value: T): T;
  export default structuredClone;
}

export { }
