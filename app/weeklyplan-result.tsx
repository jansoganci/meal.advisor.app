import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {
  DayMealCard,
  WeeklyActionsCard,
  WeeklyOverviewCard
} from '@/components/weeklyplan/result';
import { useAuth } from '@/contexts/AuthContext';
import { validateWeeklyPlanResponse } from '@/lib/validation';

interface Meal {
  name: string;
  calories: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface DayPlan {
  dayName: string;
  meals: Meal[];
  totalCalories: number;
}

interface WeeklyPlan {
  overview: {
    avgCalories: number;
    avgProtein: number;
    estimatedCost: number;
  };
  days: DayPlan[];
}

export default function WeeklyPlanResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Parse the actual AI response from params
      if (params.plan) {
        const parsedPlan = JSON.parse(params.plan as string);
        
        // Validate the AI response
        const validation = validateWeeklyPlanResponse(parsedPlan);
        if (!validation.isValid) {
          console.error('WeeklyPlan validation failed:', validation.errors);
          setError('Invalid weekly plan data received. Please try generating a new plan.');
          return;
        }
        
        setWeeklyPlan(parsedPlan);
      } else {
        setError('No weekly plan data received.');
      }
    } catch (error) {
      console.error('Error parsing WeeklyPlan results:', error);
      setError('Failed to load weekly plan. Please try generating a new plan.');
      Alert.alert(
        'Error Loading Plan', 
        'Failed to load weekly plan. Please try generating a new plan.',
        [
          { text: 'Go Back', onPress: () => router.back() },
          { text: 'Try Again', onPress: () => router.back() }
        ]
      );
    } finally {
      setLoading(false);
    }
  }, [params.plan]);

  const handleBackPress = () => {
    router.back();
  };

  const handleRegenerate = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'Please sign in to regenerate the plan.');
      return;
    }

    setRegenerating(true);
    
    try {
      // TODO: We would need to store the original preferences to regenerate
      // For now, just navigate back to the input screen
      Alert.alert(
        'Regenerate Plan',
        'To create a new plan, please go back and adjust your preferences.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go Back', onPress: () => router.back() }
        ]
      );
      
    } catch (err: any) {
      console.error('Error regenerating plan:', err);
      Alert.alert('Regeneration Failed', 'Plan creation failed. Please try again.');
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ThemedText style={styles.backButtonText}>← Back</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.title}>Your Weekly Plan</ThemedText>
        </ThemedView>
        <ThemedView style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Loading your weekly plan...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

    if (error || !weeklyPlan) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ThemedText style={styles.backButtonText}>← Back</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.title}>Your Weekly Plan</ThemedText>
        </ThemedView>
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorIcon}>⚠️</ThemedText>
          <ThemedText style={styles.errorTitle}>Unable to Load Plan</ThemedText>
          <ThemedText style={styles.errorText}>
            {error || 'No plan data available'}
          </ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={handleBackPress}>
            <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ThemedText style={styles.backButtonText}>← Back</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.title}>Your Weekly Plan</ThemedText>
      </ThemedView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <WeeklyOverviewCard
          avgCalories={weeklyPlan.overview.avgCalories}
          avgProtein={weeklyPlan.overview.avgProtein}
          estimatedCost={weeklyPlan.overview.estimatedCost}
        />

        {weeklyPlan.days.map((day, index) => (
          <DayMealCard
            key={index}
            dayName={day.dayName}
            meals={day.meals}
            totalCalories={day.totalCalories}
          />
        ))}

        <WeeklyActionsCard
          onRegenerate={handleRegenerate}
          loading={regenerating}
        />

        <ThemedView style={styles.bottomPadding} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 47,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF6B35',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  retryButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  bottomPadding: {
    height: 100,
  },
}); 