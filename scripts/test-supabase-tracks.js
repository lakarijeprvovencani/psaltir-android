#!/usr/bin/env node

/**
 * TEST SUPABASE TRACKS SCRIPT
 * 
 * Testira direktno Supabase konekciju i prikazuje sve track-ove
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

console.log('🎵 Testiranje Supabase background_music tabele...\n');

// Učitaj environment varijable
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    if (line.includes('=') && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      process.env[key.trim()] = value.trim();
    }
  });
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔗 Supabase URL:', supabaseUrl ? 'Loaded' : 'Missing');
console.log('🔑 Supabase Key:', supabaseKey ? 'Loaded' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
  console.log('\n❌ Environment varijable nisu učitane!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBackgroundMusic() {
  try {
    console.log('\n🎵 Fetching all background music tracks...');
    
    const { data, error } = await supabase
      .from('background_music')
      .select('id, title, file_url, is_active, created_at, updated_at')
      .order('title');
    
    if (error) {
      console.log('❌ Greška pri učitavanju:', error);
      return;
    }
    
    console.log('\n📊 Rezultati:');
    console.log('📈 Broj track-ova:', data?.length || 0);
    
    if (data && data.length > 0) {
      console.log('\n🎵 Lista svih track-ova:');
      data.forEach((track, index) => {
        console.log(`\n${index + 1}. ${track.title}`);
        console.log(`   ID: ${track.id}`);
        console.log(`   URL: ${track.file_url}`);
        console.log(`   Active: ${track.is_active ? 'YES' : 'NO'}`);
        console.log(`   Created: ${track.created_at}`);
      });
      
      // Test URL dostupnosti
      console.log('\n🔗 Testiranje URL dostupnosti...');
      for (const track of data) {
        try {
          const response = await fetch(track.file_url, { method: 'HEAD' });
          console.log(`   ${track.title}: ${response.status === 200 ? '✅ OK' : '❌ ' + response.status}`);
        } catch (err) {
          console.log(`   ${track.title}: ❌ Error - ${err.message}`);
        }
      }
    } else {
      console.log('\n📭 Nema track-ova u bazi!');
    }
    
  } catch (error) {
    console.log('\n❌ Greška:', error.message);
  }
}

testBackgroundMusic();
