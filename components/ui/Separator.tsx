import React from 'react'
import { View, ViewProps } from 'react-native'
import { styled } from 'nativewind'

// Styled components
const StyledView = styled(View)

export interface SeparatorProps extends ViewProps {
  orientation?: 'horizontal' | 'vertical'
  color?: 'default' | 'light' | 'dark'
  thickness?: 'thin' | 'medium' | 'thick'
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

const Separator: React.FC<SeparatorProps> = ({
  orientation = 'horizontal',
  color = 'default',
  thickness = 'thin',
  spacing = 'md',
  className = '',
  ...props
}) => {
  // Color styles
  const colorStyles = {
    default: 'bg-gray-200',
    light: 'bg-gray-100',
    dark: 'bg-gray-400'
  }

  // Thickness styles
  const thicknessStyles = {
    horizontal: {
      thin: 'h-px',
      medium: 'h-0.5',
      thick: 'h-1'
    },
    vertical: {
      thin: 'w-px',
      medium: 'w-0.5',
      thick: 'w-1'
    }
  }

  // Spacing styles
  const spacingStyles = {
    horizontal: {
      none: '',
      sm: 'my-1',
      md: 'my-2',
      lg: 'my-4',
      xl: 'my-6'
    },
    vertical: {
      none: '',
      sm: 'mx-1',
      md: 'mx-2',
      lg: 'mx-4',
      xl: 'mx-6'
    }
  }

  // Dimension styles
  const dimensionStyles = {
    horizontal: 'w-full',
    vertical: 'h-full'
  }

  const separatorClasses = [
    colorStyles[color],
    thicknessStyles[orientation][thickness],
    spacingStyles[orientation][spacing],
    dimensionStyles[orientation],
    className
  ].filter(Boolean).join(' ')

  return (
    <StyledView className={separatorClasses} {...props} />
  )
}

export default Separator