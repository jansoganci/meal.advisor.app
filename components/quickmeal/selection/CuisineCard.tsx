import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface CuisineCardProps {
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  error?: string | null;
}

export function CuisineCard({ 
  value, 
  onChange, 
  defaultValue = 'Any',
  error
}: CuisineCardProps) {
  const currentValue = value ?? defaultValue;
  const options = [
    'Italian',
    'Mexican',
    'Asian',
    'Mediterranean',
    'American',
    'Indian',
    'French',
    'Thai',
    'Greek',
    'Chinese',
    'Japanese',
    'Korean'
  ];

  const handleSelection = (selectedValue: string) => {
    onChange?.(selectedValue);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>🍜 Cuisine</ThemedText>
      <ThemedView style={styles.optionsGrid}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              currentValue === option && styles.selectedButton
            ]}
            onPress={() => handleSelection(option)}
          >
            <ThemedText style={[
              styles.optionText,
              currentValue === option && styles.selectedText
            ]}>
              {option}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minWidth: '30%',
    minHeight: 44,
    flex: 1,
  },
  selectedButton: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  selectedText: {
    color: 'white',
  },
}); 