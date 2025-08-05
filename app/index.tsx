import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, AppState, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useResponsiveLayout } from '../src/hooks/useResponsiveLayout';

export default function WelcomeScreen() {
  const router = useRouter();
  const { getFontSize, getSpacing, getPadding, isSmallScreen } = useResponsiveLayout();
  const [isEntering, setIsEntering] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoRef, setVideoRef] = useState<Video | null>(null);

  // Ensure component is ready before rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Fallback to gradient if video doesn't load within 5 seconds
  useEffect(() => {
    const videoTimeout = setTimeout(() => {
      if (!videoLoaded && !videoError) {
        console.warn('Video loading timeout, falling back to gradient');
        setVideoError(true);
      }
    }, 5000);

    return () => clearTimeout(videoTimeout);
  }, [videoLoaded, videoError]);

  // Cleanup video on unmount and handle app state changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background' && videoRef) {
        // Pause video when app goes to background to save battery
        videoRef.pauseAsync().catch(console.warn);
      } else if (nextAppState === 'active' && videoRef && !videoError) {
        // Resume video when app becomes active
        videoRef.playAsync().catch(console.warn);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
      if (videoRef) {
        videoRef.unloadAsync().catch(console.warn);
      }
    };
  }, [videoRef, videoError]);

  const handleEnter = async () => {
    if (isEntering) return; // Prevent double tap

    setIsEntering(true);
    setTimeout(async () => {
      try {
        // Cleanup video pre navigacije
        if (videoRef) {
          videoRef.unloadAsync().catch(console.warn);
        }
        
        // Check if permissions were shown
        const permissionsData = await AsyncStorage.getItem('@psalter_permissions_shown');
        if (permissionsData) {
          // Permissions were shown, go to main app
          router.replace('/(tabs)');
        } else {
          // Permissions not shown, go to permissions screen
          router.replace('/permissions');
        }
      } catch (error) {
        console.error('Navigation error:', error);
        setIsEntering(false);
      }
    }, 800);
  };

  // Cleanup funkcija za memory management
  useEffect(() => {
    return () => {
      // Cleanup video kada se komponenta unmount-uje
      if (videoRef) {
        videoRef.unloadAsync().catch(console.warn);
      }
    };
  }, [videoRef]);

  if (!isReady) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0C0C0C', '#1A1A1A', '#2A2A2A']}
          style={styles.backgroundVideo}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Temporarily disable video to test */}
      <LinearGradient
        colors={['#0C0C0C', '#1A1A1A', '#2A2A2A']}
        style={styles.backgroundVideo}
      />
      
      {/* Dark overlay for better text readability */}
      <View style={styles.overlay} />
      
      <View style={styles.content}>
        <Text style={styles.title}>ПСАЛТИР</Text>
        <Text style={styles.subtitle}>„Господ је светлост моја и спасење моје." (Пс. 26:1)</Text>
        
        <TouchableOpacity 
          style={[styles.enterButton, isEntering && styles.enterButtonPressed]} 
          onPress={handleEnter}
          disabled={isEntering}
        >
          <LinearGradient
            colors={['#D4AF37', '#B8941F', '#5C1A1B']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.enterButtonText}>
              {isEntering ? 'Улазимо...' : 'Уђи у апликацију'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  // ОВО СУ СТИЛОВИ ЗА ВИДЕО СВЕЋЕ
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 1,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: '#D4AF37',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 2,
    adjustsFontSizeToFit: true,
    minimumFontScale: 0.7,
    numberOfLines: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 60,
    fontStyle: 'italic',
    adjustsFontSizeToFit: true,
    minimumFontScale: 0.8,
  },
  enterButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 12,
    transform: [{ scale: 1 }],
  },
  enterButtonPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  buttonGradient: {
    borderRadius: 23,
    paddingHorizontal: 40,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  enterButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600' as any,
    letterSpacing: 1,
    adjustsFontSizeToFit: true,
    minimumFontScale: 0.8,
    numberOfLines: 1,
  },
});