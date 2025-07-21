import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'

interface CheckboxListProps {
  title: string
  options: readonly string[]
  selectedOptions: string[]
  onOptionToggle: (option: string) => void
  multiSelect?: boolean
}

export const CheckboxList: React.FC<CheckboxListProps> = ({
  title,
  options,
  selectedOptions,
  onOptionToggle,
  multiSelect = true,
}) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const formatOptionLabel = (option: string) => {
    return option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const handleOptionPress = (option: string) => {
    if (!multiSelect) {
      // Single select - clear others first
      onOptionToggle(option)
    } else {
      // Multi select
      onOptionToggle(option)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option)
          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                {
                  backgroundColor: isSelected ? colors.tint : colors.background,
                  borderColor: isSelected ? colors.tint : colors.tabIconDefault,
                },
              ]}
              onPress={() => handleOptionPress(option)}
              activeOpacity={0.7}
            >
              <View style={styles.checkbox}>
                <View style={[
                  styles.checkboxInner,
                  {
                    backgroundColor: isSelected ? '#fff' : 'transparent',
                  },
                ]}>
                  {isSelected && (
                    <Text style={[styles.checkmark, { color: colors.tint }]}>✓</Text>
                  )}
                </View>
              </View>
              <Text style={[
                styles.optionText,
                { color: isSelected ? '#fff' : colors.text },
              ]}>
                {formatOptionLabel(option)}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    minWidth: '45%',
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
})