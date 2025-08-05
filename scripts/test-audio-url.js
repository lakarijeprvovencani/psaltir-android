#!/usr/bin/env node

/**
 * TEST AUDIO URL SCRIPT
 * 
 * Testira da li je Supabase audio URL dostupan i valjan
 */

const https = require('https');

const audioUrl = 'https://zabgchwtarnloaieysam.supabase.co/storage/v1/object/public/background-music/01_Anixandaria.mp3';

console.log('🎵 Testiranje audio URL-a...');
console.log('🔗 URL:', audioUrl);

https.get(audioUrl, (res) => {
  console.log('\n📊 Response Status:', res.statusCode);
  console.log('📊 Content-Type:', res.headers['content-type']);
  console.log('📊 Content-Length:', res.headers['content-length']);
  
  if (res.statusCode === 200) {
    console.log('\n✅ Audio URL je dostupan!');
    console.log('🎵 Fajl veličina:', Math.round(parseInt(res.headers['content-length']) / 1024 / 1024 * 100) / 100, 'MB');
  } else {
    console.log('\n❌ Audio URL nije dostupan!');
    console.log('🔴 Status kod:', res.statusCode);
  }
  
  res.on('data', () => {
    // Just consume the data, don't store it
  });
  
  res.on('end', () => {
    console.log('\n🏁 Test završen.');
  });
  
}).on('error', (err) => {
  console.log('\n❌ Greška pri testiranju URL-a:');
  console.error(err.message);
});
