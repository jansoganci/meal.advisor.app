import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface GreetingCardProps {
  userName?: string | undefined;
  greeting?: string;
}

export function GreetingCard({ userName, greeting }: GreetingCardProps) {
  const getGreeting = () => {
    if (greeting) return greeting;
    
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Extract first name from full name or use email prefix as fallback
  const getDisplayName = () => {
    if (userName) {
      // If full name exists, use first name only
      return userName.split(' ')[0];
    }
    return 'there'; // Default fallback when no name is available
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.greeting}>
        {getGreeting()}, {getDisplayName()}!
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
  },
}); 