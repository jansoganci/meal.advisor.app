import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface InlineTagSelectProps {
  options: readonly string[]
  selectedOptions: string[]
  onOptionToggle: (option: string) => void
}

export const InlineTagSelect: React.FC<InlineTagSelectProps> = ({
  options,
  selectedOptions,
  onOptionToggle,
}) => {
  const formatOptionLabel = (option: string) => {
    return option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <View style={styles.container}>
      <View style={styles.tagsContainer}>
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option)
          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.tag,
                isSelected ? styles.tagSelected : styles.tagUnselected,
              ]}
              onPress={() => onOptionToggle(option)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.tagText,
                isSelected ? styles.tagTextSelected : styles.tagTextUnselected,
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
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  tagUnselected: {
    backgroundColor: '#F9F9F9',
    borderColor: '#E5E5EA',
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  tagTextSelected: {
    color: '#FFFFFF',
  },
  tagTextUnselected: {
    color: '#1A1A1A',
  },
}) 