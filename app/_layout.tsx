import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { ThemeProvider, useTheme } from '../src/contexts/ThemeContext';
import { FavoritesProvider } from '../src/contexts/FavoritesContext';
import { AudioProvider } from '../src/contexts/AudioContext';
import { ActivityProvider } from '../src/contexts/ActivityContext';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function RootLayoutContent() {
  useFrameworkReady();
  const { isLightMode } = useTheme();
  const [showPermissions, setShowPermissions] = useState<boolean | null>(null);

  // Check if permissions screen should be shown
  useEffect(() => {
    checkPermissionsStatus();
  }, []);

  const checkPermissionsStatus = async () => {
    try {
      console.log('🔍 Checking permissions status...');
      const permissionsData = await AsyncStorage.getItem('@psalter_permissions_shown');
      if (permissionsData) {
        const permissions = JSON.parse(permissionsData);
        console.log('✅ Permissions already shown, going to main app');
        setShowPermissions(false); // Already shown, go to main app
      } else {
        console.log('📱 Permissions not shown, will show permissions screen');
        setShowPermissions(true); // Show permissions screen
      }
    } catch (error) {
      console.error('❌ Error checking permissions status:', error);
      setShowPermissions(false); // Default to main app on error
    }
  };

  // Don't render anything until we check permissions
  if (showPermissions === null) {
    console.log('⏳ showPermissions is null, waiting...');
    return null;
  }

  console.log('🎯 Rendering with showPermissions:', showPermissions);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {showPermissions ? (
          <Stack.Screen name="permissions" />
        ) : (
          <>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="psalter" />
            <Stack.Screen name="prayerbook" />
            <Stack.Screen name="reminders" />
            <Stack.Screen name="favorites" />
            <Stack.Screen name="support" />
            <Stack.Screen name="kathisma/[id]" />
            <Stack.Screen name="prayers/[category]" />
            <Stack.Screen name="psalm/[id]" />
            <Stack.Screen name="akatist/[id]" />
            <Stack.Screen name="about" />
            <Stack.Screen name="terms" />
            <Stack.Screen name="privacy" />
            <Stack.Screen name="+not-found" />
          </>
        )}
      </Stack>
      <StatusBar 
        style={isLightMode ? "dark" : "light"} 
        backgroundColor={isLightMode ? "#FFFFFF" : "#0C0C0C"} 
      />
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <FavoritesProvider>
            <AudioProvider>
              <ActivityProvider>
                <RootLayoutContent />
              </ActivityProvider>
            </AudioProvider>
          </FavoritesProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}