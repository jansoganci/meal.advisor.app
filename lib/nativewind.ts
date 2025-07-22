import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Styled components with NativeWind
export const StyledView = View;
export const StyledText = Text;
export const StyledTouchableOpacity = TouchableOpacity;
export const StyledTextInput = TextInput;
export const StyledScrollView = ScrollView;
export const StyledSafeAreaView = SafeAreaView;
export const StyledImage = Image;

// Utility functions for consistent styling
export const getCardClasses = (variant: 'default' | 'elevated' | 'outlined' = 'default') => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-2xl';
  
  switch (variant) {
    case 'elevated':
      return `${baseClasses} shadow-card`;
    case 'outlined':
      return `${baseClasses} border border-gray-200 dark:border-gray-700`;
    default:
      return `${baseClasses} shadow-card border border-gray-200 dark:border-gray-700`;
  }
};

export const getButtonClasses = (variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary') => {
  const baseClasses = 'font-semibold py-3 px-6 rounded-xl active:scale-95 transition-transform duration-100';
  
  switch (variant) {
    case 'primary':
      return `${baseClasses} bg-primary-600 text-white shadow-sm active:bg-primary-700`;
    case 'secondary':
      return `${baseClasses} bg-secondary-100 text-secondary-900 border border-secondary-200 active:bg-secondary-200`;
    case 'outline':
      return `${baseClasses} border-2 border-primary-600 text-primary-600 active:bg-primary-50`;
    case 'ghost':
      return `${baseClasses} text-primary-600 active:bg-primary-50`;
    default:
      return `${baseClasses} bg-primary-600 text-white shadow-sm active:bg-primary-700`;
  }
};

export const getInputClasses = (error: boolean = false) => {
  const baseClasses = 'bg-white dark:bg-gray-800 border rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400';
  
  if (error) {
    return `${baseClasses} border-error-500 focus:border-error-500 focus:ring-error-500`;
  }
  
  return `${baseClasses} border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500`;
};

export const getTextClasses = (variant: 'heading' | 'body' | 'caption' | 'label' = 'body') => {
  const baseClasses = 'text-gray-900 dark:text-gray-100';
  
  switch (variant) {
    case 'heading':
      return `${baseClasses} font-bold`;
    case 'body':
      return `${baseClasses} text-gray-700 dark:text-gray-300`;
    case 'caption':
      return `${baseClasses} text-gray-500 dark:text-gray-400 text-sm`;
    case 'label':
      return `${baseClasses} font-medium`;
    default:
      return `${baseClasses} text-gray-700 dark:text-gray-300`;
  }
};

// Common spacing utilities
export const spacing = {
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
  '2xl': 'p-12',
} as const;

export const margin = {
  xs: 'm-2',
  sm: 'm-3',
  md: 'm-4',
  lg: 'm-6',
  xl: 'm-8',
  '2xl': 'm-12',
} as const;

// Screen size utilities
export const screenPadding = {
  horizontal: 'px-6',
  vertical: 'py-6',
  all: 'p-6',
} as const;