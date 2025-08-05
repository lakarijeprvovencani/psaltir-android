#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Running pre-build validation checks...\n');

let hasErrors = false;

// Check 1: Environment variables
console.log('1. Checking environment variables...');
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasSupabaseUrl = envContent.includes('EXPO_PUBLIC_SUPABASE_URL');
  const hasSupabaseKey = envContent.includes('EXPO_PUBLIC_SUPABASE_ANON_KEY');
  
  if (hasSupabaseUrl && hasSupabaseKey) {
    console.log('   ✅ Environment variables found');
  } else {
    console.log('   ❌ Missing Supabase environment variables');
    hasErrors = true;
  }
} else {
  console.log('   ❌ .env file not found');
  hasErrors = true;
}

// Check 2: Required assets
console.log('\n2. Checking required assets...');
const requiredAssets = [
  'assets/images/svecabm.mp4',
  'assets/images/ikonica.png',
  'assets/images/splashikonica.png'
];

requiredAssets.forEach(asset => {
  const assetPath = path.join(__dirname, '..', asset);
  if (fs.existsSync(assetPath)) {
    console.log(`   ✅ ${asset} found`);
  } else {
    console.log(`   ❌ ${asset} missing`);
    hasErrors = true;
  }
});

// Check 3: Required configuration files
console.log('\n3. Checking configuration files...');
const requiredConfigs = [
  'babel.config.js',
  'metro.config.js',
  'eas.json',
  'app.json'
];

requiredConfigs.forEach(config => {
  const configPath = path.join(__dirname, '..', config);
  if (fs.existsSync(configPath)) {
    console.log(`   ✅ ${config} found`);
  } else {
    console.log(`   ❌ ${config} missing`);
    hasErrors = true;
  }
});

// Check 4: Package.json scripts
console.log('\n4. Checking package.json scripts...');
const packagePath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const requiredScripts = ['build:ios', 'build:android', 'type-check'];
  
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`   ✅ Script "${script}" found`);
    } else {
      console.log(`   ❌ Script "${script}" missing`);
      hasErrors = true;
    }
  });
} else {
  console.log('   ❌ package.json not found');
  hasErrors = true;
}

// Check 5: TypeScript compilation
console.log('\n5. Running TypeScript check...');
const { execSync } = require('child_process');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('   ✅ TypeScript compilation successful');
} catch (error) {
  console.log('   ❌ TypeScript compilation failed');
  console.log('   Error:', error.stdout?.toString() || error.message);
  hasErrors = true;
}

// Final result
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Pre-build validation FAILED');
  console.log('Please fix the above issues before building for production.');
  process.exit(1);
} else {
  console.log('✅ Pre-build validation PASSED');
  console.log('Ready for production build!');
  process.exit(0);
}
