import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  // Create a properly typed object with optional properties
  const colorProps: { light?: string; dark?: string } = {};
  if (lightColor !== undefined) colorProps.light = lightColor;
  if (darkColor !== undefined) colorProps.dark = darkColor;
  
  const backgroundColor = useThemeColor(colorProps, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
