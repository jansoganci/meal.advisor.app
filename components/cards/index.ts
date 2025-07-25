// Card Components - Main export file
export { default as Card1 } from './Card1'
export { default as Card2 } from './Card2'
export { default as Card3 } from './Card3'
export { default as Card4 } from './Card4'
export { default as Card5 } from './Card5'

// Home Screen Cards - Import from home directory
export * from './home'

// Export types
export type { Card1Props } from './Card1'
export type { Card2Props } from './Card2'
export type { Card3Props } from './Card3'
export type { Card4Props } from './Card4'
export type { Card5Props } from './Card5'

// Card usage guide:
// - Card1: Basic content card with image, title, description, and actions
// - Card2: Statistics/metrics card with icon, title, value, and change indicator
// - Card3: List card with scrollable items (vertical or horizontal)
// - Card4: Alert/notification card with status, icon, and actions
// - Card5: Detailed content card with image, metadata, tags, and actions
// - Home cards: See ./home directory for home screen specific cards