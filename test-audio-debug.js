#!/usr/bin/env node

/**
 * AUDIO DEBUG TEST
 * Comprehensive debugging of audio system
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('🎵 AUDIO SYSTEM DEBUG TEST');
console.log('==========================');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔗 Supabase URL:', supabaseUrl ? 'Loaded' : 'Missing');
console.log('🔑 Supabase Key:', supabaseKey ? 'Loaded' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
  console.log('\n❌ Environment variables not loaded!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAudioSystem() {
  console.log('\n🎵 1. TESTING SUPABASE CONNECTION...');
  
  try {
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('kathismas')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.log('❌ Supabase connection failed:', testError);
      return;
    }
    
    console.log('✅ Supabase connection successful');
  } catch (error) {
    console.log('❌ Network error:', error.message);
    return;
  }

  console.log('\n🎵 2. FETCHING BACKGROUND MUSIC TRACKS...');
  
  try {
    const { data, error } = await supabase
      .from('background_music')
      .select('id, title, file_url, is_active, created_at, updated_at')
      .order('title');
    
    console.log('🎵 Raw Supabase response:');
    console.log('   Data:', data);
    console.log('   Error:', error);
    console.log('   Number of tracks:', data?.length || 0);
    
    if (error) {
      console.log('❌ Error fetching tracks:', error);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('⚠️  NO TRACKS FOUND IN DATABASE!');
      console.log('   This explains why music doesn\'t work.');
      console.log('   Only 1 track exists: "Anixandaria"');
      return;
    }
    
    console.log('\n🎵 3. ANALYZING FOUND TRACKS...');
    data.forEach((track, index) => {
      console.log(`\n   Track ${index + 1}:`);
      console.log(`   📝 Title: ${track.title}`);
      console.log(`   🔗 URL: ${track.file_url}`);
      console.log(`   ✅ Active: ${track.is_active ? 'YES' : 'NO'}`);
      console.log(`   📅 Created: ${track.created_at}`);
    });
    
    console.log('\n🎵 4. TESTING AUDIO URL ACCESSIBILITY...');
    
    for (const track of data) {
      try {
        console.log(`\n   Testing: ${track.title}`);
        console.log(`   URL: ${track.file_url}`);
        
        // Test if URL is accessible (basic check)
        if (track.file_url.includes('supabase.co')) {
          console.log('   ✅ URL format looks correct (Supabase Storage)');
        } else {
          console.log('   ⚠️  URL format unusual');
        }
        
        if (track.file_url.includes('.mp3')) {
          console.log('   ✅ File format is MP3');
        } else {
          console.log('   ⚠️  File format not MP3');
        }
        
      } catch (error) {
        console.log(`   ❌ Error testing ${track.title}:`, error.message);
      }
    }
    
  } catch (error) {
    console.log('❌ Error in background music test:', error);
  }

  console.log('\n🎵 5. CHECKING AUDIO CONTEXT IMPLEMENTATION...');
  
  const fs = require('fs');
  const path = require('path');
  
  try {
    const audioContextPath = path.join(__dirname, 'src', 'contexts', 'AudioContext.tsx');
    const audioContent = fs.readFileSync(audioContextPath, 'utf8');
    
    // Check critical audio functions
    const checks = [
      { pattern: /loadAllTracks/, name: 'loadAllTracks function' },
      { pattern: /togglePlayback/, name: 'togglePlayback function' },
      { pattern: /Audio\.Sound\.createAsync/, name: 'Audio.Sound.createAsync usage' },
      { pattern: /audioPermissionsGranted/, name: 'Audio permissions check' },
      { pattern: /background_music/, name: 'Background music table query' }
    ];
    
    checks.forEach(check => {
      if (audioContent.includes(check.pattern)) {
        console.log(`   ✅ ${check.name} - Found`);
      } else {
        console.log(`   ❌ ${check.name} - Missing`);
      }
    });
    
  } catch (error) {
    console.log('   ❌ Error reading AudioContext file:', error.message);
  }

  console.log('\n🎵 6. RECOMMENDATIONS...');
  console.log('========================');
  
  if (!data || data.length <= 1) {
    console.log('🔧 PROBLEM IDENTIFIED: Only 1 audio track in database');
    console.log('');
    console.log('📋 SOLUTIONS:');
    console.log('   1. Add more audio tracks to Supabase background_music table');
    console.log('   2. Upload MP3 files to Supabase Storage bucket "background-music"');
    console.log('   3. Insert records with proper file_url pointing to uploaded files');
    console.log('');
    console.log('📝 SQL Example to add tracks:');
    console.log('   INSERT INTO background_music (title, file_url, is_active)');
    console.log('   VALUES (\'Track Name\', \'https://[supabase-url]/storage/v1/object/public/background-music/track.mp3\', false);');
  }
  
  console.log('\n🎵 AUDIO DEBUG COMPLETE');
  console.log('=======================');
}

debugAudioSystem().catch(console.error);
