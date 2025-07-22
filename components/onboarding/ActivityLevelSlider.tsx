import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { ACTIVITY_LEVELS } from '@/types/onboarding'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface ActivityLevelSliderProps {
  value: string
  onValueChange: (level: string) => void
}

export const ActivityLevelSlider: React.FC<ActivityLevelSliderProps> = ({
  value,
  onValueChange,
}) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>🏃‍♂️ Daily activity level</Text>
      <View style={styles.levelsContainer}>
        {ACTIVITY_LEVELS.map((level) => {
          const isSelected = value === level.value
          return (
            <TouchableOpacity
              key={level.value}
              style={[
                styles.levelOption,
                {
                  backgroundColor: isSelected ? colors.tint : colors.background,
                  borderColor: isSelected ? colors.tint : colors.tabIconDefault,
                },
              ]}
              onPress={() => onValueChange(level.value)}
              activeOpacity={0.7}
            >
              <View style={styles.levelContent}>
                <Text style={[
                  styles.levelTitle,
                  { color: isSelected ? '#fff' : colors.text },
                ]}>
                  {level.label}
                </Text>
                <Text style={[
                  styles.levelDescription,
                  { color: isSelected ? '#fff' : colors.text },
                ]}>
                  {level.description}
                </Text>
              </View>
              {isSelected && (
                <View style={styles.radioButton}>
                  <View style={[styles.radioInner, { backgroundColor: '#fff' }]} />
                </View>
              )}
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
  levelsContainer: {
    gap: 12,
  },
  levelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  levelContent: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  levelDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
})