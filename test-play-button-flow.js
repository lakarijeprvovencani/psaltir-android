#!/usr/bin/env node

/**
 * PLAY BUTTON FLOW TEST
 * Simulate exact flow when user clicks play
 */

const fs = require('fs');
const path = require('path');

console.log('🎵 PLAY BUTTON FLOW TEST');
console.log('========================');

function analyzePlayButtonFlow() {
  console.log('\n🎵 1. ANALYZING PLAY BUTTON CLICK FLOW...');
  
  try {
    // Read More tab file
    const moreTabPath = path.join(__dirname, 'app', '(tabs)', 'more.tsx');
    const moreContent = fs.readFileSync(moreTabPath, 'utf8');
    
    // Read AudioContext file
    const audioContextPath = path.join(__dirname, 'src', 'contexts', 'AudioContext.tsx');
    const audioContent = fs.readFileSync(audioContextPath, 'utf8');
    
    console.log('📱 STEP 1: User clicks play button');
    
    // Check if play button calls correct handler
    const playButtonMatch = moreContent.match(/onPress={([^}]+)}[^>]*>\s*{isPlaying \? \(/);
    if (playButtonMatch) {
      const handler = playButtonMatch[1];
      console.log(`   ✅ Play button calls: ${handler}`);
      
      if (handler === 'handlePlayPausePress') {
        console.log('   ✅ Correct handler used');
      } else {
        console.log(`   ❌ Wrong handler! Should be handlePlayPausePress, but is ${handler}`);
        return false;
      }
    } else {
      console.log('   ❌ Could not find play button handler');
      return false;
    }
    
    console.log('\n📱 STEP 2: handlePlayPausePress function');
    
    // Check handlePlayPausePress implementation
    const handlePlayPauseMatch = moreContent.match(/const handlePlayPausePress = async \(\) => \{([^}]+(?:\{[^}]*\}[^}]*)*)\}/s);
    if (handlePlayPauseMatch) {
      const functionBody = handlePlayPauseMatch[1];
      console.log('   ✅ handlePlayPausePress function found');
      
      if (functionBody.includes('togglePlayback()')) {
        console.log('   ✅ Calls togglePlayback()');
      } else {
        console.log('   ❌ Does not call togglePlayback()');
        return false;
      }
      
      if (functionBody.includes('console.log')) {
        console.log('   ✅ Has debug logging');
      } else {
        console.log('   ⚠️  No debug logging');
      }
    } else {
      console.log('   ❌ handlePlayPausePress function not found');
      return false;
    }
    
    console.log('\n📱 STEP 3: togglePlayback function');
    
    // Check togglePlayback implementation
    const togglePlaybackMatch = audioContent.match(/const togglePlayback = async \(\) => \{([^}]+(?:\{[^}]*\}[^}]*)*)\}/s);
    if (togglePlaybackMatch) {
      const functionBody = togglePlaybackMatch[1];
      console.log('   ✅ togglePlayback function found');
      
      // Check critical parts
      const checks = [
        { pattern: /console\.log.*togglePlayback called/, name: 'Entry logging' },
        { pattern: /if \(!sound\)/, name: 'No sound check' },
        { pattern: /loadTrack.*true/, name: 'Load and play logic' },
        { pattern: /if \(isPlaying\)/, name: 'Playing state check' },
        { pattern: /sound\.pauseAsync/, name: 'Pause functionality' },
        { pattern: /sound\.playAsync/, name: 'Play functionality' },
        { pattern: /setIsPlaying\(true\)/, name: 'Set playing true' },
        { pattern: /setIsPlaying\(false\)/, name: 'Set playing false' }
      ];
      
      let checksPassed = 0;
      checks.forEach(check => {
        if (check.pattern.test(functionBody)) {
          console.log(`   ✅ ${check.name}`);
          checksPassed++;
        } else {
          console.log(`   ❌ ${check.name} - MISSING`);
        }
      });
      
      console.log(`\n   📊 togglePlayback checks: ${checksPassed}/${checks.length} passed`);
      
      if (checksPassed < 6) {
        console.log('   ❌ Critical functionality missing in togglePlayback');
        return false;
      }
    } else {
      console.log('   ❌ togglePlayback function not found');
      return false;
    }
    
    console.log('\n📱 STEP 4: loadTrack function');
    
    // Check loadTrack implementation
    const loadTrackMatch = audioContent.match(/const loadTrack = async \(([^)]+)\) => \{([^}]+(?:\{[^}]*\}[^}]*)*)\}/s);
    if (loadTrackMatch) {
      const params = loadTrackMatch[1];
      const functionBody = loadTrackMatch[2];
      console.log('   ✅ loadTrack function found');
      
      if (params.includes('shouldPlay')) {
        console.log('   ✅ shouldPlay parameter exists');
        
        if (functionBody.includes('if (shouldPlay)')) {
          console.log('   ✅ shouldPlay logic implemented');
          
          if (functionBody.includes('newSound.playAsync()')) {
            console.log('   ✅ Auto-play functionality exists');
          } else {
            console.log('   ❌ Auto-play functionality missing');
            return false;
          }
        } else {
          console.log('   ❌ shouldPlay logic not implemented');
          return false;
        }
      } else {
        console.log('   ❌ shouldPlay parameter missing');
        return false;
      }
    } else {
      console.log('   ❌ loadTrack function not found');
      return false;
    }
    
    console.log('\n📱 STEP 5: UI State Updates');
    
    // Check if isPlaying is properly used in UI
    const isPlayingUsage = moreContent.match(/isPlaying \? \([^)]+\) : \([^)]+\)/);
    if (isPlayingUsage) {
      console.log('   ✅ isPlaying state used for icon switching');
      console.log(`   ✅ Icon logic: ${isPlayingUsage[0]}`);
    } else {
      console.log('   ❌ isPlaying state not used for icon switching');
      return false;
    }
    
    return true;
    
  } catch (error) {
    console.log('❌ Error analyzing play button flow:', error.message);
    return false;
  }
}

function provideSolution() {
  console.log('\n🎵 2. SOLUTION ANALYSIS...');
  console.log('==========================');
  
  const flowWorking = analyzePlayButtonFlow();
  
  if (flowWorking) {
    console.log('\n✅ PLAY BUTTON FLOW IS CORRECT');
    console.log('');
    console.log('🔍 POSSIBLE CAUSES OF PROBLEM:');
    console.log('   1. Audio permissions not granted on device');
    console.log('   2. Network issues loading audio files');
    console.log('   3. Device in silent mode');
    console.log('   4. Audio session not properly configured');
    console.log('   5. React state not updating properly');
    console.log('');
    console.log('🔧 DEBUGGING STEPS:');
    console.log('   1. Check console logs when clicking play');
    console.log('   2. Look for "🎵 togglePlayback called" message');
    console.log('   3. Check if "🎵 Audio started successfully" appears');
    console.log('   4. Verify isPlaying state changes in logs');
    console.log('   5. Test with device volume up and silent mode off');
    
  } else {
    console.log('\n❌ PLAY BUTTON FLOW HAS ISSUES');
    console.log('');
    console.log('🔧 NEED TO FIX:');
    console.log('   - Check the specific issues listed above');
    console.log('   - Ensure all functions are properly implemented');
    console.log('   - Verify state management is working');
  }
  
  console.log('\n🎵 PLAY BUTTON FLOW TEST COMPLETE');
  console.log('==================================');
}

provideSolution();
