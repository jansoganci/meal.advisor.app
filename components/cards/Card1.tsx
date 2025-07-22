import { StyledImage, StyledTouchableOpacity, StyledView } from '@/lib/nativewind'
import React from 'react'
import { Badge, Button, Card, Typography } from '../ui'

// Styled components
// const StyledView = styled(View)
// const StyledTouchableOpacity = styled(TouchableOpacity)
// const StyledImage = styled(Image)

export interface Card1Props {
  title: string
  description: string
  imageUrl?: string
  badge?: {
    text: string
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  }
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
  onPress?: () => void
  className?: string
}

// Card1: Basic content card with image, title, description, and actions
const Card1: React.FC<Card1Props> = ({
  title,
  description,
  imageUrl,
  badge,
  actions,
  onPress,
  className = ''
}) => {
  const CardContainer = onPress ? StyledTouchableOpacity : StyledView

  return (
    <CardContainer
      className={`${className}`}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Card variant="elevated" padding="none" className="overflow-hidden">
        {/* Image */}
        {imageUrl && (
          <StyledView className="relative">
            <StyledImage
              source={{ uri: imageUrl }}
              className="w-full h-48"
              resizeMode="cover"
            />
            {/* Badge overlay */}
            {badge && (
              <StyledView className="absolute top-3 right-3">
                <Badge variant={badge.variant || 'default'} size="sm" rounded>
                  {badge.text}
                </Badge>
              </StyledView>
            )}
          </StyledView>
        )}

        {/* Content */}
        <StyledView className="p-4">
          {/* Title */}
          <Typography variant="h5" className="mb-2">
            {title}
          </Typography>

          {/* Description */}
          <Typography variant="body2" color="secondary" className="mb-4">
            {description}
          </Typography>

          {/* Actions */}
          {actions && (
            <StyledView className="flex-row space-x-2">
              {actions.primary && (
                <Button
                  variant="primary"
                  size="sm"
                  onPress={actions.primary.onPress}
                  loading={actions.primary.loading || false}
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

export default Card1