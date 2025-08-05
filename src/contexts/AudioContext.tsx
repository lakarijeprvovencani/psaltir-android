import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AppState, Alert, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { supabase, BackgroundMusic } from '../../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AudioContextType {
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  currentTrack: BackgroundMusic | null;
  allTracks: BackgroundMusic[];
  currentTrackIndex: number;
  sound: Audio.Sound | null;
  forceUpdate: number; // Add this to force re-renders
  setVolume: (volume: number) => void;
  togglePlayback: () => Promise<void>;
  playNextTrack: () => Promise<void>;
  playPreviousTrack: () => Promise<void>;
  selectTrack: (trackIndex: number) => Promise<void>;
  refreshTracks: () => Promise<void>;
  initializeAudio: () => Promise<void>; // Add this function
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [currentTrack, setCurrentTrack] = useState<BackgroundMusic | null>(null);
  const [allTracks, setAllTracks] = useState<BackgroundMusic[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audioPermissionsGranted, setAudioPermissionsGranted] = useState(false);
  const [silentModeWarningShown, setSilentModeWarningShown] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Force UI update function
  const triggerUIUpdate = useCallback(() => {
    setForceUpdate(prev => prev + 1);
  }, []);

  // Check if permissions are granted and initialize audio
  const initializeAudio = async () => {
    if (isInitialized) return;
    
    try {
      console.log('🎵 Initializing audio context...');
      
      // Check if permissions were granted
      const permissionsData = await AsyncStorage.getItem('@psalter_permissions_shown');
      if (permissionsData) {
        const permissions = JSON.parse(permissionsData);
        if (permissions.microphone) {
          console.log('🎵 Microphone permission granted, initializing audio...');
          
          // Request audio permissions
          const { status } = await Audio.requestPermissionsAsync();
          setAudioPermissionsGranted(status === 'granted');

          if (status !== 'granted') {
            console.warn('🎵 Audio permissions not granted');
          }

          // Load tracks regardless of permissions (for UI purposes)
          await loadAllTracks();
          setIsInitialized(true);
        } else {
          console.log('🎵 Microphone permission not granted, skipping audio initialization');
          // Still load tracks for UI purposes
          await loadAllTracks();
          setIsInitialized(true);
        }
      } else {
        console.log('🎵 Permissions not shown yet, skipping audio initialization');
        // Still load tracks for UI purposes
        await loadAllTracks();
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('🎵 Error initializing audio:', error);
      await loadAllTracks(); // Still try to load tracks
      setIsInitialized(true);
    }
  };

  // Initialize audio when component mounts
  useEffect(() => {
    initializeAudio();
    return () => {
      if (sound) {
        sound.unloadAsync().catch(console.warn);
      }
    };
  }, []);

  const loadAllTracks = async () => {
    try {
      setIsLoading(true);

      // Check if Supabase is available before making requests
      if (!supabase) {
        console.error('🎵 Supabase not available! Cannot load tracks.');
        setIsLoading(false);
        return;
      }

      // Fetch all background music from Supabase
      console.log('🎵 Fetching tracks from Supabase...');
      const { data, error } = await supabase
        .from('background_music')
        .select('id, title, file_url, is_active, created_at, updated_at')
        .order('title');

      console.log('🎵 Supabase response:', { data, error });
      console.log('🎵 Number of tracks found:', data?.length || 0);

      if (error) {
        console.error('🎵 Error fetching background music tracks:', error);
        setIsLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        console.warn('🎵 No background music tracks found in database');
        setIsLoading(false);
        return;
      }

      // Loaded tracks from database
      console.log('🎵 All tracks loaded from Supabase:');
      data.forEach((track, index) => {
        console.log(`🎵 ${index + 1}. ${track.title} (${track.is_active ? 'ACTIVE' : 'inactive'})`);
        console.log(`    URL: ${track.file_url}`);
      });

      setAllTracks(data);

      // Find active track or use first track
      const activeTrackIndex = data.findIndex(track => track.is_active);
      const initialIndex = activeTrackIndex >= 0 ? activeTrackIndex : 0;

      console.log('🎵 Active track index:', activeTrackIndex);
      console.log('🎵 Initial track index:', initialIndex);

      setCurrentTrackIndex(initialIndex);
      setCurrentTrack(data[initialIndex]);

      // Auto-load the first track so it's ready for playback
      console.log('🎵 Auto-loading track:', data[initialIndex].title);
      await loadTrack(data[initialIndex], false);
    } catch (error) {
      console.error('🎵 Error loading tracks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrack = async (track: BackgroundMusic, shouldPlay: boolean = false) => {
    try {
      setIsLoading(true);
      console.log('🎵 === LOADING TRACK ===');
      console.log('🎵 Track:', track.title);
      console.log('🎵 Should play:', shouldPlay);
      console.log('🎵 File URL:', track.file_url);

      // Unload previous sound
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
      }

      // Configure audio mode with enhanced settings
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        console.log('🎵 Audio mode configured successfully');
      } catch (audioModeError) {
        console.warn('🎵 Failed to set audio mode:', audioModeError);
        // Continue anyway, might still work
      }

      // Load the sound with timeout
      const soundPromise = Audio.Sound.createAsync(
        { uri: track.file_url },
        {
          shouldPlay: false, // Start paused by default
          isLooping: true,   // Loop the audio
          volume: volume,
        }
      );

      // Add timeout for sound loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Sound loading timeout')), 10000);
      });

      const { sound: newSound } = await Promise.race([soundPromise, timeoutPromise]) as any;

      if (newSound) {
        console.log('🎵 Sound object created successfully:', !!newSound);
        setSound(newSound);
        setCurrentTrack(track);
        console.log('🎵 Audio track loaded successfully:', track.title);
        console.log('🎵 Sound object set in state:', !!newSound);
        
        // Auto-play the track if it was requested
        if (shouldPlay) {
          try {
            console.log('🎵 shouldPlay=true, starting playback...');
            await newSound.playAsync();
            setIsPlaying(true);
            triggerUIUpdate(); // Force UI update after state change
            console.log('🎵 Auto-playing loaded track - SUCCESS');
          } catch (playError) {
            console.error('🎵 Error auto-playing track:', playError);
            setIsPlaying(false);
            triggerUIUpdate(); // Force UI update after state change
          }
        } else {
          console.log('🎵 shouldPlay=false, track loaded but not playing');
        }
      } else {
        throw new Error('Failed to create sound object');
      }
    } catch (error) {
      console.error('Error loading track:', error);
      // Set a fallback state
      setCurrentTrack(track);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayback = useCallback(async () => {
    console.log('🎵 togglePlayback called');
    console.log('🎵 Sound loaded:', !!sound);
    console.log('🎵 Audio permissions:', audioPermissionsGranted);
    console.log('🎵 Current track:', currentTrack?.title);
    console.log('🎵 Is playing:', isPlaying);

    // Check audio permissions first
    if (!audioPermissionsGranted) {
      console.warn('🎵 Audio permissions not granted, requesting...');
      try {
        const { status } = await Audio.requestPermissionsAsync();
        setAudioPermissionsGranted(status === 'granted');
        if (status !== 'granted') {
          console.warn('🎵 Audio permissions denied by user');
          return;
        }
      } catch (error) {
        console.error('🎵 Error requesting audio permissions:', error);
        return;
      }
    }

    // Load track if no sound is loaded
    if (!sound) {
      console.warn('🎵 No sound loaded, attempting to load current track...');
      console.log('🎵 Current track available:', !!currentTrack);
      console.log('🎵 Current track title:', currentTrack?.title);
      console.log('🎵 Sound object state:', !!sound);
      if (currentTrack) {
        console.log('🎵 Loading track:', currentTrack.title);
        await loadTrack(currentTrack, true); // Load and play
        console.log('🎵 Track loaded, sound object should be available now');
        return;
      } else {
        console.warn('🎵 No current track available');
        return;
      }
    }

    try {
      if (isPlaying) {
        console.log('🎵 Pausing audio...');
        await sound.pauseAsync();
        setIsPlaying(false);
        console.log('🎵 Audio paused successfully');
        console.log('🎵 isPlaying state set to FALSE');
        triggerUIUpdate(); // Force UI update after state change
      } else {
        console.log('🎵 Starting audio playback...');
        await sound.playAsync();
        setIsPlaying(true);
        console.log('🎵 Audio started successfully');
        console.log('🎵 isPlaying state set to TRUE');
        triggerUIUpdate(); // Force UI update after state change

        // Force a small delay to ensure state update
        setTimeout(() => {
          console.log('🎵 Delayed check - isPlaying should be true now');
          checkSilentModeAndWarn();
        }, 1000);
      }
    } catch (error) {
      console.error('🎵 Error toggling playback:', error);
      setIsPlaying(false);

      // Try to reload the track if playback fails
      if (currentTrack) {
        console.log('🎵 Attempting to reload track after error...');
        await loadTrack(currentTrack, false);
      }
    }
  }, [sound, isPlaying, currentTrack, audioPermissionsGranted, triggerUIUpdate]);

  const playNextTrack = async () => {
    if (allTracks.length === 0) {
      console.warn('No tracks available for next track');
      return;
    }

    try {
      const nextIndex = (currentTrackIndex + 1) % allTracks.length;
      setCurrentTrackIndex(nextIndex);
      await loadTrack(allTracks[nextIndex], isPlaying);
    } catch (error) {
      console.error('Error playing next track:', error);
      setIsPlaying(false);
    }
  };

  const playPreviousTrack = async () => {
    if (allTracks.length === 0) {
      console.warn('No tracks available for previous track');
      return;
    }

    try {
      const prevIndex = currentTrackIndex === 0 ? allTracks.length - 1 : currentTrackIndex - 1;
      setCurrentTrackIndex(prevIndex);
      await loadTrack(allTracks[prevIndex], isPlaying);
    } catch (error) {
      console.error('Error playing previous track:', error);
      setIsPlaying(false);
    }
  };

  const selectTrack = async (trackIndex: number) => {
    if (trackIndex < 0 || trackIndex >= allTracks.length) {
      console.warn('Invalid track index:', trackIndex);
      return;
    }

    try {
      const selectedTrack = allTracks[trackIndex];
      console.log('🎵 Selecting track:', selectedTrack.title);

      // Set the current track immediately
      setCurrentTrackIndex(trackIndex);
      setCurrentTrack(selectedTrack);

      // Load the track and prepare it for immediate playback
      await loadTrack(selectedTrack, false);
      console.log('🎵 Track selected and loaded, ready for playback');
      console.log('🎵 Sound object after loading:', !!sound);
      
      // Reset local playing state in more.tsx
      console.log('🎵 Track selection completed, sound should be ready');
    } catch (error) {
      console.error('Error selecting track:', error);
      setIsPlaying(false);
    }
  };

  const refreshTracks = async () => {
    try {
      await loadAllTracks();
    } catch (error) {
      console.error('Error refreshing tracks:', error);
    }
  };

  // Function to detect and warn about silent mode
  const checkSilentModeAndWarn = async () => {
    if (Platform.OS === 'ios' && !silentModeWarningShown) {
      try {
        console.log('🎵 Checking for silent mode...');

        // Simple approach: try to play current track and see if it fails
        if (sound && currentTrack) {
          const status = await sound.getStatusAsync();
          if (status.isLoaded && !status.isPlaying) {
            // Show warning about silent mode
            Alert.alert(
              'Упозорење о тихом режиму',
              'Ако не чујете музику, проверите да ли је ваш уређај у тихом режиму. За репродукцију духовне музике, молимо вас да искључите тихи режим помоћу прекидача на левој страни уређаја.',
              [
                { text: 'Разумем', style: 'default' },
                { text: 'Не приказуј поново', style: 'cancel', onPress: () => setSilentModeWarningShown(true) }
              ]
            );
          }
        }
      } catch (error) {
        console.log('🎵 Silent mode detection error:', error);
      }
    }
  };

  const setVolume = async (newVolume: number) => {
    setVolumeState(newVolume);
    if (sound) {
      try {
        await sound.setVolumeAsync(newVolume);
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    }
  };

  // Cleanup function for memory management
  const cleanup = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      setIsPlaying(false);
      setIsLoading(false);
    } catch (error) {
      console.warn('Error during audio cleanup:', error);
    }
  };

  // Add cleanup and app state changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // Pause audio when app goes to background
        if (isPlaying && sound) {
          sound.pauseAsync().catch(console.warn);
          setIsPlaying(false);
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
      cleanup();
    };
  }, [sound, isPlaying]);

  const value: AudioContextType = {
    isPlaying,
    isLoading,
    volume,
    currentTrack,
    allTracks,
    currentTrackIndex,
    sound,
    forceUpdate,
    setVolume,
    togglePlayback,
    playNextTrack,
    playPreviousTrack,
    selectTrack,
    refreshTracks,
    initializeAudio,
  };

  // Force re-render when forceUpdate changes
  useEffect(() => {
    // This will trigger re-render of all components using useAudio
  }, [forceUpdate]);

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio(): AudioContextType {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}