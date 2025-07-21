import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { styled } from 'nativewind'
import { Card, Typography, Button } from '../ui'

// Styled components
const StyledView = styled(View)
const StyledTouchableOpacity = styled(TouchableOpacity)

export interface Card4Props {
  title: string
  description: string
  status: 'success' | 'error' | 'warning' | 'info' | 'neutral'
  icon?: React.ReactNode
  actions?: {
    primary?: {
      text: string
      onPress: () => void
      loading?: boolean
    }
    secondary?: {
      text: string
      onPress: () => void
    }
  }
  dismissible?: {
    onDismiss: () => void
  }
  onPress?: () => void
  className?: string
}

// Card4: Alert/notification card with status, icon, and actions
const Card4: React.FC<Card4Props> = ({
  title,
  description,
  status,
  icon,
  actions,
  dismissible,
  onPress,
  className = ''
}) => {
  const CardContainer = onPress ? StyledTouchableOpacity : StyledView

  // Status styles
  const statusStyles = {
    success: {
      border: 'border-l-4 border-green-500',
      background: 'bg-green-50',
      iconBackground: 'bg-green-100',
      titleColor: 'text-green-800',
      descriptionColor: 'text-green-700'
    },
    error: {
      border: 'border-l-4 border-red-500',
      background: 'bg-red-50',
      iconBackground: 'bg-red-100',
      titleColor: 'text-red-800',
      descriptionColor: 'text-red-700'
    },
    warning: {
      border: 'border-l-4 border-yellow-500',
      background: 'bg-yellow-50',
      iconBackground: 'bg-yellow-100',
      titleColor: 'text-yellow-800',
      descriptionColor: 'text-yellow-700'
    },
    info: {
      border: 'border-l-4 border-blue-500',
      background: 'bg-blue-50',
      iconBackground: 'bg-blue-100',
      titleColor: 'text-blue-800',
      descriptionColor: 'text-blue-700'
    },
    neutral: {
      border: 'border-l-4 border-gray-500',
      background: 'bg-gray-50',
      iconBackground: 'bg-gray-100',
      titleColor: 'text-gray-800',
      descriptionColor: 'text-gray-700'
    }
  }

  const currentStyles = statusStyles[status]

  return (
    <CardContainer
      className={`${className}`}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Card 
        variant="outlined" 
        padding="none" 
        className={`${currentStyles.border} ${currentStyles.background}`}
      >
        <StyledView className="p-4">
          {/* Header */}
          <StyledView className="flex-row items-start justify-between mb-2">
            <StyledView className="flex-row items-start flex-1">
              {/* Icon */}
              {icon && (
                <StyledView className={`w-10 h-10 rounded-full ${currentStyles.iconBackground} items-center justify-center mr-3`}>
                  {icon}
                </StyledView>
              )}
              
              {/* Content */}
              <StyledView className="flex-1">
                <Typography 
                  variant="h6" 
                  className={`${currentStyles.titleColor} mb-1`}
                >
                  {title}
                </Typography>
                <Typography 
                  variant="body2" 
                  className={currentStyles.descriptionColor}
                >
                  {description}
                </Typography>
              </StyledView>
            </StyledView>

            {/* Dismiss button */}
            {dismissible && (
              <StyledTouchableOpacity
                onPress={dismissible.onDismiss}
                className="w-6 h-6 items-center justify-center ml-2"
                activeOpacity={0.7}
              >
                <Typography variant="h6" className="text-gray-500">
                  ×
                </Typography>
              </StyledTouchableOpacity>
            )}
          </StyledView>

          {/* Actions */}
          {actions && (
            <StyledView className="flex-row space-x-2 mt-3">
              {actions.primary && (
                <Button
                  variant="primary"
                  size="sm"
                  onPress={actions.primary.onPress}
                  loading={actions.primary.loading}
                  className="flex-1"
                >
                  {actions.primary.text}
                </Button>
              )}
              {actions.secondary && (
                <Button
                  variant="outline"
                  size="sm"
                  onPress={actions.secondary.onPress}
                  className="flex-1"
                >
                  {actions.secondary.text}
                </Button>
              )}
            </StyledView>
          )}
        </StyledView>
      </Card>
    </CardContainer>
  )
}

export default Card4