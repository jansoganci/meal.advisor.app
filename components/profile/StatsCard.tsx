import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface StatsCardProps {
  meals?: number
  favorites?: number
  weeks?: number
  rating?: number
}

export const StatsCard: React.FC<StatsCardProps> = ({
  meals = 127,
  favorites = 32,
  weeks = 12,
  rating = 4.8
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Your Stats</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🍽️</Text>
          <Text style={styles.statValue}>{meals}</Text>
          <Text style={styles.statLabel}>meals</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>❤️</Text>
          <Text style={styles.statValue}>{favorites}</Text>
          <Text style={styles.statLabel}>favorites</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>📅</Text>
          <Text style={styles.statValue}>{weeks}</Text>
          <Text style={styles.statLabel}>weeks</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={styles.statValue}>{rating}</Text>
          <Text style={styles.statLabel}>rating</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'lowercase',
  },
}) 