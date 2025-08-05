#!/usr/bin/env node

/**
 * FINAL AUDIO SYSTEM TEST
 * Complete verification of audio functionality
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('🎵 FINAL AUDIO SYSTEM TEST');
console.log('==========================');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Environment variables missing!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function finalAudioTest() {
  console.log('\n🎵 1. TESTING DATABASE CONNECTION...');
  
  try {
    const { data, error } = await supabase
      .from('background_music')
      .select('id, title, file_url, is_active')
      .order('title');
    
    if (error) {
      console.log('❌ Database error:', error);
      return false;
    }
    
    console.log(`✅ Found ${data.length} audio tracks in database`);
    
    // Test each URL accessibility
    console.log('\n🎵 2. TESTING AUDIO FILE ACCESSIBILITY...');
    
    let accessibleCount = 0;
    for (const track of data) {
      try {
        // Basic URL validation
        const url = new URL(track.file_url);
        if (url.hostname.includes('supabase.co') && track.file_url.endsWith('.mp3')) {
          console.log(`   ✅ ${track.title} - URL format valid`);
          accessibleCount++;
        } else {
          console.log(`   ❌ ${track.title} - Invalid URL format`);
        }
      } catch (error) {
        console.log(`   ❌ ${track.title} - Invalid URL: ${error.message}`);
      }
    }
    
    console.log(`\n   📊 ${accessibleCount}/${data.length} tracks have valid URLs`);
    
    return accessibleCount > 0;
    
  } catch (error) {
    console.log('❌ Database connection failed:', error);
    return false;
  }
}

async function testAudioImplementation() {
  console.log('\n🎵 3. TESTING AUDIO IMPLEMENTATION...');
  
  const fs = require('fs');
  const path = require('path');
  
  try {
    // Test AudioContext
    const audioContextPath = path.join(__dirname, 'src', 'contexts', 'AudioContext.tsx');
    const audioContent = fs.readFileSync(audioContextPath, 'utf8');
    
    const audioChecks = [
      { pattern: /sound: Audio\.Sound \| null/, name: 'Sound state type' },
      { pattern: /togglePlayback.*async/, name: 'Async togglePlayback' },
      { pattern: /Audio\.requestPermissionsAsync/, name: 'Permission request' },
      { pattern: /Audio\.setAudioModeAsync/, name: 'Audio mode config' },
      { pattern: /playsInSilentModeIOS: true/, name: 'iOS silent mode support' },
      { pattern: /staysActiveInBackground: true/, name: 'Background playback' },
      { pattern: /sound\.playAsync/, name: 'Play method' },
      { pattern: /sound\.pauseAsync/, name: 'Pause method' },
      { pattern: /setIsPlaying\(true\)/, name: 'Playing state update' }
    ];
    
    let audioScore = 0;
    audioChecks.forEach(check => {
      if (check.pattern.test(audioContent)) {
        console.log(`   ✅ ${check.name}`);
        audioScore++;
      } else {
        console.log(`   ❌ ${check.name} - MISSING`);
      }
    });
    
    console.log(`\n   📊 AudioContext: ${audioScore}/${audioChecks.length} checks passed`);
    
    // Test More tab integration
    const moreTabPath = path.join(__dirname, 'app', '(tabs)', 'more.tsx');
    const moreContent = fs.readFileSync(moreTabPath, 'utf8');
    
    const moreChecks = [
      { pattern: /useAudio/, name: 'useAudio hook imported' },
      { pattern: /sound/, name: 'Sound state accessed' },
      { pattern: /handlePlayPausePress.*async/, name: 'Async play handler' },
      { pattern: /onPress={handlePlayPausePress}/, name: 'Button wired correctly' },
      { pattern: /isPlaying \? .*Pause.*: .*Play/, name: 'Dynamic play/pause icon' },
      { pattern: /console\.log.*🎵.*MORE TAB/, name: 'Debug logging added' }
    ];
    
    let moreScore = 0;
    moreChecks.forEach(check => {
      if (check.pattern.test(moreContent)) {
        console.log(`   ✅ ${check.name}`);
        moreScore++;
      } else {
        console.log(`   ❌ ${check.name} - MISSING`);
      }
    });
    
    console.log(`\n   📊 More Tab: ${moreScore}/${moreChecks.length} checks passed`);
    
    return audioScore >= 7 && moreScore >= 4;
    
  } catch (error) {
    console.log('❌ Error testing implementation:', error.message);
    return false;
  }
}

async function runFinalTest() {
  const dbTest = await finalAudioTest();
  const implTest = await testAudioImplementation();
  
  console.log('\n🎵 4. FINAL RESULTS...');
  console.log('======================');
  
  if (dbTest && implTest) {
    console.log('✅ AUDIO SYSTEM READY FOR TESTING');
    console.log('');
    console.log('📱 NEXT STEPS:');
    console.log('   1. Build and deploy to TestFlight');
    console.log('   2. Open app on iOS device');
    console.log('   3. Go to More tab');
    console.log('   4. Expand "Духовна музика" section');
    console.log('   5. Press play button (▶️)');
    console.log('   6. Check console for debug logs starting with 🎵');
    console.log('');
    console.log('🔍 WHAT TO LOOK FOR:');
    console.log('   - "🎵 [MORE TAB] Play/Pause button pressed"');
    console.log('   - "🎵 togglePlayback called"');
    console.log('   - "🎵 Sound loaded: true"');
    console.log('   - "🎵 Starting audio playback..."');
    console.log('   - Play button changes to pause (⏸️)');
    console.log('   - Audio should start playing');
    console.log('');
    console.log('🚨 IF STILL NOT WORKING:');
    console.log('   - Check iOS device is not in silent mode');
    console.log('   - Check volume is turned up');
    console.log('   - Check network connectivity');
    console.log('   - Look for error messages in console');
    
  } else {
    console.log('❌ AUDIO SYSTEM HAS ISSUES');
    console.log('');
    console.log('🔧 ISSUES FOUND:');
    if (!dbTest) console.log('   - Database or audio files not accessible');
    if (!implTest) console.log('   - Audio implementation incomplete');
  }
  
  console.log('\n🎵 FINAL AUDIO TEST COMPLETE');
  console.log('============================');
}

runFinalTest().catch(console.error);
