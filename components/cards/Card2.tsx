import { StyledTouchableOpacity, StyledView } from '@/lib/nativewind'
import React from 'react'
import { Badge, Card, Typography } from '../ui'

// Styled components
// const StyledView = styled(View)
// const StyledTouchableOpacity = styled(TouchableOpacity)

export interface Card2Props {
  title: string
  subtitle?: string
  value: string | number
  change?: {
    value: string | number
    type: 'increase' | 'decrease' | 'neutral'
  }
  icon?: React.ReactNode
  onPress?: () => void
  className?: string
}

// Card2: Statistics/metrics card with icon, title, value, and change indicator
const Card2: React.FC<Card2Props> = ({
  title,
  subtitle,
  value,
  change,
  icon,
  onPress,
  className = ''
}) => {
  const CardContainer = onPress ? StyledTouchableOpacity : StyledView

  const changeVariant = change?.type === 'increase' ? 'success' : 
                       change?.type === 'decrease' ? 'error' : 'default'

  return (
    <CardContainer
      className={`${className}`}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Card variant="elevated" padding="lg">
        <StyledView className="flex-row items-start justify-between">
          {/* Left side - Content */}
          <StyledView className="flex-1">
            {/* Title */}
            <Typography variant="body2" color="secondary" className="mb-1">
              {title}
            </Typography>

            {/* Value */}
            <Typography variant="h3" className="mb-1">
              {value}
            </Typography>

            {/* Subtitle */}
            {subtitle && (
              <Typography variant="caption" color="secondary">
                {subtitle}
              </Typography>
            )}

            {/* Change indicator */}
            {change && (
              <StyledView className="mt-2">
                <Badge variant={changeVariant} size="sm" rounded>
                  {change.type === 'increase' ? '↑' : change.type === 'decrease' ? '↓' : '→'} {change.value}
                </Badge>
              </StyledView>
            )}
          </StyledView>

          {/* Right side - Icon */}
          {icon && (
            <StyledView className="w-12 h-12 items-center justify-center bg-emerald-100 rounded-full ml-4">
              {icon}
            </StyledView>
          )}
        </StyledView>
      </Card>
    </CardContainer>
  )
}

export default Card2