import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface GreetingCardProps {
  userName?: string;
  greeting?: string;
}

export function GreetingCard({ userName = 'Alex', greeting }: GreetingCardProps) {
  const getGreeting = () => {
    if (greeting) return greeting;
    
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.greeting}>
        {getGreeting()}, {userName}!
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