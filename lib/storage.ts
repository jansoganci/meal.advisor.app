import AsyncStorage from '@react-native-async-storage/async-storage'

export class SecureStorage {
  private static readonly PREFIX = '@MealAdvisor:'
  
  // Store secure data
  static async setItem(key: string, value: string): Promise<boolean> {
    try {
      await AsyncStorage.setItem(this.PREFIX + key, value)
      return true
    } catch (error) {
      console.error('Error storing secure data:', error)
      return false
    }
  }

  // Retrieve secure data
  static async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.PREFIX + key)
    } catch (error) {
      console.error('Error retrieving secure data:', error)
      return null
    }
  }

  // Remove secure data
  static async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(this.PREFIX + key)
      return true
    } catch (error) {
      console.error('Error removing secure data:', error)
      return false
    }
  }

  // Clear all secure data
  static async clearAll(): Promise<boolean> {
    try {
      const keys = await AsyncStorage.getAllKeys()
      const appKeys = keys.filter(key => key.startsWith(this.PREFIX))
      await AsyncStorage.multiRemove(appKeys)
      return true
    } catch (error) {
      console.error('Error clearing secure data:', error)
      return false
    }
  }

  // Store user preferences
  static async setUserPreferences(preferences: Record<string, any>): Promise<boolean> {
    return this.setItem('user_preferences', JSON.stringify(preferences))
  }

  // Get user preferences
  static async getUserPreferences(): Promise<Record<string, any> | null> {
    try {
      const data = await this.getItem('user_preferences')
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error parsing user preferences:', error)
      return null
    }
  }

  // Store onboarding completion status
  static async setOnboardingCompleted(completed: boolean): Promise<boolean> {
    return this.setItem('onboarding_completed', completed.toString())
  }

  // Get onboarding completion status
  static async getOnboardingCompleted(): Promise<boolean> {
    try {
      const data = await this.getItem('onboarding_completed')
      return data === 'true'
    } catch (error) {
      console.error('Error getting onboarding status:', error)
      return false
    }
  }

  // Store last active timestamp
  static async setLastActive(): Promise<boolean> {
    return this.setItem('last_active', Date.now().toString())
  }

  // Get last active timestamp
  static async getLastActive(): Promise<number | null> {
    try {
      const data = await this.getItem('last_active')
      return data ? parseInt(data, 10) : null
    } catch (error) {
      console.error('Error getting last active timestamp:', error)
      return null
    }
  }
}