#!/usr/bin/env node

console.log('🎵 AUDIO PLAYBACK SIMULATION TEST');
console.log('==================================\n');

// Simulate AudioContext state
let sound = null;
let isPlaying = false;
let currentTrack = null;
let audioPermissionsGranted = false;
let isLoading = false;

// Mock track data
const mockTrack = {
  id: 'test-1',
  title: 'Anixandaria',
  file_url: 'https://zabgchwtarnloaieysam.supabase.co/storage/v1/object/public/background-music/01_Anixandaria.mp3',
  is_active: true
};

// Simulate loadTrack function
const loadTrack = async (track, shouldPlay = false) => {
  console.log(`🎵 [SIMULATION] loadTrack called with track: ${track.title}`);
  console.log(`🎵 [SIMULATION] shouldPlay: ${shouldPlay}`);
  
  isLoading = true;
  
  // Simulate loading delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Simulate successful sound creation
  sound = { 
    playAsync: async () => {
      console.log('🎵 [SIMULATION] sound.playAsync() called');
      isPlaying = true;
      return Promise.resolve();
    },
    pauseAsync: async () => {
      console.log('🎵 [SIMULATION] sound.pauseAsync() called');
      isPlaying = false;
      return Promise.resolve();
    },
    unloadAsync: async () => {
      console.log('🎵 [SIMULATION] sound.unloadAsync() called');
      sound = null;
      isPlaying = false;
      return Promise.resolve();
    }
  };
  
  currentTrack = track;
  isLoading = false;
  
  console.log(`🎵 [SIMULATION] Track loaded successfully: ${track.title}`);
  console.log(`🎵 [SIMULATION] Sound object created: ${!!sound}`);
  
  if (shouldPlay) {
    console.log('🎵 [SIMULATION] Auto-playing loaded track...');
    try {
      await sound.playAsync();
      console.log('🎵 [SIMULATION] Auto-play successful!');
    } catch (error) {
      console.error('🎵 [SIMULATION] Auto-play failed:', error);
      isPlaying = false;
    }
  }
};

// Simulate togglePlayback function (BEFORE FIX)
const togglePlaybackBeforeFix = async () => {
  console.log('\n🔴 TESTING BEFORE FIX:');
  console.log('🎵 [SIMULATION] togglePlayback called');
  console.log(`🎵 [SIMULATION] Sound loaded: ${!!sound}`);
  console.log(`🎵 [SIMULATION] Audio permissions: ${audioPermissionsGranted}`);
  console.log(`🎵 [SIMULATION] Current track: ${currentTrack?.title}`);
  console.log(`🎵 [SIMULATION] Is playing: ${isPlaying}`);

  // Simulate audio permissions
  if (!audioPermissionsGranted) {
    console.log('🎵 [SIMULATION] Requesting audio permissions...');
    audioPermissionsGranted = true;
  }

  // Load track if no sound is loaded (OLD LOGIC)
  if (!sound) {
    console.log('🎵 [SIMULATION] No sound loaded, attempting to load current track...');
    if (currentTrack) {
      console.log(`🎵 [SIMULATION] Loading track: ${currentTrack.title}`);
      await loadTrack(currentTrack, false); // OLD: false
      console.log('🎵 [SIMULATION] Track loaded, press play again to start playback');
      return; // OLD: Just return, user must press play again
    } else {
      console.log('🎵 [SIMULATION] No current track available');
      return;
    }
  }

  // Play/pause logic
  if (isPlaying) {
    console.log('🎵 [SIMULATION] Pausing audio...');
    await sound.pauseAsync();
    console.log('🎵 [SIMULATION] Audio paused successfully');
  } else {
    console.log('🎵 [SIMULATION] Starting audio playback...');
    await sound.playAsync();
    console.log('🎵 [SIMULATION] Audio started successfully');
  }
};

// Simulate togglePlayback function (AFTER FIX)
const togglePlaybackAfterFix = async () => {
  console.log('\n🟢 TESTING AFTER FIX:');
  console.log('🎵 [SIMULATION] togglePlayback called');
  console.log(`🎵 [SIMULATION] Sound loaded: ${!!sound}`);
  console.log(`🎵 [SIMULATION] Audio permissions: ${audioPermissionsGranted}`);
  console.log(`🎵 [SIMULATION] Current track: ${currentTrack?.title}`);
  console.log(`🎵 [SIMULATION] Is playing: ${isPlaying}`);

  // Simulate audio permissions
  if (!audioPermissionsGranted) {
    console.log('🎵 [SIMULATION] Requesting audio permissions...');
    audioPermissionsGranted = true;
  }

  // Load track if no sound is loaded (NEW LOGIC)
  if (!sound) {
    console.log('🎵 [SIMULATION] No sound loaded, attempting to load current track...');
    if (currentTrack) {
      console.log(`🎵 [SIMULATION] Loading track: ${currentTrack.title}`);
      await loadTrack(currentTrack, true); // NEW: true
      return; // NEW: Track will auto-play
    } else {
      console.log('🎵 [SIMULATION] No current track available');
      return;
    }
  }

  // Play/pause logic
  if (isPlaying) {
    console.log('🎵 [SIMULATION] Pausing audio...');
    await sound.pauseAsync();
    console.log('🎵 [SIMULATION] Audio paused successfully');
  } else {
    console.log('🎵 [SIMULATION] Starting audio playback...');
    await sound.playAsync();
    console.log('🎵 [SIMULATION] Audio started successfully');
  }
};

// Test simulation
const runSimulation = async () => {
  console.log('🎵 [SIMULATION] Starting audio playback simulation...\n');
  
  // Set initial state
  currentTrack = mockTrack;
  sound = null;
  isPlaying = false;
  audioPermissionsGranted = false;
  
  console.log('📱 SIMULATION: User opens app and goes to More tab');
  console.log('📱 SIMULATION: User clicks on "Духовна музика" to expand');
  console.log('📱 SIMULATION: User sees play button (▶️)');
  console.log('📱 SIMULATION: User clicks play button for the FIRST time\n');
  
  // Test BEFORE fix
  console.log('🔴 BEFORE FIX - First click:');
  await togglePlaybackBeforeFix();
  console.log(`🎵 [SIMULATION] After first click - isPlaying: ${isPlaying}`);
  console.log(`🎵 [SIMULATION] After first click - sound loaded: ${!!sound}`);
  
  if (!isPlaying) {
    console.log('❌ PROBLEM: Music did not start on first click!');
    console.log('❌ User must click play button AGAIN to start music');
  } else {
    console.log('✅ SUCCESS: Music started on first click!');
  }
  
  // Reset for AFTER fix test
  sound = null;
  isPlaying = false;
  
  console.log('\n' + '='.repeat(50));
  
  // Test AFTER fix
  console.log('🟢 AFTER FIX - First click:');
  await togglePlaybackAfterFix();
  console.log(`🎵 [SIMULATION] After first click - isPlaying: ${isPlaying}`);
  console.log(`🎵 [SIMULATION] After first click - sound loaded: ${!!sound}`);
  
  if (isPlaying) {
    console.log('✅ SUCCESS: Music started on first click!');
    console.log('✅ FIX WORKED: Play button now works immediately!');
  } else {
    console.log('❌ PROBLEM: Music still did not start on first click');
  }
  
  console.log('\n🎵 SIMULATION COMPLETE');
  console.log('========================');
};

// Run the simulation
runSimulation().catch(console.error); 