import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface ProfileCardProps {
  name?: string
  email?: string
  avatar?: string
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name = 'Alex Chen',
  email = 'alex@email.com',
  avatar = '👤'
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{avatar}</Text>
      </View>
      
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    fontSize: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666666',
  },
}) 