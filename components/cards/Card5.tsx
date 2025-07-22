import { StyledImage, StyledTouchableOpacity, StyledView } from '@/lib/nativewind'
import React from 'react'
import { Badge, Button, Card, Typography } from '../ui'

// Styled components
// const StyledView = styled(View)
// const StyledTouchableOpacity = styled(TouchableOpacity)
// const StyledImage = styled(Image)

export interface Card5Props {
  title: string
  subtitle?: string
  description?: string
  imageUrl?: string
  tags?: string[]
  metadata?: Array<{
    label: string
    value: string | number
    icon?: React.ReactNode
  }>
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
  favorite?: {
    isFavorite: boolean
    onToggle: () => void
  }
  onPress?: () => void
  className?: string
}

// Card5: Detailed content card with image, metadata, tags, and actions
const Card5: React.FC<Card5Props> = ({
  title,
  subtitle,
  description,
  imageUrl,
  tags = [],
  metadata = [],
  actions,
  favorite,
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
              className="w-full h-32"
              resizeMode="cover"
            />
            {/* Favorite button */}
            {favorite && (
              <StyledTouchableOpacity
                className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full items-center justify-center"
                onPress={favorite.onToggle}
                activeOpacity={0.7}
              >
                <Typography variant="body2" className={favorite.isFavorite ? 'text-red-500' : 'text-gray-400'}>
                  ♥
                </Typography>
              </StyledTouchableOpacity>
            )}
          </StyledView>
        )}

        {/* Content */}
        <StyledView className="p-4">
          {/* Title and Subtitle */}
          <StyledView className="mb-2">
            <Typography variant="h6" className="mb-1">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="secondary">
                {subtitle}
              </Typography>
            )}
          </StyledView>

          {/* Description */}
          {description && (
            <Typography variant="body2" color="secondary" className="mb-3">
              {description}
            </Typography>
          )}

          {/* Metadata */}
          {metadata.length > 0 && (
            <StyledView className="flex-row flex-wrap mb-3">
              {metadata.map((item, index) => (
                <StyledView key={index} className="flex-row items-center mr-4 mb-1">
                  {item.icon && (
                    <StyledView className="mr-1">
                      {item.icon}
                    </StyledView>
                  )}
                  <Typography variant="caption" color="secondary">
                    {item.label}: {item.value}
                  </Typography>
                </StyledView>
              ))}
            </StyledView>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <StyledView className="flex-row flex-wrap mb-3">
              {tags.map((tag, index) => (
                <Badge 
                  key={index}
                  variant="default" 
                  size="sm" 
                  rounded
                  className="mr-1 mb-1"
                >
                  {tag}
                </Badge>
              ))}
            </StyledView>
          )}

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

export default Card5