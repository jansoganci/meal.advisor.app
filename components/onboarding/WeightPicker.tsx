import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'

interface WeightPickerProps {
  value: number
  onValueChange: (weight: number) => void
}

export const WeightPicker: React.FC<WeightPickerProps> = ({ value, onValueChange }) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  // Generate weights from 40kg to 150kg (0.5kg increments)
  const weights = Array.from({ length: 221 }, (_, i) => (i * 0.5) + 40)

  const formatWeight = (kg: number) => {
    const pounds = Math.round(kg * 2.20462)
    return `${kg}kg (${pounds} lbs)`
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>⚖️ Weight</Text>
      <View style={[styles.pickerContainer, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={[styles.picker, { color: colors.text }]}
          itemStyle={{ color: colors.text }}
        >
          <Picker.Item label="Select your weight" value={0} enabled={false} />
          {weights.map((weight) => (
            <Picker.Item key={weight} label={formatWeight(weight)} value={weight} />
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