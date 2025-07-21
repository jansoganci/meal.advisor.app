import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'

interface GenderPickerProps {
  value: 'male' | 'female' | 'other' | ''
  onValueChange: (gender: 'male' | 'female' | 'other') => void
}

export const GenderPicker: React.FC<GenderPickerProps> = ({ value, onValueChange }) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ]

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>👥 Gender</Text>
      <View style={[styles.pickerContainer, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={[styles.picker, { color: colors.text }]}
          itemStyle={{ color: colors.text }}
        >
          <Picker.Item label="Select your gender" value="" enabled={false} />
          {genderOptions.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
})