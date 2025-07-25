import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export const AppSettingsCard: React.FC = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>App Settings</Text>
      
      <View style={styles.settingsList}>
        <View style={styles.settingRow}>
          <Text style={styles.settingIcon}>🌐</Text>
          <Text style={styles.settingLabel}>Language</Text>
          <Text style={styles.arrowIcon}>›</Text>
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingIcon}>🔔</Text>
          <Text style={styles.settingLabel}>Notifications</Text>
          <Text style={styles.arrowIcon}>›</Text>
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingIcon}>⭐</Text>
          <Text style={styles.settingLabel}>Rate App</Text>
          <Text style={styles.arrowIcon}>›</Text>
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingIcon}>📧</Text>
          <Text style={styles.settingLabel}>Contact Support</Text>
          <Text style={styles.arrowIcon}>›</Text>
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingIcon}>📋</Text>
          <Text style={styles.settingLabel}>Privacy Policy</Text>
          <Text style={styles.arrowIcon}>›</Text>
        </View>
        
        <View style={[styles.settingRow, styles.signOutRow]}>
          <Text style={styles.settingIcon}>🚪</Text>
          <Text style={[styles.settingLabel, styles.signOutText]}>Sign Out</Text>
          <Text style={styles.arrowIcon}>›</Text>
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
  settingsList: {
    gap: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#1A1A1A',
    flex: 1,
  },
  arrowIcon: {
    fontSize: 18,
    color: '#C7C7CC',
    fontWeight: '300',
  },
  signOutRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  signOutText: {
    color: '#FF3B30',
  },
}) 