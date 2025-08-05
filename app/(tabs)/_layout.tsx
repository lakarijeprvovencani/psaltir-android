import { Tabs } from 'expo-router';
import { BookPlus, NotebookPen, Menu } from 'lucide-react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useResponsiveLayout } from '../../src/hooks/useResponsiveLayout';

export default function TabLayout() {
  const { currentColors } = useTheme();
  const { getFontSize, getPadding, isSmallScreen } = useResponsiveLayout();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: currentColors.tabBackground,
          borderTopColor: currentColors.borderColor,
          borderTopWidth: 3,
          height: 70,
          paddingBottom: 4,
          paddingTop: 10,
          marginBottom: 5,
          shadowColor: currentColors.shadowColor,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 6,
        },
        tabBarActiveTintColor: currentColors.accentGold,
        tabBarInactiveTintColor: currentColors.tertiaryText,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Почетна',
          tabBarIcon: ({ size, color }) => (
            <BookPlus size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          title: 'Дневник',
          tabBarIcon: ({ size, color }) => (
            <NotebookPen size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Још',
          tabBarIcon: ({ size, color }) => (
            <Menu size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}