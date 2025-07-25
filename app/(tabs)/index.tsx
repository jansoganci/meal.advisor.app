import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import {
  CaloriesLeftCard,
  CarbsCard,
  FatCard,
  GreetingCard,
  PlanButtonsCard,
  ProteinCard,
  QuickMealButton,
  StreakCard,
  WeekCalendarCard
} from '@/components/cards';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.headerSection}>
        <GreetingCard />
        <StreakCard />
      </ThemedView>
      <WeekCalendarCard />
      <CaloriesLeftCard />
      <ThemedView style={styles.macrosRow}>
        <ProteinCard />
        <CarbsCard />
        <FatCard />
      </ThemedView>
      <QuickMealButton onPress={() => router.push('/quickmeal')} />
      <PlanButtonsCard />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 26,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
});
