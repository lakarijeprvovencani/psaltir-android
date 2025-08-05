import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Share, Alert, Linking } from 'react-native';
import { Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChartBar as BarChart3, Bell, Heart, Search, User, Moon, Volume2, Bookmark, Share2, Play, Pause, SkipForward, SkipBack, Music, ChevronDown, ChevronUp, FileText, Shield, Lock } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAudio } from '../../src/contexts/AudioContext';
import { useActivity } from '../../src/contexts/ActivityContext';
import { ResponsiveTitle } from '../../src/components/ResponsiveTitle';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 400;

interface AudioControlsState {
  showVolumeControls: boolean;
  showTrackList: boolean;
}

interface MenuItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  action: () => void;
}

export default function MoreScreen() {
  const router = useRouter();
  const { isLightMode, toggleTheme, currentColors } = useTheme();
  const {
    isPlaying,
    volume,
    setVolume,
    togglePlayback,
    currentTrack,
    allTracks,
    currentTrackIndex,
    playNextTrack,
    playPreviousTrack,
    selectTrack,
    sound,
    forceUpdate
  } = useAudio();
  const { activityDays } = useActivity();
  const [audioState, setAudioState] = React.useState<AudioControlsState>({
    showVolumeControls: false,
    showTrackList: false
  });

  
  // Local state to track playing status
  const [localIsPlaying, setLocalIsPlaying] = React.useState(false);

  const handlePlayButtonPress = () => {
    // Toggle the audio controls accordion without moving the button
    setAudioState(prev => ({ ...prev, showVolumeControls: !prev.showVolumeControls }));
  };

  const handlePlayPausePress = async () => {
    console.log('🎵 [MORE TAB] ===== PLAY BUTTON PRESSED =====');
    console.log('🎵 [MORE TAB] Current track:', currentTrack?.title);
    console.log('🎵 [MORE TAB] Local is playing BEFORE:', localIsPlaying);
    console.log('🎵 [MORE TAB] Sound loaded:', !!sound);

    if (!sound) {
      console.log('🎵 [MORE TAB] No sound loaded!');
      return;
    }

    try {
      const status = await sound.getStatusAsync();

      if (status.isLoaded) {
        if (status.isPlaying) {
          console.log('🎵 [MORE TAB] Pausing audio...');
          await sound.pauseAsync();
        } else {
          console.log('🎵 [MORE TAB] Starting audio...');
          await sound.playAsync();
        }
      }
      
      console.log('🎵 [MORE TAB] ===== PLAY BUTTON FINISHED =====');
    } catch (error) {
      console.error('🎵 [MORE TAB] Error in handlePlayPausePress:', error);
    }
  };

  // Force re-render when forceUpdate changes
  React.useEffect(() => {
    // This will trigger re-render when forceUpdate changes
  }, [forceUpdate]);

  // Sync localIsPlaying with actual playback status
  React.useEffect(() => {
    if (sound) {
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setLocalIsPlaying(status.isPlaying);
          console.log('🎵 [MORE TAB] Playback status update:', status.isPlaying);
        }
      });
    }
  }, [sound]);

  const handleTrackSelect = async (trackIndex: number) => {
    console.log('🎵 [MORE TAB] Track selected from dropdown:', trackIndex);
    await selectTrack(trackIndex);
    console.log('🎵 [MORE TAB] Track selected and loaded');
    setAudioState(prev => ({ ...prev, showTrackList: false }));
  };

  const toggleTrackList = () => {
    setAudioState(prev => ({ ...prev, showTrackList: !prev.showTrackList }));
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: 'Православни Псалтир - увек са вама, где год да се налазите.\n\nОткријте 150 псалама Давидових, јутарње и вечерње молитве, и духовне садржаје за свакодневну употребу.\n\nПреузмите апликацију: https://apps.apple.com/rs/app/psaltir/id6749312215',
        title: 'Православни Псалтир - бесплатна апликација'
      });

      if (result.action === Share.sharedAction) {
        // App shared successfully
      }
    } catch (error) {
      console.error('Error sharing app:', error);
      Alert.alert('Грешка', 'Није могуће поделити апликацију у овом тренутку.');
    }
  };

  const menuItems: MenuItem[] = [
    {
      icon: <Bell size={24} color="#FFFFFF" />,
      title: 'Подсетници',
      subtitle: 'Јутарње и вечерње молитве',
      color: '#5C1A1B',
      action: () => router.push('/reminders')
    },
    {
      icon: <Heart size={24} color="#FFFFFF" />,
      title: 'Захвалност и подршка',
      subtitle: 'Подржи развој апликације',
      color: '#8B2635',
      action: () => router.push('/support')
    },
    {
      icon: <Bookmark size={24} color="#FFFFFF" />,
      title: 'Омиљено',
      subtitle: 'Сачувани псалми и молитве',
      color: '#4A5D23',
      action: () => router.push('/favorites')
    },
    {
      icon: <Share2 size={24} color="#FFFFFF" />,
      title: 'Подели',
      subtitle: 'Подели апликацију са пријатељима',
      color: '#6B46C1',
      action: handleShare
    }
  ];

  const legalItems: MenuItem[] = [
    {
      icon: <FileText size={24} color="#FFFFFF" />,
      title: 'Услови коришћења',
      subtitle: 'Terms of Service',
      color: '#2C5F2D',
      action: () => router.push('/terms')
    },
    {
      icon: <Shield size={24} color="#FFFFFF" />,
      title: 'Политика приватности',
      subtitle: 'Privacy Policy',
      color: '#1E3A8A',
      action: () => router.push('/privacy')
    }
  ];

  const handleOpenSettings = () => {
    Linking.openSettings();
  };





  const settingsItems = [
    {
      icon: <Moon size={20} color={currentColors.accentGold} />,
      title: 'Тема',
      subtitle: isLightMode ? 'Светли режим' : 'Тамни режим',
      hasSwitch: true,
      hasAudio: false
    },
    {
      icon: <Volume2 size={20} color={currentColors.accentGold} />,
      title: 'Духовна музика',
      subtitle: '',
      hasSwitch: false,
      hasAudio: true
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: currentColors.primary }]}>
      <View style={styles.header}>
        <ResponsiveTitle
          baseFontSize={28}
          minScale={0.6}
          maxScale={1.2}
          color={currentColors.accentGold}
          style={styles.headerTitle}
        >
          ЈОШ ОПЦИЈА
        </ResponsiveTitle>
        <Text style={[styles.headerSubtitle, { color: currentColors.secondaryText }]}>Додатне функционалности</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <LinearGradient
            colors={[currentColors.secondary, currentColors.tertiary]}
            style={styles.profileCard}
          >
            <View style={styles.profileAvatar}>
              <Text style={[strings.profileInitial, { color: currentColors.primary }]}>☦</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: currentColors.primaryText }]}>Православни верник</Text>
              <Text style={[styles.profileStats, { color: currentColors.secondaryText }]}>
                {activityDays} {activityDays === 1 ? 'дан' : 'дана'} активности
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Main Menu Items */}
        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>Главне функције</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={item.title} style={[styles.menuItem, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]} onPress={item.action}>
              <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                {item.icon}
              </View>
              <View style={styles.menuContent}>
                <Text style={[styles.menuTitle, { color: currentColors.primaryText }]}>{item.title}</Text>
                <Text style={[styles.menuSubtitle, { color: currentColors.tertiaryText }]}>{item.subtitle}</Text>
              </View>
              <Text style={[styles.menuArrow, { color: currentColors.accentGold }]}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Legal Items */}
        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>Правни документи</Text>
          {legalItems.map((item, index) => (
            <TouchableOpacity key={item.title} style={[styles.menuItem, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]} onPress={item.action}>
              <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                {item.icon}
              </View>
              <View style={styles.menuContent}>
                <Text style={[styles.menuTitle, { color: currentColors.primaryText }]}>{item.title}</Text>
                <Text style={[styles.menuSubtitle, { color: currentColors.tertiaryText }]}>{item.subtitle}</Text>
              </View>
              <Text style={[styles.menuArrow, { color: currentColors.accentGold }]}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Permissions Settings */}
        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>Подешавања дозвола</Text>
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]} 
            onPress={handleOpenSettings}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#8B2635' }]}>
              <Lock size={24} color="#FFFFFF" />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: currentColors.primaryText }]}>Подешавања дозвола</Text>
              <Text style={[styles.menuSubtitle, { color: currentColors.tertiaryText }]}>Обавештења и микрофон</Text>
            </View>
            <Text style={[styles.menuArrow, { color: currentColors.accentGold }]}>›</Text>
          </TouchableOpacity>
          


        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>Подешавање теме</Text>
          {settingsItems.map((item, index) => (
            <View key={item.title} style={[styles.settingsItem, { borderBottomColor: currentColors.tertiary }]}>
              <View style={styles.settingsIcon}>
                {item.icon}
              </View>
              <View style={styles.settingsContent}>
                <Text style={[styles.settingsTitle, { color: currentColors.primaryText }]}>{item.title}</Text>
                <Text style={[styles.settingsSubtitle, { color: currentColors.tertiaryText }]}>{item.subtitle}</Text>
                
                {/* Audio Controls */}
                {item.hasAudio && audioState.showVolumeControls && (
                  <View style={[styles.audioControls, { marginTop: 20 }]}>
                    {/* Track Info and Navigation */}
                    <View style={[styles.trackInfoContainer, { backgroundColor: currentColors.primary, borderColor: currentColors.tertiary }]}>
                      <TouchableOpacity 
                        style={styles.trackInfoHeader}
                        onPress={toggleTrackList}
                      >
                        <View style={styles.trackInfoContent}>
                          <Music size={16} color={currentColors.accentGold} />
                          <Text style={[styles.currentTrackTitle, { color: currentColors.accentGold }]}>
                            {currentTrack ? currentTrack.title : 'Нема песме'}
                          </Text>
                          <Text style={[styles.trackCounter, { color: currentColors.tertiaryText }]}>
                            {allTracks.length > 0 ? `${currentTrackIndex + 1}/${allTracks.length}` : '0/0'}
                          </Text>
                        </View>
                        {audioState.showTrackList ? (
                          <ChevronUp size={16} color={currentColors.accentGold} />
                        ) : (
                          <ChevronDown size={16} color={currentColors.accentGold} />
                        )}
                      </TouchableOpacity>
                      
                      {/* Track List */}
                      {audioState.showTrackList && (
                        <View style={[styles.trackList, { borderTopColor: currentColors.tertiary, backgroundColor: currentColors.primary }]}>
                          <ScrollView style={styles.trackListScroll} showsVerticalScrollIndicator={false}>
                            {allTracks.map((track, index) => (
                              <TouchableOpacity
                                key={track.id}
                                style={[
                                  styles.trackItem,
                                  index === currentTrackIndex && { backgroundColor: '#D4AF37' }
                                ]}
                                onPress={() => handleTrackSelect(index)}
                              >
                                <Text style={[
                                  styles.trackItemText,
                                  { color: index === currentTrackIndex ? (isLightMode ? '#000000' : '#FFFFFF') : '#D4AF37' }
                                ]}>
                                  {track.title}
                                </Text>
                                {index === currentTrackIndex && (
                                  <Text style={[styles.playingIndicator, { color: '#000000' }]}>♪</Text>
                                )}
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                    
                    {/* Navigation Controls */}
                    {/* Navigation Controls - Hide when dropdown is open */}
                    {!audioState.showTrackList && (
                      <>
                        <View style={styles.navigationControls}>
                          <TouchableOpacity 
                            style={[styles.navButton, { backgroundColor: currentColors.tertiary }]}
                            onPress={playPreviousTrack}
                            disabled={allTracks.length === 0}
                          >
                            <SkipBack size={16} color={currentColors.primaryText} />
                          </TouchableOpacity>
                          
                          <TouchableOpacity 
                            style={[styles.navButton, styles.playButton, { backgroundColor: currentColors.accentGold }]}
                            onPress={handlePlayPausePress}
                            disabled={!currentTrack}
                          >
                            {localIsPlaying ? (
                              <Pause size={18} color={currentColors.primary} />
                            ) : (
                              <Play size={18} color={currentColors.primary} />
                            )}
                          </TouchableOpacity>
                          
                          <TouchableOpacity 
                            style={[styles.navButton, { backgroundColor: currentColors.tertiary }]}
                            onPress={playNextTrack}
                            disabled={allTracks.length === 0}
                          >
                            <SkipForward size={16} color={currentColors.primaryText} />
                          </TouchableOpacity>
                        </View>
                        
                        {/* Volume Controls */}
                        <View style={styles.volumeSliderContainer}>
                          <Text style={[styles.volumeIcon, { color: currentColors.tertiaryText }]}>🔉</Text>
                          <Slider
                            style={styles.volumeSlider}
                            minimumValue={0}
                            maximumValue={1}
                            value={volume}
                            onValueChange={setVolume}
                            minimumTrackTintColor={currentColors.accentGold}
                            maximumTrackTintColor={currentColors.tertiary}
                            thumbTintColor={currentColors.accentGold}
                          />
                          <Text style={[styles.volumeIcon, { color: currentColors.tertiaryText }]}>🔊</Text>
                        </View>
                        <Text style={[styles.volumeStatus, { color: currentColors.secondaryText }]}>
                          {Math.round(volume * 100)}%
                        </Text>
                      </>
                    )}
                  </View>
                )}
              </View>
              {item.hasSwitch && (
                <Switch
                  value={isLightMode}
                  onValueChange={toggleTheme}
                  trackColor={{ false: currentColors.tertiary, true: currentColors.accentGold }}
                  thumbColor={isLightMode ? currentColors.primary : currentColors.accentGold}
                />
              )}
              {item.hasAudio && (
                <TouchableOpacity 
                  style={[styles.audioToggleButton, { backgroundColor: currentColors.accentGold, position: 'absolute', right: 15, top: 15 }]}
                  onPress={handlePlayButtonPress}
                >
                  {audioState.showVolumeControls ? (
                    <ChevronUp size={16} color={currentColors.primary} />
                  ) : (
                    <ChevronDown size={16} color={currentColors.primary} />
                  )}
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>О нама</Text>
          
          {/* About Tabs */}


          {/* About Content */}
          <View style={[styles.aboutContent, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
            <View style={styles.appContent}>
              <Text style={[styles.aboutText, { color: currentColors.secondaryText }]}>
                Апликација „Псалтир" настала је из искрене жеље да свако, у сваком тренутку, може имати молитвеник крај себе. Сви текстови у апликацији преузети су са јавно доступних извора, без икакве финансијске користи за аутора.
              </Text>
              
              <Text style={[styles.aboutText, { color: currentColors.secondaryText }]}>
                Циљ је искључиво духовна подршка и могућност да вера, утеха и молитва буду доступни свима, било где и било када. Апликација је развијана са поштовањем према православној традицији и жељом да се очува аутентичност духовних текстова.
              </Text>
              
              <Text style={[styles.aboutText, { color: currentColors.secondaryText }]}>
                Надамо се да ће ова апликација бити благослов за све који траже духовни мир и везу са Богом у свакодневном животу.
              </Text>

              <Text style={[styles.aboutText, { color: currentColors.secondaryText }]}>
               За све предлоге и унапређења пишите на nemanja.lakic1@gmail.com
              </Text>
            </View>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfoSection}>
          <Text style={[styles.appVersion, { color: currentColors.accentGold }]}>Верзија 1.0.0</Text>
          <Text style={[styles.appDescription, { color: currentColors.tertiaryText }]}>
            Псалтир апликација
          </Text>
          <Text style={[styles.copyright, { color: currentColors.tertiaryText }]}>
            © 2025 Немања Лакић
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: isSmallScreen ? 12 : 14,
    marginTop: 5,
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    marginBottom: 30,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D4AF37', // Keep gold for avatar
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  profileInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0C0C0C',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileStats: {
    fontSize: 14,
  },
  menuSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  menuIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: isSmallScreen ? 11 : 12,
  },
  menuArrow: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsSection: {
    marginBottom: 30,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    position: 'relative',
  },
  settingsIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 15,
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: isSmallScreen ? 14 : 16,
    marginBottom: 2,
  },
  settingsSubtitle: {
    fontSize: 12,
  },
  settingsArrow: {
    fontSize: 18,
    color: '#888',
  },
  appInfoSection: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 100,
  },
  appVersion: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  appDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  copyright: {
    fontSize: 10,
    textAlign: 'center',
  },
  audioControls: {
    marginTop: 20,
    width: '100%',
  },
  audioToggleButton: {
    width: isSmallScreen ? 28 : 32,
    height: isSmallScreen ? 28 : 32,
    borderRadius: isSmallScreen ? 14 : 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackInfoContainer: {
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 15,
    overflow: 'hidden',
  },
  trackInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  trackInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  currentTrackTitle: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  trackCounter: {
    fontSize: 12,
  },
  trackList: {
    borderTopWidth: 1,
    maxHeight: 150,
  },
  trackListScroll: {
    maxHeight: 150,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#1C1C1C',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  trackItemText: {
    fontSize: 13,
    flex: 1,
    color: '#FFFFFF',
  },
  playingIndicator: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  navigationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 15,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  volumeStatus: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  volumeSliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  volumeIcon: {
    fontSize: 14,
    width: 20,
    textAlign: 'center',
  },
  volumeSlider: {
    flex: 1,
    height: 30,
    marginHorizontal: 8,
  },
  aboutSection: {
    marginBottom: 30,
  },

  aboutContent: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  appContent: {
    // No specific styles needed, uses aboutText
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 15,
    textAlign: 'left',
  },
});

// Fix for the typo in profileInitial style
const strings = StyleSheet.create({
  profileInitial: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});