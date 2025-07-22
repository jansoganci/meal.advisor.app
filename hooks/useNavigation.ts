import { NavigationService, Routes } from '@/lib/navigation';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import { useCallback } from 'react';

// Enhanced navigation hook with utilities
export function useAppNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useLocalSearchParams();

  // Navigate with analytics tracking
  const navigateWithTracking = useCallback((route: string) => {
    NavigationService.navigate(route as any);
    // Track navigation event
    console.log(`Navigation: ${pathname} -> ${route}`);
  }, [pathname]);

  // Go back with safety check
  const goBack = useCallback(() => {
    if (NavigationService.canGoBack()) {
      NavigationService.goBack();
    } else {
      // Fallback to home if can't go back
      NavigationService.goHome();
    }
  }, []);

  // Navigate to specific sections
  const navigation = {
    // Auth navigation
    goToLogin: () => navigateWithTracking(Routes.LOGIN),
    goToOnboarding: () => navigateWithTracking(Routes.ONBOARDING_STEP_1),
    
    // Main navigation
    goHome: () => navigateWithTracking(Routes.HOME),
    goToExplore: () => navigateWithTracking(Routes.EXPLORE),
    goToFavorites: () => navigateWithTracking(Routes.FAVORITES),
    goToProfile: () => navigateWithTracking(Routes.PROFILE),
    
    // Profile navigation
    goToEditProfile: () => navigateWithTracking(Routes.EDIT_PROFILE),
    
    // Recipe navigation
    goToRecipe: (recipeId: string) => navigateWithTracking(`${Routes.RECIPE_DETAIL}/${recipeId}`),
    
    // Planning navigation
    goToMealPlanning: () => navigateWithTracking(Routes.MEAL_PLANNING),
    
    // Utility navigation
    goBack,
    replace: (route: string) => router.replace(route as any),
    canGoBack: () => NavigationService.canGoBack(),
  };

  return {
    ...navigation,
    navigateWithTracking,
    currentRoute: pathname,
    searchParams,
    isCurrentRoute: (route: string) => pathname === route,
    isInSection: (section: string) => pathname.startsWith(section),
  };
}

// Hook for getting current route information
export function useCurrentRoute() {
  const pathname = usePathname();
  const searchParams = useLocalSearchParams();

  const getRouteInfo = useCallback(() => {
    const segments = pathname.split('/').filter(Boolean);
    const isTabRoute = segments.includes('(tabs)');
    const isOnboardingRoute = segments.includes('(onboarding)');
    const isAuthRoute = pathname === Routes.LOGIN;
    
    return {
      pathname,
      segments,
      isTabRoute,
      isOnboardingRoute,
      isAuthRoute,
      isHomeRoute: pathname === Routes.HOME,
      isProfileRoute: pathname.startsWith('/profile'),
      isRecipeRoute: pathname.startsWith('/recipe'),
    };
  }, [pathname]);

  return {
    ...getRouteInfo(),
    currentRoute: pathname,
    searchParams,
  };
}

// Hook for navigation state management
export function useNavigationState() {
  const { currentRoute } = useCurrentRoute();
  
  // This could be enhanced with a context provider for global state
  return {
    currentRoute,
    isNavigating: false, // This would come from a navigation context
    canGoBack: NavigationService.canGoBack(),
  };
}

// Hook for handling deep links
export function useDeepLinking() {
  const { navigateWithTracking } = useAppNavigation();
  
  const handleDeepLink = useCallback((url: string) => {
    try {
      const parsedUrl = new URL(url);
      const path = parsedUrl.pathname;
      
      // Handle different deep link patterns
      if (path.startsWith('/recipe/')) {
        const recipeId = path.split('/')[2];
        navigateWithTracking(`${Routes.RECIPE_DETAIL}/${recipeId}`);
      } else if (path === '/profile') {
        navigateWithTracking(Routes.PROFILE);
      } else if (path === '/onboarding') {
        navigateWithTracking(Routes.ONBOARDING_STEP_1);
      } else {
        navigateWithTracking(Routes.HOME);
      }
    } catch (error) {
      console.error('Deep link parsing error:', error);
      navigateWithTracking(Routes.HOME);
    }
  }, [navigateWithTracking]);

  return {
    handleDeepLink,
  };
}