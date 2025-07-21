import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { UserProfile } from '@/types/profile'

interface SettingsCardProps {
  profile: UserProfile | null
  onSignOut: () => void
  isSigningOut: boolean
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  profile,
  onSignOut,
  isSigningOut,
}) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const settingsItems = [
    {
      icon: '🌱',
      title: 'Diet Preferences',
      subtitle: 'Manage your dietary restrictions',
      onPress: () => {
        // TODO: Navigate to diet preferences
      },
    },
    {
      icon: '🌍',
      title: 'Language',
      subtitle: profile?.language || 'English',
      onPress: () => {
        // TODO: Navigate to language settings
      },
    },
    {
      icon: '🔔',
      title: 'Notifications',
      subtitle: 'Meal reminders and updates',
      onPress: () => {
        // TODO: Navigate to notification settings
      },
    },
    {
      icon: '📧',
      title: 'Contact Support',
      subtitle: 'Get help with the app',
      onPress: () => {
        // TODO: Open contact support
      },
    },
    {
      icon: '📋',
      title: 'Privacy Policy',
      subtitle: 'Learn about data protection',
      onPress: () => {
        // TODO: Open privacy policy
      },
    },
  ]

  return (
    <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}>
      <Text style={[styles.title, { color: colors.text }]}>⚙️ Settings</Text>
      
      <View style={styles.settingsContainer}>
        {settingsItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.settingItem,
              {
                borderBottomColor: colors.tabIconDefault,
                borderBottomWidth: index < settingsItems.length - 1 ? 1 : 0,
              },
            ]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <Text style={styles.settingIcon}>{item.icon}</Text>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                {item.title}
              </Text>
              <Text style={[styles.settingSubtitle, { color: colors.text }]}>
                {item.subtitle}
              </Text>
            </View>
            <Text style={[styles.settingArrow, { color: colors.text }]}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.signOutButton, { borderColor: '#EF4444' }]}
        onPress={onSignOut}
        disabled={isSigningOut}
        activeOpacity={0.7}
      >
        <Text style={[styles.signOutText, { color: '#EF4444' }]}>
          {isSigningOut ? 'Signing Out...' : '🚪 Sign Out'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingsContainer: {
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  settingArrow: {
    fontSize: 20,
    opacity: 0.5,
  },
  signOutButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
  },
})