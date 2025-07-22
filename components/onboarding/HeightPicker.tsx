import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { Picker } from '@react-native-picker/picker'
import React, { useState } from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface HeightPickerProps {
  value: number
  onValueChange: (height: number) => void
}

export const HeightPicker: React.FC<HeightPickerProps> = ({ value, onValueChange }) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  const [modalVisible, setModalVisible] = useState(false)
  const [tempValue, setTempValue] = useState(value)

  // Generate heights from 140cm to 220cm
  const heights = Array.from({ length: 81 }, (_, i) => i + 140)

  const formatHeight = (cm: number) => {
    const feet = Math.floor(cm / 30.48)
    const inches = Math.round((cm - feet * 30.48) / 2.54)
    return `${cm}cm (${feet}'${inches}")`
  }

  const handleConfirm = () => {
    onValueChange(tempValue)
    setModalVisible(false)
  }

  const handleCancel = () => {
    setTempValue(value)
    setModalVisible(false)
  }

  const displayText = value > 0 ? formatHeight(value) : 'Select your height'

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>📏 Height</Text>
      <TouchableOpacity
        style={[styles.pickerContainer, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}
        onPress={() => {
          setTempValue(value || 170)
          setModalVisible(true)
        }}
        activeOpacity={0.7}
      >
        <Text style={[styles.pickerText, { color: value > 0 ? colors.text : colors.tabIconDefault }]}>
          {displayText}
        </Text>
        <Text style={[styles.chevron, { color: colors.tabIconDefault }]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleCancel} style={styles.modalButton}>
                <Text style={[styles.modalButtonText, { color: colors.tint }]}>Cancel</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Height</Text>
              <TouchableOpacity onPress={handleConfirm} style={styles.modalButton}>
                <Text style={[styles.modalButtonText, { color: colors.tint }]}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={tempValue}
                onValueChange={setTempValue}
                style={[styles.modalPicker, { color: colors.text }]}
                itemStyle={{ color: colors.text }}
              >
                {heights.map((height) => (
                  <Picker.Item key={height} label={formatHeight(height)} value={height} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerText: {
    fontSize: 16,
    flex: 1,
  },
  chevron: {
    fontSize: 12,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalButton: {
    minWidth: 60,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  pickerWrapper: {
    height: 200,
  },
  modalPicker: {
    height: 200,
  },
})