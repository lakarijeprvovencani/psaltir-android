export const colors = {
  dark: {
    // Backgrounds
    primary: '#0C0C0C',
    secondary: '#1A1A1A',
    tertiary: '#2A2A2A',
    
    // Text colors
    primaryText: '#FFFFFF',
    secondaryText: '#CCCCCC',
    tertiaryText: '#888888',
    
    // Accent colors
    accentGold: '#D4AF37',
    accentGoldDark: '#B8941F',
    accentRed: '#812430',
    accentRedDark: '#5C1A1B',
    accentRedLight: '#8B2635',
    
    // UI elements
    cardBackground: '#1A1A1A',
    borderColor: '#812430',
    shadowColor: '#812430',
    tabBackground: '#0C0C0C',
    
    // Status
    success: '#4A5D23',
    warning: '#B8941F',
    error: '#8B2635',
    info: '#2D5AA0',
  },
  light: {
    // Backgrounds
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    tertiary: '#E8E8E8',
    
    // Text colors
    primaryText: '#1A1A1A',
    secondaryText: '#4A4A4A',
    tertiaryText: '#666666',
    
    // Accent colors (keeping the gold theme but adjusted for light mode)
    accentGold: '#B8941F',
    accentGoldDark: '#9A7A1A',
    accentRed: '#A0344A',
    accentRedDark: '#7A2838',
    accentRedLight: '#B8394F',
    
    // UI elements
    cardBackground: '#FFFFFF',
    borderColor: '#A0344A',
    shadowColor: '#A0344A',
    tabBackground: '#FFFFFF',
    
    // Status
    success: '#5A7D2A',
    warning: '#C8A429',
    error: '#B8394F',
    info: '#3D6AB0',
  }
};

export type ColorScheme = typeof colors.dark;