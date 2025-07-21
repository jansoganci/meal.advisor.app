import { router } from 'expo-router';
import { Href } from 'expo-router/build/link/href';

// Navigation utilities for consistent routing
export class NavigationService {
  // Navigate to a route with proper typing
  static navigate(href: Href) {
    router.push(href);
  }

  // Replace current route
  static replace(href: Href) {
    router.replace(href);
  }

  // Go back in navigation stack
  static goBack() {
    if (router.canGoBack()) {
      router.back();
    }
  }

  // Navigate to home screen
  static goHome() {
    router.replace('/(tabs)/');
  }

  // Navigate to onboarding
  static goToOnboarding() {
    router.replace('/(onboarding)/step1');
  }

  // Navigate to welcome screen
  static goToWelcome() {
    router.replace('/welcome');
  }

  // Navigate to profile editing
  static goToEditProfile() {
    router.push('/profile/edit');
  }

  // Navigate to recipe details
  static goToRecipe(recipeId: string) {
    router.push(`/recipe/${recipeId}`);
  }

  // Navigate to meal planning
  static goToMealPlanning() {
    router.push('/planning');
  }

  // Navigate to favorites
  static goToFavorites() {
    router.push('/(tabs)/favorites');
  }

  // Navigate to specific tab
  static goToTab(tab: 'index' | 'explore' | 'favorites' | 'profile') {
    router.push(`/(tabs)/${tab}`);
  }

  // Check if we can go back
  static canGoBack(): boolean {
    return router.canGoBack();
  }

  // Get current route segments
  static getCurrentSegments() {
    // This would need to be implemented based on current route
    // For now, return empty array
    return [];
  }
}

// Deep linking utilities
export class DeepLinkService {
  // Handle deep links based on URL scheme
  static handleDeepLink(url: string) {
    const { hostname, pathname } = new URL(url);
    
    switch (hostname) {
      case 'recipe':
        if (pathname) {
          NavigationService.goToRecipe(pathname.substring(1));
        }
        break;
      case 'profile':
        NavigationService.goToTab('profile');
        break;
      case 'onboarding':
        NavigationService.goToOnboarding();
        break;
      default:
        NavigationService.goHome();
    }
  }

  // Generate deep link URL
  static generateDeepLink(path: string): string {
    return `mealadvisor://${path}`;
  }
}

// Route constants for consistent navigation
export const Routes = {
  // Auth routes
  WELCOME: '/welcome',
  
  // Onboarding routes
  ONBOARDING_STEP_1: '/(onboarding)/step1',
  ONBOARDING_STEP_2: '/(onboarding)/step2',
  ONBOARDING_STEP_3: '/(onboarding)/step3',
  ONBOARDING_STEP_4: '/(onboarding)/step4',
  
  // Main app routes
  HOME: '/(tabs)/',
  EXPLORE: '/(tabs)/explore',
  FAVORITES: '/(tabs)/favorites',
  PROFILE: '/(tabs)/profile',
  
  // Profile routes
  EDIT_PROFILE: '/profile/edit',
  
  // Recipe routes
  RECIPE_DETAIL: '/recipe',
  
  // Planning routes
  MEAL_PLANNING: '/planning',
  
  // Settings routes
  SETTINGS: '/settings',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
} as const;

// Type definitions for routes
export type AppRoutes = typeof Routes[keyof typeof Routes];

// Navigation state management
export interface NavigationState {
  currentRoute: string;
  previousRoute: string | null;
  isNavigating: boolean;
}

// Navigation guards
export class NavigationGuard {
  // Check if user is authenticated
  static async requireAuth(): Promise<boolean> {
    // This would integrate with your auth context
    // For now, return true
    return true;
  }

  // Check if user has completed onboarding
  static async requireOnboarding(): Promise<boolean> {
    // This would integrate with your profile context
    // For now, return true
    return true;
  }

  // Check if user has premium access
  static async requirePremium(): Promise<boolean> {
    // This would integrate with your subscription context
    // For now, return true
    return true;
  }
}

// Navigation analytics
export class NavigationAnalytics {
  // Track screen views
  static trackScreenView(screenName: string) {
    // This would integrate with your analytics service
    console.log(`Screen viewed: ${screenName}`);
  }

  // Track navigation events
  static trackNavigation(from: string, to: string) {
    // This would integrate with your analytics service
    console.log(`Navigation: ${from} -> ${to}`);
  }
}