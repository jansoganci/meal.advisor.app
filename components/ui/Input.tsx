import { StyledText, StyledTextInput, StyledView } from '@/lib/nativewind'
import React, { useState } from 'react'
import {
  TextInputProps
} from 'react-native'

// Styled components
// const StyledView = styled(View)
// const StyledTextInput = styled(TextInput)
// const StyledText = styled(Text)
// const StyledTouchableOpacity = styled(TouchableOpacity)

export interface InputProps extends TextInputProps {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'filled' | 'underlined'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  required?: boolean
  containerClassName?: string
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'md',
  disabled = false,
  required = false,
  containerClassName = '',
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)

  // Base container styles
  const containerStyles = [
    'w-full',
    containerClassName
  ]

  // Label styles
  const labelStyles = [
    'text-gray-700 font-medium mb-1',
    size === 'sm' && 'text-sm',
    size === 'md' && 'text-base',
    size === 'lg' && 'text-lg',
    disabled && 'text-gray-400'
  ]

  // Input container styles
  const inputContainerStyles = {
    default: [
      'flex-row items-center border rounded-xl bg-white',
      error ? 'border-red-500' : 
      isFocused ? 'border-emerald-500' : 'border-gray-300',
      disabled && 'bg-gray-50'
    ],
    filled: [
      'flex-row items-center bg-gray-100 rounded-xl',
      error ? 'border border-red-500' : 
      isFocused ? 'border border-emerald-500' : 'border border-transparent',
      disabled && 'bg-gray-50'
    ],
    underlined: [
      'flex-row items-center border-b-2 bg-transparent',
      error ? 'border-red-500' : 
      isFocused ? 'border-emerald-500' : 'border-gray-300',
      disabled && 'border-gray-200'
    ]
  }

  // Input size styles
  const inputSizeStyles = {
    sm: 'px-3 py-2 min-h-[36px]',
    md: 'px-4 py-3 min-h-[44px]',
    lg: 'px-5 py-4 min-h-[52px]'
  }

  // Input text styles
  const inputTextStyles = [
    'flex-1 text-gray-900',
    size === 'sm' && 'text-sm',
    size === 'md' && 'text-base',
    size === 'lg' && 'text-lg',
    disabled && 'text-gray-400'
  ]

  // Error and helper text styles
  const helperTextStyles = [
    'mt-1 text-sm',
    error ? 'text-red-500' : 'text-gray-500'
  ]

  const inputContainerClasses = [
    ...inputContainerStyles[variant],
    inputSizeStyles[size]
  ].filter(Boolean).join(' ')

  const inputTextClasses = inputTextStyles.filter(Boolean).join(' ')

  return (
    <StyledView className={containerStyles.join(' ')}>
      {/* Label */}
      {label && (
        <StyledText className={labelStyles.filter(Boolean).join(' ')}>
          {label}
          {required && <StyledText className="text-red-500 ml-1">*</StyledText>}
        </StyledText>
      )}
      
      {/* Input Container */}
      <StyledView className={inputContainerClasses}>
        {/* Left Icon */}
        {leftIcon && (
          <StyledView className="mr-3">
            {leftIcon}
          </StyledView>
        )}
        
        {/* Text Input */}
        <StyledTextInput
          className={`${inputTextClasses} ${className}`}
          placeholderTextColor={disabled ? '#9CA3AF' : '#6B7280'}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {/* Right Icon */}
        {rightIcon && (
          <StyledView className="ml-3">
            {rightIcon}
          </StyledView>
        )}
      </StyledView>
      
      {/* Helper Text or Error */}
      {(error || helperText) && (
        <StyledText className={helperTextStyles.filter(Boolean).join(' ')}>
          {error || helperText}
        </StyledText>
      )}
    </StyledView>
  )
}

export default Input