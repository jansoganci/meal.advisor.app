import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { FITNESS_GOALS } from '@/types/onboarding'

interface GoalSelectionProps {
  value: string
  onValueChange: (goal: string) => void
}

export const GoalSelection: React.FC<GoalSelectionProps> = ({
  value,
  onValueChange,
}) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>🎯 Goal</Text>
      <View style={styles.goalsContainer}>
        {FITNESS_GOALS.map((goal) => {
          const isSelected = value === goal.value
          return (
            <TouchableOpacity
              key={goal.value}
              style={[
                styles.goalOption,
                {
                  backgroundColor: isSelected ? colors.tint : colors.background,
                  borderColor: isSelected ? colors.tint : colors.tabIconDefault,
                },
              ]}
              onPress={() => onValueChange(goal.value)}
              activeOpacity={0.7}
            >
              <Text style={styles.goalEmoji}>{goal.emoji}</Text>
              <Text style={[
                styles.goalText,
                { color: isSelected ? '#fff' : colors.text },
              ]}>
                {goal.label}
              </Text>
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
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  goalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
    minWidth: '45%',
    flex: 1,
  },
  goalEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  goalText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
})