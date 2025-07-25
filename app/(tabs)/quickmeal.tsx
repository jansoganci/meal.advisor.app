import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {
  BudgetCard,
  CuisineCard,
  DietCard,
  MoodCard,
  ServingCard,
  TimeCard
} from '@/components/quickmeal';
import { useAuth } from '@/contexts/AuthContext';
import { edgeAIService } from '@/lib/ai/edge-service';
import {
  type ValidationError,
  validateQuickMealPreferences
} from '@/lib/validation';

interface QuickMealPreferences {
  servings: number;
  prepTime: string;
  diet: string;
  cuisine: string;
  mood: string;
  budget: string;
}



export default function QuickMealScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [preferences, setPreferences] = useState<QuickMealPreferences>({
    servings: 1,
    prepTime: '30-45',
    diet: 'None',
    cuisine: 'Any',
    mood: 'Quick',
    budget: 'Any'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const handlePreferenceChange = (key: keyof QuickMealPreferences, value: string | number) => {
    console.log('DEBUG:', key, 'selected', value);
    setPreferences(prev => ({ ...prev, [key]: value }));
    
    // Clear validation errors for this field
    setValidationErrors(prev => prev.filter(error => error.field !== key));
  };

  const validateForm = (): boolean => {
    console.log('DEBUG: Validation input:', preferences);
    const validation = validateQuickMealPreferences(preferences);
    setValidationErrors(validation.errors);
    console.log('DEBUG: Validation errors:', validation.errors);
    return validation.isValid;
  };

  const getFieldError = (field: string): string | null => {
    const error = validationErrors.find(err => err.field === field);
    return error ? error.message : null;
  };

  const handleGetQuickMeal = async () => {
    console.log('DEBUG: QuickMeal form state', {
      servings: preferences.servings,
      prepTime: preferences.prepTime,
      diet: preferences.diet,
      cuisine: preferences.cuisine,
      mood: preferences.mood,
      budget: preferences.budget
    });

    if (!user?.id) {
      Alert.alert('Error', 'Please sign in to use QuickMeal.');
      return;
    }

    // Validate form before proceeding
    if (!validateForm()) {
      console.log('DEBUG: Form validation FAILED, errors:', validationErrors);
      setError('Please fix the errors above before continuing.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call the Edge AI service with user preferences
      const response = await edgeAIService.generateQuickMealSuggestions(preferences);
      
      // Navigate to results screen with data
      router.push({
        pathname: '/quickmeal-result',
        params: {
          suggestions: JSON.stringify(response.suggestions),
          mealPrepIdeas: JSON.stringify(response.mealPrepIdeas),
          timeSavingTips: JSON.stringify(response.timeSavingTips),
          budgetTips: JSON.stringify(response.budgetTips),
          nutritionNotes: JSON.stringify(response.nutritionNotes),
          customizations: JSON.stringify(response.customizations)
        }
      });

    } catch (err: any) {
      console.error('QuickMeal error:', err);
      
      let errorMessage = 'Unable to generate suggestions. Please try again.';
      let showRetry = true;
      
      // Handle specific error types from Edge Function
      if (err.message?.includes('quota') || err.message?.includes('limit')) {
        errorMessage = 'Daily limit reached. Please try again tomorrow or upgrade to premium for unlimited access.';
        showRetry = false;
      } else if (err.message?.includes('unauthorized') || err.message?.includes('401')) {
        errorMessage = 'Please sign in to use QuickMeal.';
        showRetry = false;
      } else if (err.message?.includes('unavailable') || err.message?.includes('503')) {
        errorMessage = 'Service temporarily unavailable. Please try again in a moment.';
      } else if (err.message?.includes('timeout') || err.message?.includes('timed out')) {
        errorMessage = 'Request timed out. Please try again.';
      } else if (err.message?.includes('network') || err.message?.includes('connection')) {
        errorMessage = 'No internet connection. Please check your connection and try again.';
      }
      
      setError(errorMessage);
      
      Alert.alert(
        'Error', 
        errorMessage,
        showRetry ? [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: handleGetQuickMeal }
        ] : [
          { text: 'OK', style: 'default' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const isButtonDisabled = loading;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ThemedText style={styles.backButtonText}>← Back</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.title}>🍽️ Quick Meal</ThemedText>
        <ThemedText style={styles.subtitle}>
          Let's find you something tasty!
        </ThemedText>
        

      </ThemedView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ServingCard
          value={preferences.servings}
          onChange={(value: number) => handlePreferenceChange('servings', value)}
          defaultValue={1}
          error={getFieldError('servings')}
        />

        <TimeCard
          value={preferences.prepTime}
          onChange={(value: string) => handlePreferenceChange('prepTime', value)}
          defaultValue="30-45"
          error={getFieldError('prepTime')}
        />

        <DietCard
          value={preferences.diet}
          onChange={(value: string) => handlePreferenceChange('diet', value)}
          defaultValue="None"
          error={getFieldError('diet')}
        />

        <CuisineCard
          value={preferences.cuisine}
          onChange={(value: string) => handlePreferenceChange('cuisine', value)}
          defaultValue="Any"
          error={getFieldError('cuisine')}
        />

        <MoodCard
          value={preferences.mood}
          onChange={(value: string) => handlePreferenceChange('mood', value)}
          defaultValue="Quick"
          error={getFieldError('mood')}
        />

        <BudgetCard
          value={preferences.budget}
          onChange={(value: string) => handlePreferenceChange('budget', value)}
          defaultValue="Any"
          error={getFieldError('budget')}
        />

        <ThemedView style={styles.ctaContainer}>
          <TouchableOpacity 
            style={[
              styles.ctaButton,
              isButtonDisabled && styles.ctaButtonDisabled
            ]} 
            onPress={handleGetQuickMeal}
            disabled={isButtonDisabled}
          >
            <ThemedText style={[
              styles.ctaText,
              isButtonDisabled && styles.ctaTextDisabled
            ]}>
              {loading ? 'Generating... 🍽️' : 'Get My Quick Meal 🍽️'}
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
                  onPress={handleGetQuickMeal}
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
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  ctaContainer: {
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  ctaButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ctaButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  ctaTextDisabled: {
    color: '#888',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
  quotaContainer: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  quotaText: {
    fontSize: 14,
    fontWeight: '500',
  },
  premiumText: {
    color: '#28a745', // Green for premium
  },
  freemiumText: {
    color: '#FF6B35', // Orange for freemium
  },
  bottomPadding: {
    height: 100,
  },
  errorContainer: {
    marginTop: 15,
  },
  upgradeButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  retryButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
}); 