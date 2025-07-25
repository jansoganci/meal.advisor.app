import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface DietCardProps {
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  error?: string | null;
}

export function DietCard({ 
  value, 
  onChange, 
  defaultValue = 'None',
  error
}: DietCardProps) {
  const currentValue = value ?? defaultValue;
  const options = [
    'None',
    'Vegetarian',
    'Vegan',
    'Keto',
    'Paleo',
    'Mediterranean',
    'Low-Carb',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
    'Low-Fat',
    'Low-Sodium'
  ];

  const handleSelection = (selectedValue: string) => {
    onChange?.(selectedValue);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>🌱 Diet Type</ThemedText>
      <ThemedView style={styles.optionsGrid}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              currentValue === option && styles.selectedButton,
              error && styles.errorButton
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
      {error && (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      )}
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
  errorButton: {
    borderColor: 'red',
    borderWidth: 2,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 8,
  },
}); 