import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface CheckboxListProps {
  title: string
  options: readonly string[]
  selectedOptions: string[]
  onOptionToggle: (option: string) => void
  multiSelect?: boolean
  compact?: boolean // NEW: for profile card usage
  maxColumns?: number // NEW: control grid columns
}

export const CheckboxList: React.FC<CheckboxListProps> = ({
  title,
  options,
  selectedOptions,
  onOptionToggle,
  multiSelect = true,
  compact = false, // NEW
  maxColumns = 2, // NEW
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

  // Calculate responsive minWidth based on maxColumns
  const getMinWidth = () => {
    if (compact) {
      return maxColumns === 2 ? '48%' : maxColumns === 3 ? '31%' : '48%'
    }
    return '45%' // Default for onboarding
  }

  return (
    <View style={styles.container}>
      {title && <Text style={[styles.title, { color: colors.text }]}>{title}</Text>}
      <View style={[styles.optionsContainer, { gap: compact ? 6 : 12 }]}>
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
                  minWidth: getMinWidth(),
                  paddingVertical: compact ? 6 : 12,
                  paddingHorizontal: compact ? 8 : 16,
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
                    width: compact ? 14 : 20,
                    height: compact ? 14 : 20,
                  },
                ]}>
                  {isSelected && (
                    <Text style={[
                      styles.checkmark, 
                      { 
                        color: colors.tint,
                        fontSize: compact ? 8 : 14,
                      }
                    ]}>✓</Text>
                  )}
                </View>
              </View>
              <Text style={[
                styles.optionText,
                { 
                  color: isSelected ? '#fff' : colors.text,
                  fontSize: compact ? 12 : 16,
                },
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
    marginBottom: 16, // Reduced from 32
  },
  title: {
    fontSize: 16, // Reduced from 18
    fontWeight: '600',
    marginBottom: 8, // Reduced from 16
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6, // Reduced from 12
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8, // Reduced from 12
    paddingHorizontal: 10, // Reduced from 16
    borderWidth: 1,
    borderRadius: 6, // Reduced from 8
    minWidth: '30%', // Reduced from 45% - allows 3 columns
    maxWidth: '48%', // Added to prevent too-wide items
  },
  checkbox: {
    marginRight: 8, // Reduced from 12
  },
  checkboxInner: {
    width: 16, // Reduced from 20
    height: 16, // Reduced from 20
    borderRadius: 3, // Reduced from 4
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 10, // Reduced from 14
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 14, // Reduced from 16
    fontWeight: '500',
    flex: 1,
  },
})