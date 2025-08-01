import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import {
  CaloriesLeftCard,
  CarbsCard,
  FatCard,
  GreetingCard,
  PlanButtonsCard,
  ProteinCard,
  QuickMealButton,
  ShoppingListCard,
  StreakCard,
  WeekCalendarCard
} from '@/components/cards';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import type { ShoppingList } from '@/lib/database';
import { getCurrentShoppingList } from '@/lib/shopping-list';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, dailyNutrition } = useProfile();
  const [currentShoppingList, setCurrentShoppingList] = useState<ShoppingList | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadCurrentShoppingList();
    }
  }, [user?.id]);

  const loadCurrentShoppingList = async () => {
    if (!user?.id) return;
    
    try {
      const shoppingList = await getCurrentShoppingList(user.id);
      setCurrentShoppingList(shoppingList);
    } catch (error) {
      console.error('Error loading current shopping list:', error);
    }
  };

  const handleShoppingListPress = () => {
    router.push('/shopping-list');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.headerSection}>
        <GreetingCard userName={profile?.full_name} />
        <StreakCard />
      </ThemedView>
      <WeekCalendarCard />
      <CaloriesLeftCard 
        caloriesLeft={dailyNutrition?.caloriesLeft ?? 0}
        totalCalories={dailyNutrition?.caloriesGoal ?? 2000}
      />
      <ThemedView style={styles.macrosRow}>
        <ProteinCard proteinLeft={dailyNutrition?.proteinLeft ?? 0} />
        <CarbsCard carbsLeft={dailyNutrition?.carbsLeft ?? 0} />
        <FatCard fatLeft={dailyNutrition?.fatLeft ?? 0} />
      </ThemedView>
      <QuickMealButton onPress={() => router.push('/quickmeal')} />
      <PlanButtonsCard />
      <ShoppingListCard 
        shoppingList={currentShoppingList}
        onPress={handleShoppingListPress}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 41,
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
