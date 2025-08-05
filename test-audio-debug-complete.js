#!/usr/bin/env node

/**
 * COMPLETE AUDIO DEBUG TEST
 * Comprehensive analysis of audio system
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('🎵 COMPLETE AUDIO DEBUG TEST');
console.log('============================');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Environment variables missing!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseConnection() {
  console.log('\n🎵 1. TESTING DATABASE CONNECTION...');
  
  try {
    const { data, error } = await supabase
      .from('background_music')
      .select('id, title, file_url, is_active')
      .order('title');
    
    if (error) {
      console.log('❌ Database error:', error);
      return { success: false, tracks: [] };
    }
    
    console.log(`✅ Found ${data.length} audio tracks in database`);
    data.forEach((track, index) => {
      console.log(`   ${index + 1}. ${track.title} - ${track.is_active ? 'Active' : 'Inactive'}`);
    });
    
    return { success: true, tracks: data };
    
  } catch (error) {
    console.log('❌ Database connection failed:', error);
    return { success: false, tracks: [] };
  }
}

async function analyzeAudioContext() {
  console.log('\n🎵 2. ANALYZING AUDIO CONTEXT...');
  
  try {
    const audioContextPath = path.join(__dirname, 'src', 'contexts', 'AudioContext.tsx');
    const audioContent = fs.readFileSync(audioContextPath, 'utf8');
    
    const criticalChecks = [
      { pattern: /const togglePlayback.*async/, name: 'togglePlayback function exists' },
      { pattern: /const loadTrack.*async/, name: 'loadTrack function exists' },
      { pattern: /setIsPlaying\(true\)/, name: 'setIsPlaying(true) called' },
      { pattern: /setIsPlaying\(false\)/, name: 'setIsPlaying(false) called' },
      { pattern: /sound\.playAsync/, name: 'sound.playAsync() called' },
      { pattern: /sound\.pauseAsync/, name: 'sound.pauseAsync() called' },
      { pattern: /Audio\.Sound\.createAsync/, name: 'Audio.Sound.createAsync used' },
      { pattern: /shouldPlay.*true/, name: 'shouldPlay parameter handled' },
      { pattern: /isLooping: true/, name: 'Audio looping enabled' },
      { pattern: /playsInSilentModeIOS: true/, name: 'iOS silent mode override' }
    ];
    
    let criticalScore = 0;
    criticalChecks.forEach(check => {
      if (check.pattern.test(audioContent)) {
        console.log(`   ✅ ${check.name}`);
        criticalScore++;
      } else {
        console.log(`   ❌ ${check.name} - MISSING`);
      }
    });
    
    console.log(`\n   📊 Critical Audio Functions: ${criticalScore}/${criticalChecks.length} present`);
    
    // Check for potential issues
    const issueChecks = [
      { pattern: /togglePlayback.*togglePlayback/, name: 'Recursive togglePlayback call' },
      { pattern: /loadTrack.*loadTrack/, name: 'Recursive loadTrack call' },
      { pattern: /await.*await/, name: 'Double await statements' },
      { pattern: /setIsPlaying\(true\).*setIsPlaying\(false\)/, name: 'Conflicting isPlaying states' }
    ];
    
    let issueCount = 0;
    issueChecks.forEach(check => {
      if (check.pattern.test(audioContent)) {
        console.log(`   ⚠️  POTENTIAL ISSUE: ${check.name}`);
        issueCount++;
      }
    });
    
    if (issueCount === 0) {
      console.log('   ✅ No obvious code issues detected');
    }
    
    return { criticalScore, issueCount };
    
  } catch (error) {
    console.log('❌ Error analyzing audio context:', error.message);
    return { criticalScore: 0, issueCount: 999 };
  }
}

async function analyzeMoreTab() {
  console.log('\n🎵 3. ANALYZING MORE TAB INTEGRATION...');
  
  try {
    const moreTabPath = path.join(__dirname, 'app', '(tabs)', 'more.tsx');
    const moreContent = fs.readFileSync(moreTabPath, 'utf8');
    
    const uiChecks = [
      { pattern: /handlePlayPausePress.*async/, name: 'handlePlayPausePress function' },
      { pattern: /onPress={handlePlayPausePress}/, name: 'Play button wired correctly' },
      { pattern: /isPlaying \?.*Pause.*:.*Play/, name: 'Dynamic play/pause icon' },
      { pattern: /togglePlayback\(\)/, name: 'togglePlayback called from UI' },
      { pattern: /useAudio\(\)/, name: 'useAudio hook imported' },
      { pattern: /currentTrack/, name: 'currentTrack state accessed' },
      { pattern: /disabled={!currentTrack}/, name: 'Play button disabled when no track' }
    ];
    
    let uiScore = 0;
    uiChecks.forEach(check => {
      if (check.pattern.test(moreContent)) {
        console.log(`   ✅ ${check.name}`);
        uiScore++;
      } else {
        console.log(`   ❌ ${check.name} - MISSING`);
      }
    });
    
    console.log(`\n   📊 UI Integration: ${uiScore}/${uiChecks.length} correct`);
    
    // Check for UI issues
    const uiIssues = [
      { pattern: /handlePlayButtonPress.*onPress={handlePlayPausePress}/, name: 'Wrong handler used for play button' },
      { pattern: /onPress={handlePlayButtonPress}.*Play.*Pause/, name: 'Play button using wrong handler' }
    ];
    
    let uiIssueCount = 0;
    uiIssues.forEach(issue => {
      if (issue.pattern.test(moreContent)) {
        console.log(`   ⚠️  UI ISSUE: ${issue.name}`);
        uiIssueCount++;
      }
    });
    
    return { uiScore, uiIssueCount };
    
  } catch (error) {
    console.log('❌ Error analyzing more tab:', error.message);
    return { uiScore: 0, uiIssueCount: 999 };
  }
}

async function runCompleteTest() {
  const dbResult = await testDatabaseConnection();
  const audioResult = await analyzeAudioContext();
  const uiResult = await analyzeMoreTab();
  
  console.log('\n🎵 4. COMPLETE DIAGNOSIS...');
  console.log('===========================');
  
  const totalScore = audioResult.criticalScore + uiResult.uiScore;
  const totalIssues = audioResult.issueCount + uiResult.uiIssueCount;
  
  console.log(`📊 OVERALL SCORE: ${totalScore}/17 functions working`);
  console.log(`⚠️  TOTAL ISSUES: ${totalIssues} potential problems`);
  
  if (dbResult.success && totalScore >= 15 && totalIssues === 0) {
    console.log('\n✅ AUDIO SYSTEM SHOULD BE WORKING');
    console.log('');
    console.log('🔍 IF STILL NOT WORKING, CHECK:');
    console.log('   1. Console logs when pressing play button');
    console.log('   2. Network connectivity to Supabase');
    console.log('   3. Device volume and silent mode');
    console.log('   4. Audio permissions in device settings');
    
  } else {
    console.log('\n❌ AUDIO SYSTEM HAS PROBLEMS');
    console.log('');
    console.log('🔧 ISSUES TO FIX:');
    if (!dbResult.success) console.log('   - Database connection or tracks missing');
    if (audioResult.criticalScore < 8) console.log('   - AudioContext missing critical functions');
    if (uiResult.uiScore < 5) console.log('   - UI integration problems');
    if (totalIssues > 0) console.log('   - Code issues detected (recursive calls, etc.)');
  }
  
  console.log('\n🎵 COMPLETE AUDIO DEBUG TEST FINISHED');
  console.log('======================================');
}

runCompleteTest().catch(console.error);
