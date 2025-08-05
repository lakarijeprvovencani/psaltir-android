import React from 'react';
import { Text, TextProps } from 'react-native';
import { useResponsiveText } from '../hooks/useResponsiveText';

interface ResponsiveTitleProps extends TextProps {
  children: React.ReactNode;
  baseFontSize?: number;
  minFontSize?: number;
  maxFontSize?: number;
  minScale?: number;
  maxScale?: number;
  fontWeight?: string;
  letterSpacing?: number;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  color?: string;
  style?: any;
}

export const ResponsiveTitle: React.FC<ResponsiveTitleProps> = ({
  children,
  baseFontSize = 32,
  minFontSize,
  maxFontSize,
  minScale = 0.6,
  maxScale = 1.2,
  fontWeight = 'bold',
  letterSpacing = 2,
  textAlign = 'center',
  color,
  style,
  ...props
}) => {
  const { responsiveTextStyle } = useResponsiveText({
    baseFontSize,
    minFontSize,
    maxFontSize,
    minScale,
    maxScale
  });

  return (
    <Text
      style={[
        {
          fontWeight,
          letterSpacing,
          textAlign,
          color,
          flexShrink: 1,
          width: '100%',
          includeFontPadding: false,
        },
        responsiveTextStyle,
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}; 