import { useWindowDimensions } from 'react-native';

interface ResponsiveTextConfig {
  baseFontSize: number;
  minFontSize?: number;
  maxFontSize?: number;
  minScale?: number;
  maxScale?: number;
}

export const useResponsiveText = (config: ResponsiveTextConfig) => {
  const { width: screenWidth } = useWindowDimensions();
  
  const {
    baseFontSize,
    minFontSize = baseFontSize * 0.6,
    maxFontSize = baseFontSize * 1.2,
    minScale = 0.6,
    maxScale = 1.2
  } = config;

  // Calculate responsive font size based on screen width
  const getResponsiveFontSize = () => {
    // Base breakpoints for different screen sizes
    const breakpoints = {
      small: 375,   // iPhone SE, iPhone 13 mini
      medium: 414,  // iPhone 13, iPhone 14
      large: 428,   // iPhone 14 Plus, iPhone 13 Pro Max
      xlarge: 500   // Larger devices
    };

    let scale = 1.0;

    if (screenWidth <= breakpoints.small) {
      scale = 0.7; // 30% smaller for small screens
    } else if (screenWidth <= breakpoints.medium) {
      scale = 0.85; // 15% smaller for medium screens
    } else if (screenWidth <= breakpoints.large) {
      scale = 0.95; // 5% smaller for large screens
    } else {
      scale = 1.0; // Full size for extra large screens
    }

    // Apply min/max constraints
    scale = Math.max(minScale, Math.min(maxScale, scale));
    
    const fontSize = Math.max(minFontSize, Math.min(maxFontSize, baseFontSize * scale));
    
    return {
      fontSize,
      adjustsFontSizeToFit: true,
      minimumFontScale: minScale,
      numberOfLines: 1,
      allowFontScaling: true
    };
  };

  return {
    responsiveTextStyle: getResponsiveFontSize(),
    screenWidth,
    baseFontSize
  };
}; 