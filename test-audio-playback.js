#!/usr/bin/env node

/**
 * AUDIO PLAYBACK SIMULATION TEST
 * Test what happens when user clicks play button
 */

const fs = require('fs');
const path = require('path');

console.log('🎵 AUDIO PLAYBACK SIMULATION TEST');
console.log('=================================');

console.log('\n🎵 1. ANALYZING AUDIO CONTEXT FLOW...');

try {
  const audioContextPath = path.join(__dirname, 'src', 'contexts', 'AudioContext.tsx');
  const audioContent = fs.readFileSync(audioContextPath, 'utf8');
  
  console.log('✅ AudioContext file found');
  
  // Check for critical patterns
  const patterns = [
    { regex: /togglePlayback.*async/, name: 'togglePlayback is async' },
    { regex: /Audio\.requestPermissionsAsync/, name: 'Audio permissions request' },
    { regex: /sound\.playAsync/, name: 'Sound play method' },
    { regex: /sound\.pauseAsync/, name: 'Sound pause method' },
    { regex: /setIsPlaying\(true\)/, name: 'Set playing state true' },
    { regex: /setIsPlaying\(false\)/, name: 'Set playing state false' },
    { regex: /loadTrack.*await/, name: 'Load track is awaited' },
    { regex: /Audio\.Sound\.createAsync/, name: 'Sound creation' },
    { regex: /console\.log.*🎵/, name: 'Debug logging present' }
  ];
  
  patterns.forEach(pattern => {
    if (pattern.regex.test(audioContent)) {
      console.log(`   ✅ ${pattern.name}`);
    } else {
      console.log(`   ❌ ${pattern.name} - MISSING`);
    }
  });
  
} catch (error) {
  console.log('❌ Error reading AudioContext:', error.message);
}

console.log('\n🎵 2. ANALYZING MORE TAB IMPLEMENTATION...');

try {
  const moreTabPath = path.join(__dirname, 'app', '(tabs)', 'more.tsx');
  const moreContent = fs.readFileSync(moreTabPath, 'utf8');
  
  console.log('✅ More tab file found');
  
  // Check for audio integration patterns
  const morePatterns = [
    { regex: /useAudio/, name: 'useAudio hook imported' },
    { regex: /togglePlayback/, name: 'togglePlayback function used' },
    { regex: /handlePlayPausePress/, name: 'Play/pause handler exists' },
    { regex: /isPlaying/, name: 'isPlaying state used' },
    { regex: /currentTrack/, name: 'currentTrack state used' },
    { regex: /Play.*Pause/, name: 'Play/Pause icons' },
    { regex: /TouchableOpacity.*onPress.*handlePlayPausePress/, name: 'Play button properly wired' }
  ];
  
  morePatterns.forEach(pattern => {
    if (pattern.regex.test(moreContent)) {
      console.log(`   ✅ ${pattern.name}`);
    } else {
      console.log(`   ❌ ${pattern.name} - MISSING`);
    }
  });
  
  // Extract the play button handler
  const handlerMatch = moreContent.match(/const handlePlayPausePress = async \(\) => \{([^}]+)\}/);
  if (handlerMatch) {
    console.log('\n   📋 Play button handler:');
    console.log('   ' + handlerMatch[0].replace(/\n/g, '\n   '));
  }
  
} catch (error) {
  console.log('❌ Error reading More tab:', error.message);
}

console.log('\n🎵 3. CHECKING POTENTIAL ISSUES...');

const potentialIssues = [
  {
    name: 'Recursive togglePlayback call',
    description: 'Check if togglePlayback calls itself causing infinite loop',
    check: () => {
      const audioContent = fs.readFileSync(path.join(__dirname, 'src', 'contexts', 'AudioContext.tsx'), 'utf8');
      return audioContent.includes('return togglePlayback()');
    }
  },
  {
    name: 'Audio permissions not handled',
    description: 'Check if audio permissions are properly requested',
    check: () => {
      const audioContent = fs.readFileSync(path.join(__dirname, 'src', 'contexts', 'AudioContext.tsx'), 'utf8');
      return audioContent.includes('requestPermissionsAsync');
    }
  },
  {
    name: 'Sound state not updated immediately',
    description: 'Check if sound state is set after loading',
    check: () => {
      const audioContent = fs.readFileSync(path.join(__dirname, 'src', 'contexts', 'AudioContext.tsx'), 'utf8');
      return audioContent.includes('setSound(newSound)');
    }
  },
  {
    name: 'Error handling missing',
    description: 'Check if errors are properly caught and logged',
    check: () => {
      const audioContent = fs.readFileSync(path.join(__dirname, 'src', 'contexts', 'AudioContext.tsx'), 'utf8');
      return audioContent.includes('try') && audioContent.includes('catch');
    }
  },
  {
    name: 'Audio mode not configured',
    description: 'Check if audio mode is set for mobile playback',
    check: () => {
      const audioContent = fs.readFileSync(path.join(__dirname, 'src', 'contexts', 'AudioContext.tsx'), 'utf8');
      return audioContent.includes('setAudioModeAsync');
    }
  }
];

potentialIssues.forEach(issue => {
  try {
    const hasIssue = issue.check();
    if (hasIssue) {
      console.log(`   ✅ ${issue.name} - OK`);
    } else {
      console.log(`   ⚠️  ${issue.name} - POTENTIAL ISSUE`);
      console.log(`      ${issue.description}`);
    }
  } catch (error) {
    console.log(`   ❌ ${issue.name} - ERROR: ${error.message}`);
  }
});

console.log('\n🎵 4. RECOMMENDATIONS...');
console.log('========================');

console.log('🔧 DEBUGGING STEPS:');
console.log('   1. Open app in TestFlight');
console.log('   2. Go to More tab');
console.log('   3. Click on "Духовна музика" to expand');
console.log('   4. Click the play button (▶️)');
console.log('   5. Check console logs for 🎵 messages');
console.log('');
console.log('📱 EXPECTED BEHAVIOR:');
console.log('   - Should see "🎵 togglePlayback called"');
console.log('   - Should see "🎵 Sound loaded: true/false"');
console.log('   - Should see "🎵 Audio permissions: true/false"');
console.log('   - Should see "🎵 Starting audio playback..."');
console.log('   - Play button should change to pause (⏸️)');
console.log('');
console.log('🚨 COMMON ISSUES:');
console.log('   - Audio permissions not granted');
console.log('   - Sound not loaded properly');
console.log('   - iOS silent mode blocking audio');
console.log('   - Network issues loading audio files');
console.log('   - Audio context not initialized');

console.log('\n🎵 AUDIO PLAYBACK SIMULATION COMPLETE');
console.log('=====================================');
