import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface MealsCardProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  defaultValue?: string[];
  error?: string | null;
}

export function MealsCard({ 
  value, 
  onChange, 
  defaultValue = ['Breakfast', 'Lunch', 'Dinner'],
  error
}: MealsCardProps) {
  const currentValue = value ?? defaultValue;
  const options = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const handleSelection = (selectedValue: string) => {
    if (!onChange) return;
    
    const newValue = currentValue.includes(selectedValue)
      ? currentValue.filter(item => item !== selectedValue)
      : [...currentValue, selectedValue];
    
    onChange(newValue);
  };

  const isSelected = (option: string) => currentValue.includes(option);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>🍽️ Meals to Include</ThemedText>
      <ThemedView style={styles.optionsRow}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              isSelected(option) && styles.selectedButton
            ]}
            onPress={() => handleSelection(option)}
          >
            <ThemedText style={[
              styles.optionText,
              isSelected(option) && styles.selectedText
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
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
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