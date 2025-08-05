import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bell, Mic, Shield, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../src/contexts/ThemeContext';
import { useAudio } from '../src/contexts/AudioContext';

const PERMISSIONS_STORAGE_KEY = '@psalter_permissions_shown';

export default function PermissionsScreen() {
  const router = useRouter();
  const { currentColors } = useTheme();
  const { initializeAudio } = useAudio();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleAllowPermissions = async () => {
    setIsRequesting(true);
    
    try {
      console.log('🔐 Requesting permissions...');
      
      // Request notification permissions
      const notificationStatus = await Notifications.requestPermissionsAsync();
      console.log('📱 Notification permission status:', notificationStatus.status);
      
      // Request microphone permissions using the correct API
      const audioStatus = await Audio.requestPermissionsAsync();
      console.log('🎤 Audio permission status:', audioStatus.status);
      
      // Save permissions status
      await AsyncStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify({
        notifications: notificationStatus.status === 'granted',
        microphone: audioStatus.status === 'granted',
        shown: true
      }));
      
      console.log('✅ Permissions saved, initializing audio...');
      
      // Initialize audio context after permissions are granted
      await initializeAudio();
      
      console.log('✅ Audio initialized, navigating to main app');
      
      // Navigate to main app
      router.replace('/(tabs)');
      
    } catch (error) {
      console.error('❌ Error requesting permissions:', error);
      Alert.alert(
        'Грешка',
        'Дошло је до грешке при тражењу дозвола. Можете их касније омогућити у подешавањима.'
      );
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSkip = async () => {
    try {
      // Save that permissions were shown but not granted
      await AsyncStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify({
        notifications: false,
        microphone: false,
        shown: true
      }));
      
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving permission state:', error);
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.primary }]}>
      <LinearGradient
        colors={[currentColors.secondary, currentColors.tertiary]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: currentColors.accentGold }]}>
              <Shield size={32} color={currentColors.primary} />
            </View>
            <Text style={[styles.title, { color: currentColors.primaryText }]}>
              Дозволе за апликацију
            </Text>
            <Text style={[styles.subtitle, { color: currentColors.secondaryText }]}>
              Да бисте користили све функције
            </Text>
          </View>

          {/* Permissions Info */}
          <View style={[styles.permissionsCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
            <Text style={[styles.description, { color: currentColors.secondaryText }]}>
              Да бисте користили све функције апликације (дневни подсетници, аудио садржаји), потребно је да омогућите обавештења и микрофон.
            </Text>
            
            {/* Notification Permission */}
            <View style={styles.permissionItem}>
              <View style={[styles.permissionIcon, { backgroundColor: currentColors.accentGold }]}>
                <Bell size={20} color={currentColors.primary} />
              </View>
              <View style={styles.permissionText}>
                <Text style={[styles.permissionTitle, { color: currentColors.primaryText }]}>
                  Обавештења
                </Text>
                <Text style={[styles.permissionDescription, { color: currentColors.tertiaryText }]}>
                  Дневни подсетници за молитве
                </Text>
              </View>
            </View>

            {/* Microphone Permission */}
            <View style={styles.permissionItem}>
              <View style={[styles.permissionIcon, { backgroundColor: currentColors.accentGold }]}>
                <Mic size={20} color={currentColors.primary} />
              </View>
              <View style={styles.permissionText}>
                <Text style={[styles.permissionTitle, { color: currentColors.primaryText }]}>
                  Микрофон
                </Text>
                <Text style={[styles.permissionDescription, { color: currentColors.tertiaryText }]}>
                  Аудио садржаји и музика
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.allowButton, { backgroundColor: currentColors.accentGold }]}
              onPress={handleAllowPermissions}
              disabled={isRequesting}
            >
              <Text style={[styles.allowButtonText, { color: currentColors.primary }]}>
                {isRequesting ? 'Тражим дозволе...' : 'Дозволи сада'}
              </Text>
              <ArrowRight size={20} color={currentColors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.skipButton, { borderColor: currentColors.borderColor }]}
              onPress={handleSkip}
              disabled={isRequesting}
            >
              <Text style={[styles.skipButtonText, { color: currentColors.secondaryText }]}>
                Касније
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Note */}
          <Text style={[styles.footerNote, { color: currentColors.tertiaryText }]}>
            Можете их касније омогућити у подешавањима апликације
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  permissionsCard: {
    borderRadius: 15,
    padding: 25,
    marginBottom: 30,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 25,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  permissionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  permissionText: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
  },
  actionsContainer: {
    width: '100%',
    gap: 15,
    marginBottom: 20,
  },
  allowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 10,
  },
  allowButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footerNote: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 