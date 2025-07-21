import React from 'react'
import { View, ViewProps } from 'react-native'
import { styled } from 'nativewind'

// Styled components
const StyledView = styled(View)

export interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  children: React.ReactNode
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  rounded = 'lg',
  children,
  className = '',
  ...props
}) => {
  // Base styles
  const baseStyles = ['bg-white']

  // Variant styles
  const variantStyles = {
    default: ['bg-white'],
    elevated: ['bg-white shadow-lg shadow-gray-200/50'],
    outlined: ['bg-white border border-gray-200'],
    ghost: ['bg-transparent']
  }

  // Padding styles
  const paddingStyles = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  }

  // Rounded styles
  const roundedStyles = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  }

  const cardClasses = [
    ...baseStyles,
    ...variantStyles[variant],
    paddingStyles[padding],
    roundedStyles[rounded],
    className
  ].filter(Boolean).join(' ')

  return (
    <StyledView className={cardClasses} {...props}>
      {children}
    </StyledView>
  )
}

export default Card