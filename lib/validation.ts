import { UserProfile, OnboardingData } from '@/types/profile'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export class ValidationService {
  // Email validation
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Age validation
  static validateAge(age: number): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!age || age < 16) {
      errors.push('Age must be at least 16 years old')
    }
    if (age > 120) {
      errors.push('Age must be less than 120 years old')
    }
    if (age < 18) {
      warnings.push('Users under 18 should consult a healthcare professional')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  // Gender validation
  static validateGender(gender: string): ValidationResult {
    const validGenders = ['male', 'female', 'other']
    const errors: string[] = []

    if (!gender || !validGenders.includes(gender)) {
      errors.push('Please select a valid gender')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
    }
  }

  // Height validation (in cm)
  static validateHeight(height: number): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!height || height < 100) {
      errors.push('Height must be at least 100 cm')
    }
    if (height > 250) {
      errors.push('Height must be less than 250 cm')
    }
    if (height < 140) {
      warnings.push('Height seems unusually low for an adult')
    }
    if (height > 210) {
      warnings.push('Height seems unusually high')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  // Weight validation (in kg)
  static validateWeight(weight: number): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!weight || weight < 30) {
      errors.push('Weight must be at least 30 kg')
    }
    if (weight > 300) {
      errors.push('Weight must be less than 300 kg')
    }
    if (weight < 40) {
      warnings.push('Weight seems unusually low')
    }
    if (weight > 150) {
      warnings.push('Weight seems unusually high')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  // Activity level validation
  static validateActivityLevel(level: string): ValidationResult {
    const validLevels = ['sedentary', 'lightly_active', 'moderately_active', 'very_active']
    const errors: string[] = []

    if (!level || !validLevels.includes(level)) {
      errors.push('Please select a valid activity level')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
    }
  }

  // Fitness goal validation
  static validateFitnessGoal(goal: string): ValidationResult {
    const validGoals = ['lose_weight', 'gain_weight', 'maintain', 'build_muscle']
    const errors: string[] = []

    if (!goal || !validGoals.includes(goal)) {
      errors.push('Please select a valid fitness goal')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
    }
  }

  // Allergies validation
  static validateAllergies(allergies: string[]): ValidationResult {
    const validAllergies = ['peanuts', 'dairy', 'eggs', 'gluten', 'shellfish', 'fish', 'tree_nuts', 'other']
    const errors: string[] = []
    const warnings: string[] = []

    if (allergies && allergies.length > 0) {
      const invalidAllergies = allergies.filter(allergy => !validAllergies.includes(allergy))
      if (invalidAllergies.length > 0) {
        errors.push(`Invalid allergies: ${invalidAllergies.join(', ')}`)
      }

      if (allergies.length > 5) {
        warnings.push('Having many allergies may limit meal options significantly')
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  // Chronic illnesses validation
  static validateChronicIllnesses(illnesses: string[]): ValidationResult {
    const validIllnesses = ['diabetes', 'heart_disease', 'high_blood_pressure', 'none']
    const errors: string[] = []
    const warnings: string[] = []

    if (illnesses && illnesses.length > 0) {
      const invalidIllnesses = illnesses.filter(illness => !validIllnesses.includes(illness))
      if (invalidIllnesses.length > 0) {
        errors.push(`Invalid chronic illnesses: ${invalidIllnesses.join(', ')}`)
      }

      // Check for conflicting selections
      if (illnesses.includes('none') && illnesses.length > 1) {
        errors.push('Cannot select "none" with other chronic illnesses')
      }

      if (illnesses.length > 1 && !illnesses.includes('none')) {
        warnings.push('Multiple chronic illnesses may require special dietary considerations')
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  // Language validation
  static validateLanguage(language: string): ValidationResult {
    const supportedLanguages = ['en', 'ja', 'ko', 'zh', 'th', 'ms', 'vi', 'id', 'es', 'de', 'nl', 'lt', 'et', 'ar']
    const errors: string[] = []

    if (!language || !supportedLanguages.includes(language)) {
      errors.push('Please select a supported language')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
    }
  }

  // Comprehensive onboarding data validation
  static validateOnboardingData(data: OnboardingData): ValidationResult {
    const allErrors: string[] = []
    const allWarnings: string[] = []

    // Validate each field
    const ageValidation = this.validateAge(data.age)
    const genderValidation = this.validateGender(data.gender)
    const heightValidation = this.validateHeight(data.height)
    const weightValidation = this.validateWeight(data.weight)
    const activityValidation = this.validateActivityLevel(data.activity_level)
    const goalValidation = this.validateFitnessGoal(data.fitness_goal)
    const allergiesValidation = this.validateAllergies(data.allergies || [])
    const illnessesValidation = this.validateChronicIllnesses(data.chronic_illnesses || [])

    // Collect all errors and warnings
    allErrors.push(
      ...ageValidation.errors,
      ...genderValidation.errors,
      ...heightValidation.errors,
      ...weightValidation.errors,
      ...activityValidation.errors,
      ...goalValidation.errors,
      ...allergiesValidation.errors,
      ...illnessesValidation.errors
    )

    allWarnings.push(
      ...ageValidation.warnings,
      ...genderValidation.warnings,
      ...heightValidation.warnings,
      ...weightValidation.warnings,
      ...activityValidation.warnings,
      ...goalValidation.warnings,
      ...allergiesValidation.warnings,
      ...illnessesValidation.warnings
    )

    // Additional cross-field validations
    if (data.height && data.weight) {
      const bmi = data.weight / ((data.height / 100) * (data.height / 100))
      if (bmi < 15) {
        allWarnings.push('BMI is very low - consider consulting a healthcare professional')
      }
      if (bmi > 35) {
        allWarnings.push('BMI is very high - consider consulting a healthcare professional')
      }
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
    }
  }

  // Profile update validation
  static validateProfileUpdate(updates: Partial<UserProfile>): ValidationResult {
    const allErrors: string[] = []
    const allWarnings: string[] = []

    // Validate only the fields that are being updated
    if (updates.age !== undefined) {
      const validation = this.validateAge(updates.age)
      allErrors.push(...validation.errors)
      allWarnings.push(...validation.warnings)
    }

    if (updates.gender !== undefined) {
      const validation = this.validateGender(updates.gender)
      allErrors.push(...validation.errors)
      allWarnings.push(...validation.warnings)
    }

    if (updates.height !== undefined) {
      const validation = this.validateHeight(updates.height)
      allErrors.push(...validation.errors)
      allWarnings.push(...validation.warnings)
    }

    if (updates.weight !== undefined) {
      const validation = this.validateWeight(updates.weight)
      allErrors.push(...validation.errors)
      allWarnings.push(...validation.warnings)
    }

    if (updates.activity_level !== undefined) {
      const validation = this.validateActivityLevel(updates.activity_level)
      allErrors.push(...validation.errors)
      allWarnings.push(...validation.warnings)
    }

    if (updates.fitness_goal !== undefined) {
      const validation = this.validateFitnessGoal(updates.fitness_goal)
      allErrors.push(...validation.errors)
      allWarnings.push(...validation.warnings)
    }

    if (updates.allergies !== undefined) {
      const validation = this.validateAllergies(updates.allergies)
      allErrors.push(...validation.errors)
      allWarnings.push(...validation.warnings)
    }

    if (updates.chronic_illnesses !== undefined) {
      const validation = this.validateChronicIllnesses(updates.chronic_illnesses)
      allErrors.push(...validation.errors)
      allWarnings.push(...validation.warnings)
    }

    if (updates.language !== undefined) {
      const validation = this.validateLanguage(updates.language)
      allErrors.push(...validation.errors)
      allWarnings.push(...validation.warnings)
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
    }
  }
}

// Data sanitization utilities
export class SanitizationService {
  // Sanitize string input
  static sanitizeString(input: string): string {
    if (!input) return ''
    return input.trim().replace(/[<>]/g, '')
  }

  // Sanitize email
  static sanitizeEmail(email: string): string {
    if (!email) return ''
    return email.toLowerCase().trim()
  }

  // Sanitize array of strings
  static sanitizeStringArray(array: string[]): string[] {
    if (!array || !Array.isArray(array)) return []
    return array.map(item => this.sanitizeString(item)).filter(item => item.length > 0)
  }

  // Sanitize numeric input
  static sanitizeNumber(input: number | string): number {
    if (typeof input === 'number') return input
    const parsed = parseFloat(input)
    return isNaN(parsed) ? 0 : parsed
  }

  // Sanitize onboarding data
  static sanitizeOnboardingData(data: OnboardingData): OnboardingData {
    return {
      age: this.sanitizeNumber(data.age),
      gender: this.sanitizeString(data.gender) as any,
      height: this.sanitizeNumber(data.height),
      weight: this.sanitizeNumber(data.weight),
      allergies: this.sanitizeStringArray(data.allergies || []),
      chronic_illnesses: this.sanitizeStringArray(data.chronic_illnesses || []),
      activity_level: this.sanitizeString(data.activity_level) as any,
      fitness_goal: this.sanitizeString(data.fitness_goal) as any,
      language: this.sanitizeString(data.language || 'en'),
    }
  }

  // Sanitize profile update data
  static sanitizeProfileUpdate(updates: Partial<UserProfile>): Partial<UserProfile> {
    const sanitized: Partial<UserProfile> = {}

    if (updates.age !== undefined) sanitized.age = this.sanitizeNumber(updates.age)
    if (updates.gender !== undefined) sanitized.gender = this.sanitizeString(updates.gender) as any
    if (updates.height !== undefined) sanitized.height = this.sanitizeNumber(updates.height)
    if (updates.weight !== undefined) sanitized.weight = this.sanitizeNumber(updates.weight)
    if (updates.allergies !== undefined) sanitized.allergies = this.sanitizeStringArray(updates.allergies)
    if (updates.chronic_illnesses !== undefined) sanitized.chronic_illnesses = this.sanitizeStringArray(updates.chronic_illnesses)
    if (updates.activity_level !== undefined) sanitized.activity_level = this.sanitizeString(updates.activity_level) as any
    if (updates.fitness_goal !== undefined) sanitized.fitness_goal = this.sanitizeString(updates.fitness_goal) as any
    if (updates.language !== undefined) sanitized.language = this.sanitizeString(updates.language)

    return sanitized
  }
}