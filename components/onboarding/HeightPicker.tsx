import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'

interface HeightPickerProps {
  value: number
  onValueChange: (height: number) => void
}

export const HeightPicker: React.FC<HeightPickerProps> = ({ value, onValueChange }) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  // Generate heights from 140cm to 220cm
  const heights = Array.from({ length: 81 }, (_, i) => i + 140)

  const formatHeight = (cm: number) => {
    const feet = Math.floor(cm / 30.48)
    const inches = Math.round((cm - feet * 30.48) / 2.54)
    return `${cm}cm (${feet}'${inches}")`
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>📏 Height</Text>
      <View style={[styles.pickerContainer, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={[styles.picker, { color: colors.text }]}
          itemStyle={{ color: colors.text }}
        >
          <Picker.Item label="Select your height" value={0} enabled={false} />
          {heights.map((height) => (
            <Picker.Item key={height} label={formatHeight(height)} value={height} />
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