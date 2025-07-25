import { AppSettingsCard, PersonalInfoCard, ProfileCard, StatsCard } from '@/components/profile'
import { Colors } from '@/constants/Colors'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ProfileScreen() {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.light.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: Colors.light.text }]}>👤 Profile</Text>
        </View>

        <View style={styles.content}>
          <ProfileCard />
          <StatsCard />
          <PersonalInfoCard />
          <AppSettingsCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 20,
  },
})