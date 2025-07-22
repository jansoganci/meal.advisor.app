import { StyledText, StyledView } from '@/lib/nativewind'
import React from 'react'
import { ViewProps } from 'react-native'

// Styled components
// const StyledView = styled(View)
// const StyledText = styled(Text)

export interface BadgeProps extends ViewProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
  children: React.ReactNode
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  rounded = false,
  children,
  className = '',
  ...props
}) => {
  // Base styles
  const baseStyles = ['inline-flex items-center justify-center']

  // Variant styles
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-emerald-100 text-emerald-800',
    secondary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  }

  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }

  // Rounded styles
  const roundedStyles = rounded ? 'rounded-full' : 'rounded-md'

  const badgeClasses = [
    ...baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    roundedStyles,
    className
  ].filter(Boolean).join(' ')

  return (
    <StyledView className={badgeClasses} {...props}>
      <StyledText className="font-medium">
        {children}
      </StyledText>
    </StyledView>
  )
}

export default Badge