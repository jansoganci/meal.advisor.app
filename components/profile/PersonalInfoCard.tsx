import { InlineTagSelect } from '@/components/profile/InlineTagSelect'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/contexts/ProfileContext'
import { supabase } from '@/lib/supabase'
import { ALLERGY_OPTIONS, CUISINE_PREFERENCES_OPTIONS, DIETARY_PREFERENCES_OPTIONS } from '@/types/onboarding'
import { Picker } from '@react-native-picker/picker'
import * as Haptics from 'expo-haptics'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface PersonalInfoCardProps {
  age?: number
  gender?: string
  height_cm?: number
  weight_kg?: number
  primary_goal?: string
  activity_level?: string
  allergies?: string[]
  dietary_preferences?: string[]
  cuisine_preferences?: string[]
}

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  age,
  gender,
  height_cm,
  weight_kg,
  primary_goal,
  activity_level,
  allergies,
  dietary_preferences,
  cuisine_preferences
}) => {
  const { user } = useAuth()
  const { profile, loading, error, refreshProfile } = useProfile()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Use real profile data with fallbacks to props, then defaults
  const realAge = age ?? profile?.age ?? 28
  const realGender = gender ?? profile?.gender ?? 'male'
  const realHeight = height_cm ?? profile?.height_cm ?? 180
  const realWeight = weight_kg ?? profile?.weight_kg ?? 74
  const realGoal = primary_goal ?? profile?.primary_goal ?? 'lose_weight'
  const realActivity = activity_level ?? profile?.activity_level ?? 'moderately_active'
  const realAllergies = allergies ?? profile?.allergies ?? ['dairy', 'gluten']
  const realDiet = dietary_preferences ?? profile?.dietary_preferences ?? ['vegetarian']
  const realCuisine = cuisine_preferences ?? profile?.cuisine_preferences ?? ['italian', 'mediterranean']
  
  // Budget state
  const [budgetPerMeal, setBudgetPerMeal] = useState<number>(10.00)
  const [budgetInput, setBudgetInput] = useState<number>(10.00)
  const [budgetModalVisible, setBudgetModalVisible] = useState(false)
  const [tempBudget, setTempBudget] = useState<number>(10.00)
  
  // Input state for edit mode
  const [ageInput, setAgeInput] = useState(realAge)
  const [genderInput, setGenderInput] = useState(realGender)
  const [heightInput, setHeightInput] = useState(realHeight)
  const [weightInput, setWeightInput] = useState(realWeight)
  const [goalInput, setGoalInput] = useState(realGoal)
  const [activityInput, setActivityInput] = useState(realActivity)
  const [allergiesInput, setAllergiesInput] = useState(realAllergies)
  const [dietInput, setDietInput] = useState(realDiet)
  const [cuisineInput, setCuisineInput] = useState(realCuisine)

  // Modal states for pickers
  const [ageModalVisible, setAgeModalVisible] = useState(false)
  const [genderModalVisible, setGenderModalVisible] = useState(false)
  const [heightModalVisible, setHeightModalVisible] = useState(false)
  const [weightModalVisible, setWeightModalVisible] = useState(false)
  const [goalModalVisible, setGoalModalVisible] = useState(false)
  const [activityModalVisible, setActivityModalVisible] = useState(false)

  // Temporary values for pickers
  const [tempAge, setTempAge] = useState(realAge)
  const [tempGender, setTempGender] = useState(realGender)
  const [tempHeight, setTempHeight] = useState(realHeight)
  const [tempWeight, setTempWeight] = useState(realWeight)
  const [tempGoal, setTempGoal] = useState(realGoal)
  const [tempActivity, setTempActivity] = useState(realActivity)

  // Generate ranges for number pickers
  const ages = Array.from({ length: 82 }, (_, i) => i + 18) // 18-99
  const heights = Array.from({ length: 121 }, (_, i) => i + 100) // 100-220
  const weights = Array.from({ length: 166 }, (_, i) => i + 35) // 35-200

  // Budget options (in dollars)
  const budgetOptions = [
    { value: 5.00, label: '$5.00' },
    { value: 7.50, label: '$7.50' },
    { value: 10.00, label: '$10.00' },
    { value: 12.50, label: '$12.50' },
    { value: 15.00, label: '$15.00' },
    { value: 17.50, label: '$17.50' },
    { value: 20.00, label: '$20.00' },
    { value: 25.00, label: '$25.00' },
    { value: 30.00, label: '$30.00' },
    { value: 35.00, label: '$35.00' },
    { value: 40.00, label: '$40.00' },
    { value: 50.00, label: '$50.00' },
  ]

  // Gender options
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
  ]

  // Goal options
  const goalOptions = [
    { value: 'lose_weight', label: 'Lose Weight' },
    { value: 'maintain_weight', label: 'Maintain Weight' },
    { value: 'gain_weight', label: 'Gain Weight' },
  ]

  // Activity level options
  const activityOptions = [
    { value: 'sedentary', label: 'Sedentary' },
    { value: 'lightly_active', label: 'Lightly Active' },
    { value: 'moderately_active', label: 'Moderately Active' },
    { value: 'very_active', label: 'Very Active' },
    { value: 'extremely_active', label: 'Extremely Active' },
  ]

  // Update input values when profile data loads
  useEffect(() => {
    if (profile && !loading) {
      // Update input states
      setAgeInput(profile.age)
      setGenderInput(profile.gender)
      setHeightInput(profile.height_cm)
      setWeightInput(profile.weight_kg)
      setGoalInput(profile.primary_goal)
      setActivityInput(profile.activity_level)
      setAllergiesInput(profile.allergies || [])
      setDietInput(profile.dietary_preferences || [])
      setCuisineInput(profile.cuisine_preferences || [])
    }
  }, [profile, loading])

  // Fetch budget_per_meal from user_preferences table on component mount
  useEffect(() => {
    const fetchBudget = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('budget_per_meal')
          .eq('user_id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching budget:', error)
          return
        }

        if (data && data.budget_per_meal !== null) {
          const budget = parseFloat(data.budget_per_meal)
          setBudgetPerMeal(budget)
          setBudgetInput(budget)
        }
      } catch (error) {
        console.error('Error fetching budget:', error)
      }
    }

    fetchBudget()
  }, [user])

  // Show loading state
  if (loading) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Personal Info</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading profile data...</Text>
        </View>
      </View>
    )
  }

  // Show error state
  if (error) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Personal Info</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ Error loading profile</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refreshProfile()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const handleEditPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setEditing(true)
  }

  const handleSavePress = async () => {
    if (!user) {
      Alert.alert('Error', 'User not authenticated')
      return
    }

    // Validate all input values before saving
    const validationErrors: string[] = []

    // Validate age (INTEGER, range 18-99)
    if (!ageInput || ageInput < 18 || ageInput > 99) {
      validationErrors.push('Age must be between 18 and 99 years')
    }

    // Validate gender (TEXT ENUM)
    const validGenders = ['male', 'female', 'other', 'prefer_not_to_say']
    if (!genderInput || !validGenders.includes(genderInput)) {
      validationErrors.push('Please select a valid gender')
    }

    // Validate height_cm (INTEGER, range 100-220)
    if (!heightInput || heightInput < 100 || heightInput > 220) {
      validationErrors.push('Height must be between 100 and 220 cm')
    }

    // Validate weight_kg (INTEGER, range 35-200)
    if (!weightInput || weightInput < 35 || weightInput > 200) {
      validationErrors.push('Weight must be between 35 and 200 kg')
    }

    // Validate primary_goal (TEXT ENUM)
    const validGoals = ['lose_weight', 'maintain_weight', 'gain_weight']
    if (!goalInput || !validGoals.includes(goalInput)) {
      validationErrors.push('Please select a valid goal')
    }

    // Validate activity_level (TEXT ENUM)
    const validActivityLevels = ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active']
    if (!activityInput || !validActivityLevels.includes(activityInput)) {
      validationErrors.push('Please select a valid activity level')
    }

    // Validate allergies (TEXT[])
    if (!Array.isArray(allergiesInput)) {
      validationErrors.push('Allergies must be an array')
    } else {
      const validAllergies = ['peanuts', 'dairy', 'eggs', 'gluten', 'shellfish', 'fish', 'tree_nuts', 'none']
      const invalidAllergies = allergiesInput.filter(allergy => !validAllergies.includes(allergy))
      if (invalidAllergies.length > 0) {
        validationErrors.push(`Invalid allergies: ${invalidAllergies.join(', ')}`)
      }
    }

    // Validate dietary_preferences (TEXT[])
    if (!Array.isArray(dietInput)) {
      validationErrors.push('Dietary preferences must be an array')
    } else {
      const validDietaryPreferences = ['vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo', 'mediterranean', 'low_carb', 'low_fat', 'gluten_free', 'dairy_free', 'none']
      const invalidDietaryPreferences = dietInput.filter(diet => !validDietaryPreferences.includes(diet))
      if (invalidDietaryPreferences.length > 0) {
        validationErrors.push(`Invalid dietary preferences: ${invalidDietaryPreferences.join(', ')}`)
      }
    }

    // Validate cuisine_preferences (TEXT[])
    if (!Array.isArray(cuisineInput)) {
      validationErrors.push('Cuisine preferences must be an array')
    } else {
      const validCuisinePreferences = ['italian', 'mexican', 'turkish', 'chinese', 'japanese', 'thai', 'indian', 'mediterranean', 'american', 'french', 'greek', 'korean', 'vietnamese', 'middle_eastern']
      const invalidCuisinePreferences = cuisineInput.filter(cuisine => !validCuisinePreferences.includes(cuisine))
      if (invalidCuisinePreferences.length > 0) {
        validationErrors.push(`Invalid cuisine preferences: ${invalidCuisinePreferences.join(', ')}`)
      }
    }

    // Validate budget_per_meal (DECIMAL)
    if (!budgetInput || budgetInput < 0) {
      validationErrors.push('Budget per meal must be a positive number')
    }

    // If validation fails, show errors and return
    if (validationErrors.length > 0) {
      Alert.alert('Validation Error', validationErrors.join('\n'))
      return
    }

    setSaving(true)
    
    try {
      // Update users table
      const { error: userError } = await supabase
        .from('users')
        .update({
          age: ageInput as number,
          gender: genderInput as string,
          height_cm: heightInput as number,
          weight_kg: weightInput as number,
          primary_goal: goalInput as string,
          activity_level: activityInput as string,
          allergies: allergiesInput as string[],
          dietary_preferences: dietInput as string[],
          cuisine_preferences: cuisineInput as string[],
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (userError) {
        throw userError
      }

      // Update user_preferences table for budget_per_meal
      const { error: budgetError } = await supabase
        .from('user_preferences')
        .update({
          budget_per_meal: budgetInput,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (budgetError) {
        throw budgetError
      }

      // Update displayed values with input values
      setAgeInput(ageInput)
      setGenderInput(genderInput)
      setHeightInput(heightInput)
      setWeightInput(weightInput)
      setGoalInput(goalInput)
      setActivityInput(activityInput)
      setAllergiesInput(allergiesInput)
      setDietInput(dietInput)
      setCuisineInput(cuisineInput)
      setBudgetPerMeal(budgetInput)
      setEditing(false)
      
      // Success haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => {
          // Refresh profile data to ensure consistency
          refreshProfile()
        }}
      ])
    } catch (error) {
      console.error('Error updating profile:', error)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      Alert.alert('Error', 'Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancelPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    // Reset inputs to current displayed values
    setAgeInput(realAge)
    setGenderInput(realGender)
    setHeightInput(realHeight)
    setWeightInput(realWeight)
    setGoalInput(realGoal)
    setActivityInput(realActivity)
    setAllergiesInput(realAllergies)
    setDietInput(realDiet)
    setCuisineInput(realCuisine)
    setBudgetInput(budgetPerMeal)
    setEditing(false)
  }

  const handleAllergyToggle = (allergy: string) => {
    setAllergiesInput(prev => 
      prev.includes(allergy) 
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    )
  }

  const handleDietToggle = (diet: string) => {
    setDietInput(prev => 
      prev.includes(diet) 
        ? prev.filter(d => d !== diet)
        : [...prev, diet]
    )
  }

  const handleCuisineToggle = (cuisine: string) => {
    setCuisineInput(prev => 
      prev.includes(cuisine) 
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    )
  }

  const renderNumberPicker = (
    label: string, 
    value: number, 
    onValueChange: (value: number) => void,
    options: number[],
    modalVisible: boolean,
    setModalVisible: (visible: boolean) => void,
    tempValue: number,
    setTempValue: (value: number) => void,
    formatLabel: (value: number) => string
  ) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}:</Text>
      {editing ? (
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => {
            setTempValue(value)
            setModalVisible(true)
          }}
          disabled={saving}
        >
          <Text style={styles.pickerButtonText}>{formatLabel(value)}</Text>
          <Text style={styles.chevron}>▼</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.value}>{formatLabel(value)}</Text>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select {label}</Text>
              <TouchableOpacity 
                onPress={() => {
                  onValueChange(tempValue)
                  setModalVisible(false)
                }} 
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={tempValue}
                onValueChange={setTempValue}
                style={styles.modalPicker}
              >
                {options.map((option) => (
                  <Picker.Item key={option} label={formatLabel(option)} value={option} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )

  const renderEnumPicker = (
    label: string,
    value: string,
    onValueChange: (value: string) => void,
    options: { value: string, label: string }[],
    modalVisible: boolean,
    setModalVisible: (visible: boolean) => void,
    tempValue: string,
    setTempValue: (value: string) => void
  ) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}:</Text>
      {editing ? (
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => {
            setTempValue(value)
            setModalVisible(true)
          }}
          disabled={saving}
        >
          <Text style={styles.pickerButtonText}>
            {options.find(opt => opt.value === value)?.label || 'Select'}
          </Text>
          <Text style={styles.chevron}>▼</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.value}>
          {options.find(opt => opt.value === value)?.label || value}
        </Text>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select {label}</Text>
              <TouchableOpacity 
                onPress={() => {
                  onValueChange(tempValue)
                  setModalVisible(false)
                }} 
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={tempValue}
                onValueChange={setTempValue}
                style={styles.modalPicker}
              >
                {options.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )

  const renderMultiSelect = (
    label: string,
    selectedOptions: string[],
    onOptionToggle: (option: string) => void,
    options: readonly string[]
  ) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}:</Text>
      {editing ? (
        <View style={styles.multiSelectContainer}>
          <InlineTagSelect
            options={options}
            selectedOptions={selectedOptions}
            onOptionToggle={onOptionToggle}
          />
        </View>
      ) : (
        <Text style={styles.value}>
          {selectedOptions.length > 0 ? selectedOptions.join(', ') : 'None selected'}
        </Text>
      )}
    </View>
  )

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Personal Info</Text>
      
      <ScrollView style={styles.infoGrid} showsVerticalScrollIndicator={false}>
        {renderNumberPicker(
          'Age',
          ageInput,
          setAgeInput,
          ages,
          ageModalVisible,
          setAgeModalVisible,
          tempAge,
          setTempAge,
          (value) => `${value} years old`
        )}
        
        {renderEnumPicker(
          'Gender',
          genderInput,
          setGenderInput,
          genderOptions,
          genderModalVisible,
          setGenderModalVisible,
          tempGender,
          setTempGender
        )}
        
        {renderNumberPicker(
          'Height (cm)',
          heightInput,
          setHeightInput,
          heights,
          heightModalVisible,
          setHeightModalVisible,
          tempHeight,
          setTempHeight,
          (value) => `${value} cm`
        )}
        
        {renderNumberPicker(
          'Weight (kg)',
          weightInput,
          setWeightInput,
          weights,
          weightModalVisible,
          setWeightModalVisible,
          tempWeight,
          setTempWeight,
          (value) => `${value} kg`
        )}
        
        {renderEnumPicker(
          'Goal',
          goalInput,
          setGoalInput,
          goalOptions,
          goalModalVisible,
          setGoalModalVisible,
          tempGoal,
          setTempGoal
        )}
        
        {renderEnumPicker(
          'Activity',
          activityInput,
          setActivityInput,
          activityOptions,
          activityModalVisible,
          setActivityModalVisible,
          tempActivity,
          setTempActivity
        )}
        
        {renderMultiSelect(
          'Allergies',
          allergiesInput,
          handleAllergyToggle,
          ALLERGY_OPTIONS
        )}
        
        {renderMultiSelect(
          'Diet',
          dietInput,
          handleDietToggle,
          DIETARY_PREFERENCES_OPTIONS
        )}
        
        {renderMultiSelect(
          'Cuisine',
          cuisineInput,
          handleCuisineToggle,
          CUISINE_PREFERENCES_OPTIONS
        )}

        {renderNumberPicker(
          'Budget per Meal ($)',
          budgetInput,
          setBudgetInput,
          budgetOptions.map(opt => opt.value),
          budgetModalVisible,
          setBudgetModalVisible,
          tempBudget,
          setTempBudget,
          (value) => `$${value.toFixed(2)}`
        )}
      </ScrollView>
      
      <View style={styles.editButton}>
        {editing ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.saveButton, saving && styles.disabledButton]} 
              onPress={handleSavePress}
              disabled={saving}
            >
              <Text style={styles.saveText}>
                {saving ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleCancelPress}
              disabled={saving}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handleEditPress}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    maxHeight: 600,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  infoGrid: {
    gap: 12,
    maxHeight: 400,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    minHeight: 40,
  },
  label: {
    fontSize: 16,
    color: '#666666',
    flex: 1,
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'right',
    marginTop: 8,
  },
  pickerButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F9F9F9',
  },
  pickerButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    flex: 1,
  },
  chevron: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 8,
  },
  multiSelectContainer: {
    flex: 1,
    marginLeft: 4, // Reduced from 8
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalButton: {
    minWidth: 60,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  pickerWrapper: {
    height: 200,
  },
  modalPicker: {
    height: 200,
  },
  editButton: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center',
  },
  editText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  disabledButton: {
    backgroundColor: '#C7C7CC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF3B30',
    marginBottom: 5,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
}) 