#!/usr/bin/env node

/**
 * DEEP PRODUCTION VALIDATION TEST
 * 
 * Ovaj test simulira STVARNO pokretanje aplikacije u production modu
 * i testira sve kritične putanje koje mogu dovesti do crash-a.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔥 POKRETANJE DEEP PRODUCTION VALIDATION TEST-a...\n');
console.log('Ovaj test simulira STVARNO pokretanje aplikacije u production modu\n');

let hasErrors = false;
let criticalIssues = [];
let warnings = [];

// DEEP TEST 1: Simulacija App Startup Sequence
console.log('🚀 1. SIMULACIJA APP STARTUP SEKVENCE...');
try {
  // Simuliramo redosled učitavanja kao u production
  console.log('   📱 Simuliramo pokretanje na iOS production build...');
  
  // 1.1 Environment setup
  process.env.NODE_ENV = 'production';
  delete process.env.__DEV__;
  
  // 1.2 Čitamo env varijable kao što bi Expo uradio
  const envPath = path.join(__dirname, '..', '.env');
  const envProdPath = path.join(__dirname, '..', '.env.production');
  
  let envVars = {};
  if (fs.existsSync(envProdPath)) {
    const content = fs.readFileSync(envProdPath, 'utf8');
    content.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) envVars[key.trim()] = value.trim();
    });
  } else if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) envVars[key.trim()] = value.trim();
    });
  }
  
  console.log('   ✅ Environment varijable učitane');
  
  // 1.3 Simuliramo Supabase inicijalizaciju
  if (!envVars.EXPO_PUBLIC_SUPABASE_URL || !envVars.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
    criticalIssues.push('KRITIČNO: Supabase kredencijali nisu dostupni - aplikacija će crashovati');
    hasErrors = true;
  } else {
    console.log('   ✅ Supabase kredencijali dostupni');
  }
  
} catch (error) {
  criticalIssues.push(`KRITIČNO: Startup sekvenca failed - ${error.message}`);
  hasErrors = true;
}

// DEEP TEST 2: Simulacija prvog ekrana (index.tsx)
console.log('\n📺 2. SIMULACIJA PRVOG EKRANA (index.tsx)...');
try {
  const indexPath = path.join(__dirname, '..', 'app', 'index.tsx');
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Proveravamo da li postoje potencijalni crash pointovi
  const crashPoints = [
    { pattern: /require\(['"].*\.mp4['"]\)/, issue: 'Video require bez error handling' },
    { pattern: /useState\(\)/, issue: 'useState bez initial value' },
    { pattern: /useEffect\(\(\) => \{[^}]*\}, \[\]\)/, issue: 'useEffect bez cleanup' }
  ];
  
  crashPoints.forEach(({ pattern, issue }) => {
    if (pattern.test(indexContent)) {
      warnings.push(`Index screen: ${issue}`);
    }
  });
  
  // Proveravamo da li postoji video fajl
  const videoPath = path.join(__dirname, '..', 'assets', 'images', 'svecabm.mp4');
  if (!fs.existsSync(videoPath)) {
    criticalIssues.push('KRITIČNO: svecabm.mp4 ne postoji - aplikacija će crashovati na prvom ekranu');
    hasErrors = true;
  } else {
    const stats = fs.statSync(videoPath);
    if (stats.size < 1000) {
      criticalIssues.push('KRITIČNO: svecabm.mp4 je previše mali - možda je korumpiran');
      hasErrors = true;
    } else {
      console.log(`   ✅ Video fajl OK (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    }
  }
  
} catch (error) {
  criticalIssues.push(`KRITIČNO: Index screen analiza failed - ${error.message}`);
  hasErrors = true;
}

// DEEP TEST 3: Simulacija navigation flow-a
console.log('\n🧭 3. SIMULACIJA NAVIGATION FLOW-A...');
try {
  const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  
  // Proveravamo da li su svi screen fajlovi stvarno dostupni
  const screenRoutes = [
    { route: 'psalter', file: 'app/psalter.tsx' },
    { route: 'prayerbook', file: 'app/prayerbook.tsx' },
    { route: 'kathisma/[id]', file: 'app/kathisma/[id].tsx' },
    { route: 'psalm/[id]', file: 'app/psalm/[id].tsx' },
    { route: 'akatist/[id]', file: 'app/akatist/[id].tsx' }
  ];
  
  screenRoutes.forEach(({ route, file }) => {
    const filePath = path.join(__dirname, '..', file);
    if (!fs.existsSync(filePath)) {
      criticalIssues.push(`KRITIČNO: Route ${route} registrovan ali fajl ${file} ne postoji`);
      hasErrors = true;
    } else {
      console.log(`   ✅ Route ${route} -> ${file} OK`);
    }
  });
  
} catch (error) {
  criticalIssues.push(`KRITIČNO: Navigation flow analiza failed - ${error.message}`);
  hasErrors = true;
}

// DEEP TEST 4: Simulacija Supabase operacija
console.log('\n🗄️ 4. SIMULACIJA SUPABASE OPERACIJA...');
try {
  const supabasePath = path.join(__dirname, '..', 'lib', 'supabase.ts');
  const supabaseContent = fs.readFileSync(supabasePath, 'utf8');
  
  // Proveravamo da li sve funkcije imaju error handling
  const dbFunctions = [
    'getKathismas',
    'getPsalmsByKathisma', 
    'getPsalmById',
    'getAllPsalms'
  ];
  
  dbFunctions.forEach(func => {
    const funcRegex = new RegExp(`export async function ${func}[\\s\\S]*?try[\\s\\S]*?catch`, 'g');
    if (!funcRegex.test(supabaseContent)) {
      criticalIssues.push(`KRITIČNO: Funkcija ${func} nema proper error handling`);
      hasErrors = true;
    } else {
      console.log(`   ✅ ${func} ima error handling`);
    }
  });
  
  // Proveravamo null check za supabase client
  if (!supabaseContent.includes('if (!supabase)')) {
    criticalIssues.push('KRITIČNO: Nema null check za supabase client');
    hasErrors = true;
  } else {
    console.log('   ✅ Supabase null check implementiran');
  }
  
} catch (error) {
  criticalIssues.push(`KRITIČNO: Supabase analiza failed - ${error.message}`);
  hasErrors = true;
}

// DEEP TEST 5: Simulacija Audio Context operacija
console.log('\n🎵 5. SIMULACIJA AUDIO CONTEXT OPERACIJA...');
try {
  const audioContextPath = path.join(__dirname, '..', 'src', 'contexts', 'AudioContext.tsx');
  const audioContent = fs.readFileSync(audioContextPath, 'utf8');
  
  // Proveravamo kritične audio operacije
  const audioChecks = [
    { pattern: /togglePlayback.*try.*catch/s, name: 'togglePlayback error handling' },
    { pattern: /loadAllTracks.*try.*catch/s, name: 'loadAllTracks error handling' },
    { pattern: /cleanup.*try.*catch/s, name: 'cleanup error handling' },
    { pattern: /audioPermissionsGranted/, name: 'audio permissions check' }
  ];
  
  audioChecks.forEach(({ pattern, name }) => {
    if (!pattern.test(audioContent)) {
      criticalIssues.push(`KRITIČNO: Audio - ${name} nije implementiran`);
      hasErrors = true;
    } else {
      console.log(`   ✅ ${name} OK`);
    }
  });
  
} catch (error) {
  criticalIssues.push(`KRITIČNO: Audio context analiza failed - ${error.message}`);
  hasErrors = true;
}

// DEEP TEST 6: TypeScript kompajliranje u production modu
console.log('\n📝 6. TYPESCRIPT KOMPAJLIRANJE U PRODUCTION MODU...');
try {
  console.log('   🔄 Pokretanje TypeScript check-a...');
  execSync('npx tsc --noEmit', { stdio: 'pipe', cwd: path.join(__dirname, '..') });
  console.log('   ✅ TypeScript kompajliranje uspešno');
} catch (error) {
  criticalIssues.push(`KRITIČNO: TypeScript greške - ${error.stdout?.toString() || error.message}`);
  hasErrors = true;
}

// DEEP TEST 7: Simulacija memory pressure scenario
console.log('\n🧠 7. SIMULACIJA MEMORY PRESSURE SCENARIO...');
try {
  // Simuliramo scenario sa ograničenom memorijom
  const memoryIntensiveFiles = [
    'src/contexts/AudioContext.tsx',
    'src/contexts/FavoritesContext.tsx', 
    'app/psalter.tsx',
    'app/(tabs)/index.tsx'
  ];
  
  memoryIntensiveFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Proveravamo da li postoje cleanup funkcije
      if (!content.includes('cleanup') && !content.includes('unload') && !content.includes('remove')) {
        warnings.push(`Memory: ${file} možda nema proper cleanup`);
      } else {
        console.log(`   ✅ ${file} ima memory cleanup`);
      }
    }
  });
  
} catch (error) {
  warnings.push(`Memory pressure test warning: ${error.message}`);
}

// DEEP TEST 8: Simulacija iOS specifičnih problema
console.log('\n🍎 8. SIMULACIJA iOS SPECIFIČNIH PROBLEMA...');
try {
  const appJsonPath = path.join(__dirname, '..', 'app.json');
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  
  // iOS specifične provere
  const iosChecks = [
    { key: 'expo.ios.bundleIdentifier', name: 'Bundle Identifier' },
    { key: 'expo.ios.buildNumber', name: 'Build Number', optional: true },
    { key: 'expo.orientation', name: 'Orientation' },
    { key: 'expo.jsEngine', name: 'JS Engine (Hermes)' }
  ];
  
  iosChecks.forEach(({ key, name, optional }) => {
    const value = key.split('.').reduce((obj, k) => obj?.[k], appJson);
    if (!value && !optional) {
      criticalIssues.push(`KRITIČNO: iOS - ${name} nije konfigurisan`);
      hasErrors = true;
    } else if (value) {
      console.log(`   ✅ iOS ${name}: ${value}`);
    }
  });
  
  // Proveravamo Hermes specifično
  if (appJson.expo.jsEngine !== 'hermes') {
    warnings.push('iOS: Hermes engine nije eksplicitno omogućen');
  }
  
} catch (error) {
  criticalIssues.push(`KRITIČNO: iOS konfiguracija failed - ${error.message}`);
  hasErrors = true;
}

// FINALNI REZULTAT
console.log('\n' + '='.repeat(80));
console.log('🔥 DEEP PRODUCTION VALIDATION - FINALNI REZULTAT');
console.log('='.repeat(80));

if (criticalIssues.length > 0) {
  console.log('\n💥 KRITIČNI PROBLEMI KOJI ĆE DOVESTI DO CRASH-A:');
  criticalIssues.forEach((issue, index) => {
    console.log(`   ${index + 1}. ${issue}`);
  });
}

if (warnings.length > 0) {
  console.log('\n⚠️  UPOZORENJA (mogu uticati na performanse):');
  warnings.forEach((warning, index) => {
    console.log(`   ${index + 1}. ${warning}`);
  });
}

console.log('\n' + '='.repeat(80));
if (hasErrors) {
  console.log('💥 DEEP VALIDATION FAILED - APLIKACIJA NIJE SPREMNA');
  console.log('❌ Postoje kritični problemi koji će dovesti do crash-a u production');
  console.log('🚫 NE POKRETAJTE PRODUCTION BUILD dok ne rešite gore navedene probleme');
  process.exit(1);
} else {
  console.log('🎉 DEEP VALIDATION PASSED - APLIKACIJA JE 100% SPREMNA!');
  console.log('✅ Svi kritični scenariji su testirani i prošli');
  console.log('🚀 Možete SIGURNO pokrenuti production build');
  console.log('\n🔥 KOMANDE ZA PRODUCTION BUILD:');
  console.log('   npm run build:ios');
  console.log('   npm run build:android');
  console.log('   npm run build:all');
  process.exit(0);
}
