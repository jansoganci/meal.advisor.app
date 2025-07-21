import React from 'react'
import { 
  TouchableOpacity, 
  Text, 
  ActivityIndicator, 
  View,
  TouchableOpacityProps 
} from 'react-native'
import { styled } from 'nativewind'

// Styled components
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledText = styled(Text)
const StyledView = styled(View)

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  children: React.ReactNode
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const isDisabled = disabled || loading

  // Base styles
  const baseStyles = [
    'flex-row items-center justify-center rounded-xl',
    'active:scale-95 transition-transform duration-150',
    fullWidth && 'w-full'
  ]

  // Variant styles
  const variantStyles = {
    primary: [
      'bg-emerald-600 shadow-sm',
      isDisabled ? 'bg-emerald-300' : 'bg-emerald-600 active:bg-emerald-700'
    ],
    secondary: [
      'bg-gray-100 shadow-sm',
      isDisabled ? 'bg-gray-50' : 'bg-gray-100 active:bg-gray-200'
    ],
    outline: [
      'border-2 border-emerald-600 bg-transparent',
      isDisabled ? 'border-emerald-300' : 'border-emerald-600 active:bg-emerald-50'
    ],
    ghost: [
      'bg-transparent',
      isDisabled ? '' : 'active:bg-gray-100'
    ],
    danger: [
      'bg-red-600 shadow-sm',
      isDisabled ? 'bg-red-300' : 'bg-red-600 active:bg-red-700'
    ]
  }

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-2 min-h-[32px]',
    md: 'px-4 py-3 min-h-[44px]',
    lg: 'px-6 py-4 min-h-[52px]'
  }

  // Text styles
  const textStyles = {
    primary: isDisabled ? 'text-white' : 'text-white font-semibold',
    secondary: isDisabled ? 'text-gray-400' : 'text-gray-900 font-semibold',
    outline: isDisabled ? 'text-emerald-300' : 'text-emerald-600 font-semibold',
    ghost: isDisabled ? 'text-gray-400' : 'text-gray-900 font-semibold',
    danger: isDisabled ? 'text-white' : 'text-white font-semibold'
  }

  const textSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const buttonClasses = [
    ...baseStyles,
    ...variantStyles[variant],
    sizeStyles[size],
    className
  ].filter(Boolean).join(' ')

  const textClasses = [
    textStyles[variant],
    textSizeStyles[size]
  ].filter(Boolean).join(' ')

  return (
    <StyledTouchableOpacity
      className={buttonClasses}
      disabled={isDisabled}
      {...props}
    >
      {/* Left Icon */}
      {leftIcon && !loading && (
        <StyledView className="mr-2">
          {leftIcon}
        </StyledView>
      )}
      
      {/* Loading Indicator */}
      {loading && (
        <StyledView className="mr-2">
          <ActivityIndicator 
            size="small" 
            color={
              variant === 'primary' || variant === 'danger' ? 'white' : 
              variant === 'outline' ? '#059669' : '#6B7280'
            }
          />
        </StyledView>
      )}
      
      {/* Button Text */}
      <StyledText className={textClasses}>
        {children}
      </StyledText>
      
      {/* Right Icon */}
      {rightIcon && !loading && (
        <StyledView className="ml-2">
          {rightIcon}
        </StyledView>
      )}
    </StyledTouchableOpacity>
  )
}

export default Button