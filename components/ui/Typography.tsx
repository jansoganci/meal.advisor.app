import { StyledText } from '@/lib/nativewind'
import React from 'react'
import { TextProps } from 'react-native'

// Styled components
// const StyledText = styled(Text)

export interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline'
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'default'
  weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
  align?: 'left' | 'center' | 'right' | 'justify'
  underline?: boolean
  italic?: boolean
  children: React.ReactNode
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  color = 'default',
  weight,
  align = 'left',
  underline = false,
  italic = false,
  children,
  className = '',
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    h1: 'text-4xl font-bold leading-tight',
    h2: 'text-3xl font-bold leading-tight',
    h3: 'text-2xl font-bold leading-tight',
    h4: 'text-xl font-semibold leading-tight',
    h5: 'text-lg font-semibold leading-tight',
    h6: 'text-base font-semibold leading-tight',
    body1: 'text-base leading-relaxed',
    body2: 'text-sm leading-relaxed',
    caption: 'text-xs leading-normal',
    overline: 'text-xs font-medium uppercase tracking-wide leading-normal'
  }

  // Color styles
  const colorStyles = {
    primary: 'text-emerald-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    default: 'text-gray-900'
  }

  // Weight styles
  const weightStyles = {
    thin: 'font-thin',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
    black: 'font-black'
  }

  // Align styles
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  }

  // Additional styles
  const additionalStyles = [
    underline && 'underline',
    italic && 'italic'
  ]

  const textClasses = [
    variantStyles[variant],
    colorStyles[color],
    weight && weightStyles[weight],
    alignStyles[align],
    ...additionalStyles,
    className
  ].filter(Boolean).join(' ')

  return (
    <StyledText className={textClasses} {...props}>
      {children}
    </StyledText>
  )
}

// Convenient component variants
export const Heading1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h1" {...props} />
)

export const Heading2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h2" {...props} />
)

export const Heading3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h3" {...props} />
)

export const Heading4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h4" {...props} />
)

export const Heading5: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h5" {...props} />
)

export const Heading6: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h6" {...props} />
)

export const Body1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body1" {...props} />
)

export const Body2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body2" {...props} />
)

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" {...props} />
)

export const Overline: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="overline" {...props} />
)

export default Typography