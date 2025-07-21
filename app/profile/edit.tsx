import { ActivityLevelSlider } from '@/components/onboarding/ActivityLevelSlider'
import { AgePicker } from '@/components/onboarding/AgePicker'
import { CheckboxList } from '@/components/onboarding/CheckboxList'
import { GenderPicker } from '@/components/onboarding/GenderPicker'
import { GoalSelection } from '@/components/onboarding/GoalSelection'
import { HeightPicker } from '@/components/onboarding/HeightPicker'
import { WeightPicker } from '@/components/onboarding/WeightPicker'
import { Colors } from '@/constants/Colors'
import { useProfile } from '@/contexts/ProfileContext'
import { useColorScheme } from '@/hooks/useColorScheme'
import { ALLERGY_OPTIONS, CHRONIC_ILLNESS_OPTIONS } from '@/types/onboarding'
import { UserProfile } from '@/types/profile'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function EditProfileScreen() {
  const colorScheme = useColorScheme()
  const colors = Colors.light
  const { profile, updateProfile, loading } = useProfile()
  
  const [formData, setFormData] = useState<Partial<UserProfile>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (profile) {
      setFormData({
        age: profile.age,
        gender: profile.gender,
        height: profile.height,
        weight: profile.weight,
        allergies: profile.allergies || [],
        chronic_illnesses: profile.chronic_illnesses || [],
        activity_level: profile.activity_level,
        fitness_goal: profile.fitness_goal,
      })
    }
  }, [profile])

  const handleSave = async () => {
    if (!profile) return

    setIsSubmitting(true)
    try {
      const success = await updateProfile(formData)
      if (success) {
        Alert.alert('Success', 'Profile updated successfully!', [
          { text: 'OK', onPress: () => router.back() },
        ])
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.')
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const handleAllergyToggle = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies?.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...(prev.allergies || []), allergy],
    }))
  }

  const handleChronicIllnessToggle = (illness: string) => {
    if (illness === 'none') {
      setFormData(prev => ({
        ...prev,
        chronic_illnesses: prev.chronic_illnesses?.includes('none') ? [] : ['none'],
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        chronic_illnesses: prev.chronic_illnesses?.includes(illness)
          ? prev.chronic_illnesses.filter(i => i !== illness)
          : [...(prev.chronic_illnesses?.filter(i => i !== 'none') || []), illness],
      }))
    }
  }

  if (loading || !profile) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          style={[styles.saveButton, { backgroundColor: colors.tint }]}
          disabled={isSubmitting}
        >
          <Text style={styles.saveButtonText}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>
          <AgePicker 
            value={formData.age || 0} 
            onValueChange={(age) => setFormData(prev => ({ ...prev, age }))} 
          />
          <GenderPicker 
            value={formData.gender || ''} 
            onValueChange={(gender) => setFormData(prev => ({ ...prev, gender }))} 
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Physical Measurements</Text>
          <HeightPicker 
            value={formData.height || 0} 
            onValueChange={(height) => setFormData(prev => ({ ...prev, height }))} 
          />
          <WeightPicker 
            value={formData.weight || 0} 
            onValueChange={(weight) => setFormData(prev => ({ ...prev, weight }))} 
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Health Information</Text>
          <CheckboxList
            title="⚠️ Allergies"
            options={ALLERGY_OPTIONS}
            selectedOptions={formData.allergies || []}
            onOptionToggle={handleAllergyToggle}
            multiSelect={true}
          />
          <CheckboxList
            title="🩺 Chronic illnesses"
            options={CHRONIC_ILLNESS_OPTIONS}
            selectedOptions={formData.chronic_illnesses || []}
            onOptionToggle={handleChronicIllnessToggle}
            multiSelect={true}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Goals & Activity</Text>
          <ActivityLevelSlider
            value={formData.activity_level || ''}
            onValueChange={(level) => setFormData(prev => ({ ...prev, activity_level: level as any }))}
          />
          <GoalSelection
            value={formData.fitness_goal || ''}
            onValueChange={(goal) => setFormData(prev => ({ ...prev, fitness_goal: goal as any }))}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
  bottomSpacing: {
    height: 40,
  },
})