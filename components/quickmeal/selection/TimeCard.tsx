import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface TimeCardProps {
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  error?: string | null;
}

export function TimeCard({ 
  value, 
  onChange, 
  defaultValue = '30-45',
  error
}: TimeCardProps) {
  const currentValue = value ?? defaultValue;
  const options = ['<30', '30-45', '45-60', '60+'];

  const handleSelection = (selectedValue: string) => {
    onChange?.(selectedValue);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>⏱️ Max Prep Time</ThemedText>
      <ThemedView style={styles.optionsRow}>
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
  },
  selectedText: {
    color: 'white',
  },
  errorButton: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 8,
  },
}); 