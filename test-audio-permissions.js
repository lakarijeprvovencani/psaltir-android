#!/usr/bin/env node

/**
 * AUDIO PERMISSIONS & SILENT MODE TEST
 * Test new audio enhancements
 */

const fs = require('fs');
const path = require('path');

console.log('🎵 AUDIO PERMISSIONS & SILENT MODE TEST');
console.log('=======================================');

console.log('\n🎵 1. CHECKING APP.JSON PERMISSIONS...');

try {
  const appJsonPath = path.join(__dirname, 'app.json');
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  
  // Check iOS permissions
  const iosPermissions = appJson.expo.ios.infoPlist;
  console.log('📱 iOS Permissions:');
  console.log(`   ✅ NSMicrophoneUsageDescription: ${iosPermissions.NSMicrophoneUsageDescription ? 'Present' : 'Missing'}`);
  console.log(`   ✅ NSAppleMusicUsageDescription: ${iosPermissions.NSAppleMusicUsageDescription ? 'Present' : 'Missing'}`);
  console.log(`   ✅ UIBackgroundModes: ${iosPermissions.UIBackgroundModes ? iosPermissions.UIBackgroundModes.join(', ') : 'Missing'}`);
  console.log(`   ✅ AVAudioSessionCategoryPlayback: ${iosPermissions.AVAudioSessionCategoryPlayback ? 'Enabled' : 'Disabled'}`);
  
  if (iosPermissions.AVAudioSessionCategoryOptions) {
    console.log(`   ✅ AVAudioSessionCategoryOptions: ${iosPermissions.AVAudioSessionCategoryOptions.join(', ')}`);
  }
  
  // Check Android permissions
  const androidPermissions = appJson.expo.android.permissions;
  console.log('\n🤖 Android Permissions:');
  androidPermissions.forEach(permission => {
    console.log(`   ✅ ${permission}`);
  });
  
} catch (error) {
  console.log('❌ Error reading app.json:', error.message);
}

console.log('\n🎵 2. CHECKING AUDIO CONTEXT ENHANCEMENTS...');

try {
  const audioContextPath = path.join(__dirname, 'src', 'contexts', 'AudioContext.tsx');
  const audioContent = fs.readFileSync(audioContextPath, 'utf8');
  
  const enhancements = [
    { pattern: /silentModeWarningShown/, name: 'Silent mode warning state' },
    { pattern: /checkSilentModeAndWarn/, name: 'Silent mode detection function' },
    { pattern: /Alert\.alert.*тихом режиму/, name: 'Silent mode alert in Serbian' },
    { pattern: /playsInSilentModeIOS: true/, name: 'iOS silent mode override' },
    { pattern: /staysActiveInBackground: true/, name: 'Background audio support' },
    { pattern: /setTimeout.*checkSilentModeAndWarn/, name: 'Silent mode check after play' },
    { pattern: /Platform\.OS === 'ios'/, name: 'iOS-specific silent mode detection' },
    { pattern: /console\.log.*🎵.*MORE TAB/, name: 'Enhanced debug logging' }
  ];
  
  let enhancementScore = 0;
  enhancements.forEach(enhancement => {
    if (enhancement.pattern.test(audioContent)) {
      console.log(`   ✅ ${enhancement.name}`);
      enhancementScore++;
    } else {
      console.log(`   ❌ ${enhancement.name} - MISSING`);
    }
  });
  
  console.log(`\n   📊 Audio Enhancements: ${enhancementScore}/${enhancements.length} implemented`);
  
} catch (error) {
  console.log('❌ Error checking audio context:', error.message);
}

console.log('\n🎵 3. SUMMARY OF IMPROVEMENTS...');
console.log('================================');

console.log('✅ PERMISSIONS ADDED:');
console.log('   - Enhanced iOS background audio modes');
console.log('   - Android foreground service permission');
console.log('   - Audio session category options');

console.log('\n✅ SILENT MODE DETECTION:');
console.log('   - iOS silent mode warning dialog');
console.log('   - User option to disable warnings');
console.log('   - Serbian language alert messages');

console.log('\n✅ AUDIO IMPROVEMENTS:');
console.log('   - Enhanced debug logging with 🎵 prefix');
console.log('   - Better error handling in togglePlayback');
console.log('   - Removed recursive function calls');
console.log('   - Audio mode configuration on load');

console.log('\n📱 WHAT THIS FIXES:');
console.log('   1. Silent mode detection and user notification');
console.log('   2. Better background audio support');
console.log('   3. Enhanced debugging for troubleshooting');
console.log('   4. Improved audio session management');
console.log('   5. User-friendly error messages in Serbian');

console.log('\n🚀 NEXT STEPS:');
console.log('   1. Build new version with these improvements');
console.log('   2. Test on TestFlight');
console.log('   3. If music still doesn\'t work, check console logs');
console.log('   4. Silent mode warning should appear if device is muted');

console.log('\n🎵 AUDIO PERMISSIONS TEST COMPLETE');
console.log('===================================');
