import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'

interface AgePickerProps {
  value: number
  onValueChange: (age: number) => void
}

export const AgePicker: React.FC<AgePickerProps> = ({ value, onValueChange }) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  // Generate ages from 16 to 99
  const ages = Array.from({ length: 84 }, (_, i) => i + 16)

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>📅 Age</Text>
      <View style={[styles.pickerContainer, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={[styles.picker, { color: colors.text }]}
          itemStyle={{ color: colors.text }}
        >
          <Picker.Item label="Select your age" value={0} enabled={false} />
          {ages.map((age) => (
            <Picker.Item key={age} label={`${age} years old`} value={age} />
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