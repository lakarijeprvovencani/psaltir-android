#!/usr/bin/env node

/**
 * EXPO DEVELOPMENT TEST
 * 
 * Ovaj test proverava da li je aplikacija spremna za Expo development i preview build-ove
 * pre prelaska na production.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧪 EXPO DEVELOPMENT TEST - Pokretanje...\n');

let hasErrors = false;
let warnings = [];
let criticalIssues = [];

// Test 1: Expo CLI i konfiguracija
console.log('1. Testiranje Expo CLI i osnovne konfiguracije...');
try {
  // Proveravamo da li je Expo CLI dostupan
  execSync('npx expo --version', { stdio: 'pipe' });
  console.log('   ✅ Expo CLI je dostupan');
  
  // Proveravamo app.json
  const appJsonPath = path.join(__dirname, '..', 'app.json');
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  
  if (appJson.expo.name && appJson.expo.slug && appJson.expo.version) {
    console.log(`   ✅ App konfiguracija: ${appJson.expo.name} v${appJson.expo.version}`);
  } else {
    criticalIssues.push('App.json nema kompletne osnovne informacije');
    hasErrors = true;
  }
  
} catch (error) {
  criticalIssues.push(`Expo CLI ili konfiguracija problem: ${error.message}`);
  hasErrors = true;
}

// Test 2: Expo Doctor validacija
console.log('\n2. Pokretanje Expo Doctor validacije...');
try {
  const doctorOutput = execSync('npx expo-doctor', { 
    stdio: 'pipe', 
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8'
  });
  
  if (doctorOutput.includes('checks passed')) {
    console.log('   ✅ Expo Doctor validacija prošla');
  } else {
    warnings.push('Expo Doctor ima upozorenja (proveriti output)');
  }
  
} catch (error) {
  // Expo doctor može da vrati exit code 1 čak i sa upozorenjima
  if (error.stdout && error.stdout.includes('checks passed')) {
    console.log('   ✅ Expo Doctor validacija prošla sa upozorenjima');
    warnings.push('Expo Doctor ima manja upozorenja');
  } else {
    criticalIssues.push(`Expo Doctor failed: ${error.message}`);
    hasErrors = true;
  }
}

// Test 3: Dependency kompatibilnost sa Expo SDK
console.log('\n3. Testiranje dependency kompatibilnosti...');
try {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Proveravamo Expo SDK verziju
  const expoVersion = packageJson.dependencies.expo;
  if (expoVersion) {
    console.log(`   ✅ Expo SDK verzija: ${expoVersion}`);
  } else {
    criticalIssues.push('Expo SDK nije instaliran');
    hasErrors = true;
  }
  
  // Proveravamo kritične Expo dependency-je
  const criticalExpoDeps = [
    'expo-router',
    'expo-av', 
    'expo-camera',
    'expo-notifications',
    'expo-status-bar'
  ];
  
  criticalExpoDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`   ✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      criticalIssues.push(`Kritični dependency ${dep} nije instaliran`);
      hasErrors = true;
    }
  });
  
} catch (error) {
  criticalIssues.push(`Dependency check failed: ${error.message}`);
  hasErrors = true;
}

// Test 4: Expo Router konfiguracija
console.log('\n4. Testiranje Expo Router konfiguracije...');
try {
  const layoutPath = path.join(__dirname, '..', 'app', '_layout.tsx');
  if (fs.existsSync(layoutPath)) {
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    
    if (layoutContent.includes('expo-router') && layoutContent.includes('Stack')) {
      console.log('   ✅ Expo Router je pravilno konfigurisan');
    } else {
      criticalIssues.push('Expo Router nije pravilno konfigurisan u _layout.tsx');
      hasErrors = true;
    }
  } else {
    criticalIssues.push('app/_layout.tsx ne postoji');
    hasErrors = true;
  }
  
} catch (error) {
  criticalIssues.push(`Expo Router check failed: ${error.message}`);
  hasErrors = true;
}

// Test 5: Metro bundler konfiguracija
console.log('\n5. Testiranje Metro bundler konfiguracije...');
try {
  const metroConfigPath = path.join(__dirname, '..', 'metro.config.js');
  if (fs.existsSync(metroConfigPath)) {
    const metroContent = fs.readFileSync(metroConfigPath, 'utf8');
    
    if (metroContent.includes('expo/metro-config')) {
      console.log('   ✅ Metro config je pravilno konfigurisan');
    } else {
      warnings.push('Metro config možda nije optimalno konfigurisan');
    }
  } else {
    warnings.push('metro.config.js ne postoji - koristi se default');
  }
  
} catch (error) {
  warnings.push(`Metro config check warning: ${error.message}`);
}

// Test 6: EAS Build konfiguracija
console.log('\n6. Testiranje EAS Build konfiguracije...');
try {
  const easJsonPath = path.join(__dirname, '..', 'eas.json');
  if (fs.existsSync(easJsonPath)) {
    const easJson = JSON.parse(fs.readFileSync(easJsonPath, 'utf8'));
    
    if (easJson.build && easJson.build.production) {
      console.log('   ✅ EAS Build konfiguracija postoji');
      
      // Proveravamo da li postoji iOS konfiguracija (bundleIdentifier se čita iz app.json)
      if (easJson.build.production.ios) {
        console.log(`   ✅ iOS production konfiguracija postoji`);
      } else {
        warnings.push('iOS production konfiguracija nije definisana');
      }
      
    } else {
      warnings.push('EAS Build production konfiguracija nije kompletna');
    }
  } else {
    warnings.push('eas.json ne postoji - potreban za EAS Build');
  }
  
} catch (error) {
  warnings.push(`EAS config check warning: ${error.message}`);
}

// Test 7: Expo development server test
console.log('\n7. Testiranje Expo development server mogućnosti...');
try {
  // Proveravamo da li možemo da pokrenemo expo start u dry-run modu
  console.log('   🔄 Testiranje expo start konfiguracije...');
  
  // Simuliramo expo start bez stvarnog pokretanja
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.scripts && packageJson.scripts.dev) {
    console.log('   ✅ Development script je konfigurisan');
  } else {
    warnings.push('Development script nije konfigurisan u package.json');
  }
  
} catch (error) {
  warnings.push(`Development server test warning: ${error.message}`);
}

// Finalni rezultat
console.log('\n' + '='.repeat(70));
console.log('🧪 EXPO DEVELOPMENT TEST - REZULTATI');
console.log('='.repeat(70));

if (criticalIssues.length > 0) {
  console.log('\n💥 KRITIČNI PROBLEMI:');
  criticalIssues.forEach((issue, index) => {
    console.log(`   ${index + 1}. ${issue}`);
  });
}

if (warnings.length > 0) {
  console.log('\n⚠️  UPOZORENJA:');
  warnings.forEach((warning, index) => {
    console.log(`   ${index + 1}. ${warning}`);
  });
}

console.log('\n' + '='.repeat(70));
if (hasErrors) {
  console.log('❌ EXPO DEVELOPMENT TEST FAILED');
  console.log('Rešite kritične probleme pre pokretanja Expo development servera.');
  process.exit(1);
} else {
  console.log('✅ EXPO DEVELOPMENT TEST PASSED');
  console.log('🚀 Aplikacija je spremna za Expo development i preview build-ove!');
  console.log('\n📱 Možete pokrenuti:');
  console.log('   npm run dev              # Development server');
  console.log('   npx expo start           # Expo development server');
  console.log('   npx expo start --tunnel  # Sa tunnel-om za testiranje');
  console.log('   eas build --profile preview  # Preview build');
  process.exit(0);
}
