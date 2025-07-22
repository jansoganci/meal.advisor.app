import { StyledText, StyledView } from '@/lib/nativewind'
import React from 'react'
import {
    ActivityIndicator,
    ViewProps
} from 'react-native'

// Styled components
// const StyledView = styled(View)
// const StyledText = styled(Text)

export interface LoadingSpinnerProps extends ViewProps {
  size?: 'small' | 'large'
  color?: string
  text?: string
  overlay?: boolean
  variant?: 'default' | 'centered' | 'inline'
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#059669', // emerald-600
  text = 'Loading...',
  overlay = false,
  variant = 'default',
  className = '',
  ...props
}) => {
  // Base styles
  const baseStyles = ['flex items-center justify-center']

  // Variant styles
  const variantStyles = {
    default: ['p-4'],
    centered: ['flex-1 p-4'],
    inline: ['flex-row space-x-2 p-2']
  }

  // Overlay styles
  const overlayStyles = overlay ? [
    'absolute inset-0 bg-white/80 z-50'
  ] : []

  const containerClasses = [
    ...baseStyles,
    ...variantStyles[variant],
    ...overlayStyles,
    className
  ].filter(Boolean).join(' ')

  const textClasses = [
    'text-gray-600 font-medium',
    variant === 'inline' ? 'text-sm' : 'text-base mt-2'
  ].filter(Boolean).join(' ')

  return (
    <StyledView className={containerClasses} {...props}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <StyledText className={textClasses}>
          {text}
        </StyledText>
      )}
    </StyledView>
  )
}

export default LoadingSpinner