import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface StreakCardProps {
  streakCount?: number;
  streakIcon?: string;
}

export function StreakCard({ streakCount = 7, streakIcon = '🔥' }: StreakCardProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.streakBadge}>
        <ThemedText style={styles.streakIcon}>{streakIcon}</ThemedText>
        <ThemedText style={styles.streakCount}>{streakCount}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  streakIcon: {
    fontSize: 16,
  },
  streakCount: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
}); 