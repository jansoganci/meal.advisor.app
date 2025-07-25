import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface WeekCalendarCardProps {
  currentDate?: Date;
}

export function WeekCalendarCard({ currentDate = new Date() }: WeekCalendarCardProps) {
  const getWeekDates = () => {
    const today = currentDate;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const weekDates = getWeekDates();
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.calendarRow}>
        {daysOfWeek.map((day, index) => (
          <ThemedView key={index} style={styles.dayColumn}>
            <ThemedText style={styles.dayLabel}>{day}</ThemedText>
            <ThemedText style={styles.dateNumber}>
              {weekDates[index].getDate()}
            </ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 