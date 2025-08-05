import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Sun, Moon, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../src/contexts/ThemeContext';

interface ReminderSettings {
  morningEnabled: boolean;
  eveningEnabled: boolean;
  morningTime: { hour: number; minute: number };
  eveningTime: { hour: number; minute: number };
}

const REMINDERS_STORAGE_KEY = '@psalter_reminders';

export default function RemindersScreen() {
  const router = useRouter();
  const { currentColors } = useTheme();
  const [settings, setSettings] = useState<ReminderSettings>({
    morningEnabled: false,
    eveningEnabled: false,
    morningTime: { hour: 7, minute: 0 },
    eveningTime: { hour: 19, minute: 0 },
  });

  useEffect(() => {
    loadSettings();
    // Cancel any existing notifications on app start to ensure clean state
    cancelAllNotifications();
  }, []);

  const cancelAllNotifications = async () => {
    try {
      await Notifications.cancelScheduledNotificationAsync('morning-prayer');
      await Notifications.cancelScheduledNotificationAsync('morning-prayer_daily');
      await Notifications.cancelScheduledNotificationAsync('evening-prayer');
      await Notifications.cancelScheduledNotificationAsync('evening-prayer_daily');
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(REMINDERS_STORAGE_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        
        // Re-schedule notifications if they were enabled
        if (parsedSettings.morningEnabled) {
          await scheduleNotification(
            'morning-prayer',
            'Јутарња молитва ☀️',
            'Време је за јутарње молитве. Почните дан са Богом.',
            parsedSettings.morningTime.hour,
            parsedSettings.morningTime.minute
          );
        }
        
        if (parsedSettings.eveningEnabled) {
          await scheduleNotification(
            'evening-prayer',
            'Вечерња молитва 🌙',
            'Време је за вечерње молитве. Завршите дан у миру са Богом.',
            parsedSettings.eveningTime.hour,
            parsedSettings.eveningTime.minute
          );
        }
      }
    } catch (error) {
      console.error('Error loading reminder settings:', error);
    }
  };

  const saveSettings = async (newSettings: ReminderSettings) => {
    try {
      await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving reminder settings:', error);
    }
  };

  const scheduleNotification = async (
    identifier: string,
    title: string,
    body: string,
    hour: number,
    minute: number
  ) => {
    // Cancel any existing notification first
    await Notifications.cancelScheduledNotificationAsync(identifier);
    
    // Get current time
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Calculate target time
    let targetDate = new Date();
    targetDate.setHours(hour, minute, 0, 0);
    
    // If the target time is in the past today, schedule for tomorrow
    if (targetDate <= now) {
      targetDate.setDate(targetDate.getDate() + 1);
    }
    
          // Scheduling notification
    
    await Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        title,
        body,
        sound: true,
      },
      trigger: { type: 'date' as any, date: targetDate },
    });
    
    // Also schedule daily repeating notification
    await Notifications.scheduleNotificationAsync({
      identifier: identifier + '_daily',
      content: {
        title,
        body,
        sound: true,
      },
      trigger: {
        type: 'calendar' as any,
        hour,
        minute,
        repeats: true,
      },
    });
  };

  const cancelNotification = async (identifier: string) => {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  };

  const toggleMorningReminder = async (enabled: boolean) => {
    // Check notification permissions first
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Дозволе потребне',
        'Да бисте користили подсетнике, потребно је да омогућите обавештења у подешавањима.',
        [
          { text: 'Откажи', style: 'cancel' },
          { text: 'Подешавања', onPress: () => Linking.openSettings() }
        ]
      );
      return;
    }

    const newSettings = { ...settings, morningEnabled: enabled };
    
    if (enabled) {
      await scheduleNotification(
        'morning-prayer',
        'Јутарња молитва ☀️',
        'Време је за јутарње молитве. Почните дан са Богом.',
        settings.morningTime.hour,
        settings.morningTime.minute
      );
      Alert.alert(
        'Подсетник активиран',
        `Јутарњи подсетник је подешен за ${settings.morningTime.hour}:${settings.morningTime.minute.toString().padStart(2, '0')}`
      );
    } else {
      await cancelNotification('morning-prayer');
      await cancelNotification('morning-prayer_daily');
    }
    
    await saveSettings(newSettings);
  };

  const toggleEveningReminder = async (enabled: boolean) => {
    // Check notification permissions first
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Дозволе потребне',
        'Да бисте користили подсетнике, потребно је да омогућите обавештења у подешавањима.',
        [
          { text: 'Откажи', style: 'cancel' },
          { text: 'Подешавања', onPress: () => Linking.openSettings() }
        ]
      );
      return;
    }

    const newSettings = { ...settings, eveningEnabled: enabled };
    
    if (enabled) {
      await scheduleNotification(
        'evening-prayer',
        'Вечерња молитва 🌙',
        'Време је за вечерње молитве. Завршите дан у миру са Богом.',
        settings.eveningTime.hour,
        settings.eveningTime.minute
      );
      Alert.alert(
        'Подсетник активиран',
        `Вечерњи подсетник је подешен за ${settings.eveningTime.hour}:${settings.eveningTime.minute.toString().padStart(2, '0')}`
      );
    } else {
      await cancelNotification('evening-prayer');
      await cancelNotification('evening-prayer_daily');
    }
    
    await saveSettings(newSettings);
  };

  const adjustTime = async (type: 'morning' | 'evening', adjustment: 'hour+' | 'hour-' | 'minute+' | 'minute-') => {
    const newSettings = { ...settings };
    const timeKey = type === 'morning' ? 'morningTime' : 'eveningTime';
    
    switch (adjustment) {
      case 'hour+':
        newSettings[timeKey].hour = (newSettings[timeKey].hour + 1) % 24;
        break;
      case 'hour-':
        newSettings[timeKey].hour = newSettings[timeKey].hour === 0 ? 23 : newSettings[timeKey].hour - 1;
        break;
      case 'minute+':
        newSettings[timeKey].minute = (newSettings[timeKey].minute + 1) % 60;
        break;
      case 'minute-':
        newSettings[timeKey].minute = newSettings[timeKey].minute === 0 ? 59 : newSettings[timeKey].minute - 1;
        break;
    }
    
    await saveSettings(newSettings);
    
    // If reminder is enabled, reschedule it
    if ((type === 'morning' && newSettings.morningEnabled) || (type === 'evening' && newSettings.eveningEnabled)) {
      const identifier = type === 'morning' ? 'morning-prayer' : 'evening-prayer';
      const title = type === 'morning' ? 'Јутарња молитва ☀️' : 'Вечерња молитва 🌙';
      const body = type === 'morning' 
        ? 'Време је за јутарње молитве. Почните дан са Богом.'
        : 'Време је за вечерње молитве. Завршите дан у миру са Богом.';
      
      await cancelNotification(identifier);
      await cancelNotification(identifier + '_daily');
      await scheduleNotification(
        identifier,
        title,
        body,
        newSettings[timeKey].hour,
        newSettings[timeKey].minute
      );
    }
  };

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.primary }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={currentColors.accentGold} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentColors.accentGold }]}>ПОДСЕТНИЦИ</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.description, { color: currentColors.secondaryText }]}>
          Подесите подсетнике за јутарње и вечерње молитве
        </Text>

        {/* Morning Reminder */}
        <View style={[styles.reminderCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
          <LinearGradient
            colors={['#D4AF37', '#B8941F']}
            style={styles.reminderIconContainer}
          >
            <Sun size={24} color="#FFFFFF" />
          </LinearGradient>
          
          <View style={styles.reminderContent}>
            <Text style={[styles.reminderTitle, { color: currentColors.primaryText }]}>Јутарња молитва</Text>
            <Text style={[styles.reminderSubtitle, { color: currentColors.secondaryText }]}>Почните дан са Богом</Text>
            
            <View style={styles.timeContainer}>
              <Text style={[styles.timeLabel, { color: currentColors.tertiaryText }]}>Време:</Text>
              <View style={styles.timePickerWrapper}>
                <View style={styles.timeDisplay}>
                  <Text style={[styles.timeDisplayText, { color: currentColors.accentGold }]}>
                    {formatTime(settings.morningTime.hour, settings.morningTime.minute)}
                  </Text>
                </View>
                <View style={styles.timeControlsRow}>
                  <View style={styles.timeControlGroup}>
                    <Text style={[styles.controlLabel, { color: currentColors.tertiaryText }]}>Сат</Text>
                    <View style={styles.controlButtons}>
                      <TouchableOpacity 
                        style={[styles.controlButton, { backgroundColor: currentColors.tertiary }]}
                        onPress={() => adjustTime('morning', 'hour-')}
                      >
                        <Text style={[styles.controlButtonText, { color: currentColors.primaryText }]}>-</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.controlButton, { backgroundColor: currentColors.tertiary }]}
                        onPress={() => adjustTime('morning', 'hour+')}
                      >
                        <Text style={[styles.controlButtonText, { color: currentColors.primaryText }]}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.timeControlGroup}>
                    <Text style={[styles.controlLabel, { color: currentColors.tertiaryText }]}>Мин</Text>
                    <View style={styles.controlButtons}>
                      <TouchableOpacity 
                        style={[styles.controlButton, { backgroundColor: currentColors.tertiary }]}
                        onPress={() => adjustTime('morning', 'minute-')}
                      >
                        <Text style={[styles.controlButtonText, { color: currentColors.primaryText }]}>-</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.controlButton, { backgroundColor: currentColors.tertiary }]}
                        onPress={() => adjustTime('morning', 'minute+')}
                      >
                        <Text style={[styles.controlButtonText, { color: currentColors.primaryText }]}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          
          <Switch
            value={settings.morningEnabled}
            onValueChange={toggleMorningReminder}
            trackColor={{ false: currentColors.tertiary, true: currentColors.accentGold }}
            thumbColor={settings.morningEnabled ? currentColors.primary : currentColors.secondary}
          />
        </View>

        {/* Evening Reminder */}
        <View style={[styles.reminderCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
          <LinearGradient
            colors={['#5C1A1B', '#812430']}
            style={styles.reminderIconContainer}
          >
            <Moon size={24} color="#FFFFFF" />
          </LinearGradient>
          
          <View style={styles.reminderContent}>
            <Text style={[styles.reminderTitle, { color: currentColors.primaryText }]}>Вечерња молитва</Text>
            <Text style={[styles.reminderSubtitle, { color: currentColors.secondaryText }]}>Завршите дан у миру</Text>
            
            <View style={styles.timeContainer}>
              <Text style={[styles.timeLabel, { color: currentColors.tertiaryText }]}>Време:</Text>
              <View style={styles.timePickerWrapper}>
                <View style={styles.timeDisplay}>
                  <Text style={[styles.timeDisplayText, { color: currentColors.accentGold }]}>
                    {formatTime(settings.eveningTime.hour, settings.eveningTime.minute)}
                  </Text>
                </View>
                <View style={styles.timeControlsRow}>
                  <View style={styles.timeControlGroup}>
                    <Text style={[styles.controlLabel, { color: currentColors.tertiaryText }]}>Сат</Text>
                    <View style={styles.controlButtons}>
                      <TouchableOpacity 
                        style={[styles.controlButton, { backgroundColor: currentColors.tertiary }]}
                        onPress={() => adjustTime('evening', 'hour-')}
                      >
                        <Text style={[styles.controlButtonText, { color: currentColors.primaryText }]}>-</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.controlButton, { backgroundColor: currentColors.tertiary }]}
                        onPress={() => adjustTime('evening', 'hour+')}
                      >
                        <Text style={[styles.controlButtonText, { color: currentColors.primaryText }]}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.timeControlGroup}>
                    <Text style={[styles.controlLabel, { color: currentColors.tertiaryText }]}>Мин</Text>
                    <View style={styles.controlButtons}>
                      <TouchableOpacity 
                        style={[styles.controlButton, { backgroundColor: currentColors.tertiary }]}
                        onPress={() => adjustTime('evening', 'minute-')}
                      >
                        <Text style={[styles.controlButtonText, { color: currentColors.primaryText }]}>-</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.controlButton, { backgroundColor: currentColors.tertiary }]}
                        onPress={() => adjustTime('evening', 'minute+')}
                      >
                        <Text style={[styles.controlButtonText, { color: currentColors.primaryText }]}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          
          <Switch
            value={settings.eveningEnabled}
            onValueChange={toggleEveningReminder}
            trackColor={{ false: currentColors.tertiary, true: currentColors.accentGold }}
            thumbColor={settings.eveningEnabled ? currentColors.primary : currentColors.secondary}
          />
        </View>

        {/* Instructions */}
        <View style={styles.instructionsSection}>
          <Text style={[styles.instructionsTitle, { color: currentColors.accentGold }]}>Како раде подсетници</Text>
          <View style={[styles.instructionsCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
            <Text style={[styles.instructionText, { color: currentColors.secondaryText }]}>
              • Подсетници се активирају сваки дан у подешено време
            </Text>
            <Text style={[styles.instructionText, { color: currentColors.secondaryText }]}>
              • Нотификације раде чак и када је апликација затворена
            </Text>
            <Text style={[styles.instructionText, { color: currentColors.secondaryText }]}>
              • Подесите сате и минуте помоћу + и - дугмића
            </Text>
            <Text style={[styles.instructionText, { color: currentColors.secondaryText }]}>
              • Искључите подсетник помоћу прекидача
            </Text>
          </View>
        </View>

        {/* Active Reminders Status */}
        {(settings.morningEnabled || settings.eveningEnabled) && (
          <View style={styles.statusSection}>
            <Text style={[styles.statusTitle, { color: currentColors.accentGold }]}>Активни подсетници</Text>
            <View style={[styles.statusCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
              {settings.morningEnabled && (
                <View style={styles.statusItem}>
                  <Bell size={16} color={currentColors.accentGold} />
                  <Text style={[styles.statusText, { color: currentColors.primaryText }]}>
                    Јутарња молитва - {formatTime(settings.morningTime.hour, settings.morningTime.minute)}
                  </Text>
                </View>
              )}
              {settings.eveningEnabled && (
                <View style={styles.statusItem}>
                  <Bell size={16} color={currentColors.accentGold} />
                  <Text style={[styles.statusText, { color: currentColors.primaryText }]}>
                    Вечерња молитва - {formatTime(settings.eveningTime.hour, settings.eveningTime.minute)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 25,
    fontStyle: 'italic',
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  reminderIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reminderSubtitle: {
    fontSize: 12,
    marginBottom: 10,
  },
  timeContainer: {
    marginTop: 10,
  },
  timeLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  timePickerWrapper: {
    alignItems: 'center',
  },
  timeDisplay: {
    marginBottom: 12,
  },
  timeDisplayText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timeControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  timeControlGroup: {
    alignItems: 'center',
    flex: 1,
  },
  controlLabel: {
    fontSize: 10,
    marginBottom: 8,
    fontWeight: '500',
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  controlButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructionsSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  instructionsCard: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
  statusSection: {
    marginBottom: 100,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  statusCard: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
  },
});