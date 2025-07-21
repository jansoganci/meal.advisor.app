# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm install` - Install dependencies
- `npm start` - Start Expo development server
- `npm run android` - Start Android emulator
- `npm run ios` - Start iOS simulator
- `npm run web` - Start web version
- `npm run lint` - Run ESLint
- `npm run reset-project` - Reset project to blank state

### Development Workflow
- Use `expo start` to start the development server
- Use Expo Go app for quick testing on device
- Project uses Expo SDK ~53.0.17 with React Native 0.79.5

## Project Architecture

### Technology Stack
- **Framework:** Expo (React Native) with TypeScript
- **Navigation:** Expo Router v5 (file-based routing)
- **Styling:** Custom themed components with React Native's built-in styling
- **State Management:** React Context API (built-in)
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **AI Integration:** Deepseek API (primary), Google Gemini (fallback)

### Folder Structure
```
app/                    # Expo Router screens (file-based routing)
  (tabs)/              # Tab navigation screens
    index.tsx          # Home screen
    explore.tsx        # Explore screen
    _layout.tsx        # Tab layout configuration
  _layout.tsx          # Root layout
  +not-found.tsx       # 404 screen
components/            # Reusable UI components
  ui/                  # Basic UI components (IconSymbol, TabBarBackground)
  Collapsible.tsx      # Collapsible component
  ThemedText.tsx       # Themed text component
  ThemedView.tsx       # Themed view component
constants/             # App constants (Colors, etc.)
hooks/                 # Custom React hooks (useColorScheme, useThemeColor)
assets/               # Images, fonts, and other assets
docs/                 # Project documentation
  blueprint.md         # Detailed MVP blueprint
  prd.md              # Product requirements document
  tech-spec.md        # Technical specifications
```

### Key Architecture Patterns
- **File-based routing:** Uses Expo Router v5 with app/ directory structure
- **Theming:** Built-in light/dark theme support with custom Colors constants
- **Component organization:** Themed components (ThemedText, ThemedView) for consistent styling
- **Navigation:** Tab-based navigation with custom HapticTab component
- **Path aliases:** Uses `@/*` for imports (configured in tsconfig.json)

### Application Context
This is **MealAdvisor** - an AI-powered meal planning iOS app that:
- Generates personalized meal plans and recipes
- Creates shopping lists automatically
- Tracks nutrition goals
- Supports 14 languages (i18n)
- Uses AI for meal recommendations (Deepseek API primary, Gemini fallback)
- Stores user data in Supabase (PostgreSQL with RLS)

### MVP Scope (1-month target)
- Onboarding flow with user preferences
- AI-powered weekly meal planning
- Shopping list generation
- Recipe favorites system
- Legal compliance (GDPR/KVKK)
- Multi-language support

### Important Development Notes
- All environment variables must be prefixed with `EXPO_PUBLIC_` for client access
- Project uses TypeScript with strict mode enabled
- Custom themed components should be used for consistent styling
- AI API calls should include proper error handling and fallback mechanisms
- All user data operations must respect Supabase Row Level Security (RLS)

### Testing and Quality
- ESLint configuration is set up for code quality
- Project uses Expo's built-in linting with `expo lint`
- TypeScript strict mode is enabled for better type safety