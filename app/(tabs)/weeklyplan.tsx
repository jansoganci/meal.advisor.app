import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {
  CuisineCard,
  GoalsCard,
  MealsCard,
  NutritionCard,
  PlanFocusCard
} from '@/components/weeklyplan/selection';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { edgeAIService } from '@/lib/ai/edge-service';
import {
  type ValidationError,
  validateWeeklyPlanPreferences
} from '@/lib/validation';

interface WeeklyPlanPreferences {
  goal: string;
  meals: string[];
  cuisines: string[];
  planFocus: string;
  calories?: number;
  protein?: number;
}

export default function WeeklyPlanScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useProfile();
  
  const [preferences, setPreferences] = useState<WeeklyPlanPreferences>({
    goal: 'Maintain',
    meals: ['Breakfast', 'Lunch', 'Dinner'],
    cuisines: [],
    planFocus: 'Quick & Easy'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const handleGoalChange = (value: string) => {
    setPreferences(prev => ({ ...prev, goal: value }));
    // Clear validation errors for this field
    setValidationErrors(prev => prev.filter(error => error.field !== 'goal'));
  };

  const handleMealsChange = (value: string[]) => {
    setPreferences(prev => ({ ...prev, meals: value }));
    // Clear validation errors for this field
    setValidationErrors(prev => prev.filter(error => error.field !== 'meals'));
  };

  const handleCuisinesChange = (value: string[]) => {
    setPreferences(prev => ({ ...prev, cuisines: value }));
    // Clear validation errors for this field
    setValidationErrors(prev => prev.filter(error => error.field !== 'cuisines'));
  };

  const handlePlanFocusChange = (value: string) => {
    setPreferences(prev => ({ ...prev, planFocus: value }));
    // Clear validation errors for this field
    setValidationErrors(prev => prev.filter(error => error.field !== 'planFocus'));
  };

  const handleCaloriesChange = (value: number) => {
    setPreferences(prev => ({ ...prev, calories: value }));
    // Clear validation errors for this field
    setValidationErrors(prev => prev.filter(error => error.field !== 'calories'));
  };

  const handleProteinChange = (value: number) => {
    setPreferences(prev => ({ ...prev, protein: value }));
    // Clear validation errors for this field
    setValidationErrors(prev => prev.filter(error => error.field !== 'protein'));
  };

  const handleBackPress = () => {
    router.back();
  };

  const validateForm = (): boolean => {
    console.log('DEBUG: WeeklyPlan validation input:', preferences);
    const validation = validateWeeklyPlanPreferences(preferences);
    setValidationErrors(validation.errors);
    console.log('DEBUG: WeeklyPlan validation errors:', validation.errors);
    return validation.isValid;
  };

  const getFieldError = (field: string): string | null => {
    const error = validationErrors.find(err => err.field === field);
    return error ? error.message : null;
  };

  const handleGenerateWeeklyPlan = async () => {
    console.log('DEBUG: WeeklyPlan form state', preferences);

    if (!user?.id) {
      Alert.alert('Error', 'Please sign in to create a weekly plan.');
      return;
    }

    // Validate form before proceeding
    if (!validateForm()) {
      console.log('DEBUG: WeeklyPlan validation FAILED, errors:', validationErrors);
      setError('Please fix the errors above before continuing.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call the Edge AI service with user preferences
      const response = await edgeAIService.generateWeeklyPlan(preferences);
      
      // Navigate to results screen with data
      router.push({
        pathname: '/weeklyplan-result',
        params: {
          plan: JSON.stringify(response)
        }
      });

    } catch (err: any) {
      console.error('Error generating weekly plan:', err);
      
      if (err.message.includes('limit reached')) {
        setError('Weekly plan limit reached. Please upgrade to premium or try again later.');
      } else if (err.message.includes('sign in')) {
        setError('Please sign in to create a weekly plan.');
      } else {
        setError('Plan creation failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = loading || preferences.meals.length === 0;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ThemedText style={styles.backButtonText}>← Back</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.title}>🗓️ Weekly Plan</ThemedText>
        <ThemedText style={styles.subtitle}>
          Quick & personalized meal planning
        </ThemedText>
      </ThemedView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <GoalsCard
          value={preferences.goal}
          onChange={handleGoalChange}
          defaultValue="Maintain"
          error={getFieldError('goal')}
        />

        <MealsCard
          value={preferences.meals}
          onChange={handleMealsChange}
          defaultValue={['Breakfast', 'Lunch', 'Dinner']}
          error={getFieldError('meals')}
        />

        <CuisineCard
          value={preferences.cuisines}
          onChange={handleCuisinesChange}
          defaultValue={[]}
          error={getFieldError('cuisines')}
        />

        <PlanFocusCard
          value={preferences.planFocus}
          onChange={handlePlanFocusChange}
          defaultValue="Quick & Easy"
          error={getFieldError('planFocus')}
        />

        <NutritionCard
          profileCalories={profile?.daily_calories ?? null}
          profileProtein={profile?.daily_protein_g ?? null}
          {...(preferences.calories !== undefined && { calories: preferences.calories })}
          {...(preferences.protein !== undefined && { protein: preferences.protein })}
          onCaloriesChange={handleCaloriesChange}
          onProteinChange={handleProteinChange}
          error={getFieldError('calories') || getFieldError('protein')}
        />

        <ThemedView style={styles.ctaContainer}>
          <TouchableOpacity 
            style={[
              styles.ctaButton,
              isButtonDisabled && styles.ctaButtonDisabled
            ]} 
            onPress={handleGenerateWeeklyPlan}
            disabled={isButtonDisabled}
          >
            <ThemedText style={[
              styles.ctaText,
              isButtonDisabled && styles.ctaTextDisabled
            ]}>
              {loading ? 'Generating... 📅' : 'Generate Weekly Plan 📅'}
            </ThemedText>
          </TouchableOpacity>
          
          {error && (
            <ThemedView style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>
                {error}
              </ThemedText>
              {error.includes('limit reached') && (
                <TouchableOpacity 
                  style={styles.upgradeButton}
                  onPress={() => {
                    // TODO: Navigate to premium upgrade screen
                    console.log('Navigate to premium upgrade');
                  }}
                >
                  <ThemedText style={styles.upgradeButtonText}>
                    Upgrade to Premium
                  </ThemedText>
                </TouchableOpacity>
              )}
              {!error.includes('limit reached') && (
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={handleGenerateWeeklyPlan}
                >
                  <ThemedText style={styles.retryButtonText}>
                    Try Again
                  </ThemedText>
                </TouchableOpacity>
              )}
            </ThemedView>
          )}
        </ThemedView>
        <ThemedView style={styles.bottomPadding} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FF6B35',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  ctaContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ctaButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  ctaTextDisabled: {
    color: '#666',
  },
  errorContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FFE6E6',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF4444',
  },
  errorText: {
    color: '#CC0000',
    fontSize: 14,
    marginBottom: 12,
  },
  upgradeButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 20,
  },
}); 