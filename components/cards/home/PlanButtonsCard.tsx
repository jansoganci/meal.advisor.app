import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export function PlanButtonsCard() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.buttonsRow}>
        <ThemedView style={styles.button}>
          <ThemedText style={styles.buttonText}>Weekly Plan</ThemedText>
        </ThemedView>
        <ThemedView style={styles.button}>
          <ThemedText style={styles.buttonText}>Monthly Plan</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
}); 