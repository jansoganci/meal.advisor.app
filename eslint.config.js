// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      'dist/*',
      'node_modules/*',
      '.expo/*',
      'ios/*',
      'android/*',
      'web-build/*',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      'react-hooks': require('eslint-plugin-react-hooks'),
      'react-native': require('eslint-plugin-react-native'),
      'import': require('eslint-plugin-import'),
      'jsx-a11y': require('eslint-plugin-jsx-a11y'),
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-const': 'error',
      
      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // React Native specific rules
      'react-native/no-unused-styles': 'error',
      'react-native/split-platform-components': 'error',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'warn',
      'react-native/no-raw-text': 'off', // Can be too strict for simple text
      
      // Import rules
      'import/order': ['error', {
        'groups': [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'never',
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true,
        },
      }],
      'import/no-duplicates': 'error',
      'import/no-unused-modules': 'warn',
      
      // Accessibility rules
      'jsx-a11y/accessible-emoji': 'warn',
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-has-content': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      
      // General JavaScript rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      
      // React specific rules
      'react/jsx-uses-react': 'off', // Not needed with new JSX transform
      'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'react/jsx-fragments': ['error', 'syntax'],
      'react/jsx-no-useless-fragment': 'warn',
      
      // Performance rules
      'react/jsx-no-bind': 'warn',
      'react/no-array-index-key': 'warn',
      
      // Style rules (will be handled by Prettier)
      'comma-dangle': 'off',
      'semi': 'off',
      'quotes': 'off',
      'indent': 'off',
      'max-len': 'off',
    },
    settings: {
      'import/resolver': {
        'typescript': {
          'project': './tsconfig.json',
        },
      },
      'react': {
        'version': 'detect',
      },
    },
  },
]);
