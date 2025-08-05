import { useWindowDimensions, Platform } from 'react-native';

export const useResponsiveLayout = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Breakpoints for different screen sizes
  const isSmallScreen = screenWidth < 375; // iPhone SE, iPhone 13 mini
  const isMediumScreen = screenWidth >= 375 && screenWidth < 414; // iPhone 12, 13, 14
  const isLargeScreen = screenWidth >= 414; // iPhone 14 Plus, Android tablets

  // Responsive font sizes
  const getFontSize = (baseSize: number, smallMultiplier = 0.8, mediumMultiplier = 0.9) => {
    if (isSmallScreen) return baseSize * smallMultiplier;
    if (isMediumScreen) return baseSize * mediumMultiplier;
    return baseSize;
  };

  // Responsive spacing
  const getSpacing = (baseSpacing: number, smallMultiplier = 0.7, mediumMultiplier = 0.85) => {
    if (isSmallScreen) return baseSpacing * smallMultiplier;
    if (isMediumScreen) return baseSpacing * mediumMultiplier;
    return baseSpacing;
  };

  // Responsive padding
  const getPadding = (basePadding: number) => {
    if (isSmallScreen) return basePadding * 0.6;
    if (isMediumScreen) return basePadding * 0.8;
    return basePadding;
  };

  // Safe area adjustments
  const getSafeAreaPadding = () => {
    const basePadding = 20;
    return {
      paddingHorizontal: getPadding(basePadding),
      paddingTop: Platform.OS === 'ios' ? getPadding(10) : getPadding(20),
      paddingBottom: getPadding(10),
    };
  };

  return {
    screenWidth,
    screenHeight,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    getFontSize,
    getSpacing,
    getPadding,
    getSafeAreaPadding,
  };
}; 