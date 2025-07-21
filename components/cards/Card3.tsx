import React from 'react'
import { View, TouchableOpacity, ScrollView } from 'react-native'
import { styled } from 'nativewind'
import { Card, Typography, Badge, Button } from '../ui'

// Styled components
const StyledView = styled(View)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledScrollView = styled(ScrollView)

export interface Card3Props {
  title: string
  description?: string
  items: Array<{
    id: string
    name: string
    value?: string | number
    status?: 'active' | 'inactive' | 'pending' | 'completed'
    badge?: {
      text: string
      variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
    }
    onPress?: () => void
  }>
  showAll?: {
    text: string
    onPress: () => void
  }
  maxItems?: number
  horizontal?: boolean
  onPress?: () => void
  className?: string
}

// Card3: List card with scrollable items
const Card3: React.FC<Card3Props> = ({
  title,
  description,
  items,
  showAll,
  maxItems = 5,
  horizontal = false,
  onPress,
  className = ''
}) => {
  const CardContainer = onPress ? StyledTouchableOpacity : StyledView
  const displayItems = items.slice(0, maxItems)

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'default'
      case 'pending': return 'warning'
      case 'completed': return 'success'
      default: return 'default'
    }
  }

  return (
    <CardContainer
      className={`${className}`}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Card variant="elevated" padding="lg">
        {/* Header */}
        <StyledView className="mb-4">
          <Typography variant="h5" className="mb-1">
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="secondary">
              {description}
            </Typography>
          )}
        </StyledView>

        {/* Items */}
        {horizontal ? (
          <StyledScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            <StyledView className="flex-row space-x-3">
              {displayItems.map((item, index) => (
                <StyledTouchableOpacity
                  key={item.id}
                  className="w-32 p-3 bg-gray-50 rounded-lg"
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <Typography variant="body2" className="mb-1" numberOfLines={1}>
                    {item.name}
                  </Typography>
                  {item.value && (
                    <Typography variant="caption" color="secondary">
                      {item.value}
                    </Typography>
                  )}
                  {item.badge && (
                    <StyledView className="mt-1">
                      <Badge variant={item.badge.variant} size="sm" rounded>
                        {item.badge.text}
                      </Badge>
                    </StyledView>
                  )}
                </StyledTouchableOpacity>
              ))}
            </StyledView>
          </StyledScrollView>
        ) : (
          <StyledView className="space-y-3 mb-4">
            {displayItems.map((item, index) => (
              <StyledTouchableOpacity
                key={item.id}
                className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg"
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <StyledView className="flex-1">
                  <Typography variant="body2" className="mb-1">
                    {item.name}
                  </Typography>
                  {item.value && (
                    <Typography variant="caption" color="secondary">
                      {item.value}
                    </Typography>
                  )}
                </StyledView>
                
                <StyledView className="flex-row items-center space-x-2">
                  {item.badge && (
                    <Badge variant={item.badge.variant} size="sm" rounded>
                      {item.badge.text}
                    </Badge>
                  )}
                  {item.status && (
                    <StyledView className={`w-2 h-2 rounded-full ${
                      item.status === 'active' ? 'bg-green-500' :
                      item.status === 'inactive' ? 'bg-gray-400' :
                      item.status === 'pending' ? 'bg-yellow-500' :
                      item.status === 'completed' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  )}
                </StyledView>
              </StyledTouchableOpacity>
            ))}
          </StyledView>
        )}

        {/* Show All Button */}
        {showAll && items.length > maxItems && (
          <Button
            variant="ghost"
            size="sm"
            onPress={showAll.onPress}
            className="self-start"
          >
            {showAll.text}
          </Button>
        )}
      </Card>
    </CardContainer>
  )
}

export default Card3