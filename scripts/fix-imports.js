#!/usr/bin/env node

/**
 * FIX IMPORTS SCRIPT
 * 
 * Ovaj script zamenjuje sve "@/" import-ove sa relativnim path-ovima
 * da bi rešio problem sa EAS build-om koji ne može da pronađe module-ove.
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing imports - zamenjujem "@/" sa relativnim path-ovima...\n');

// Funkcija za pronalaženje svih TypeScript/JavaScript fajlova
function findTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      findTsFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Funkcija za računanje relativnog path-a
function getRelativePath(fromFile, toPath) {
  const fromDir = path.dirname(fromFile);
  const projectRoot = path.join(__dirname, '..');
  
  // Uklanjamo "@/" i dodajemo project root
  const absoluteToPath = path.join(projectRoot, toPath.replace('@/', ''));
  
  // Računamo relativan path
  let relativePath = path.relative(fromDir, absoluteToPath);
  
  // Normalizujemo path separatore za Unix/Windows
  relativePath = relativePath.replace(/\\/g, '/');
  
  // Dodajemo "./" ako path ne počinje sa "../"
  if (!relativePath.startsWith('../') && !relativePath.startsWith('./')) {
    relativePath = './' + relativePath;
  }
  
  return relativePath;
}

// Funkcija za zamenu import-ova u fajlu
function fixImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let hasChanges = false;
  
  const newLines = lines.map(line => {
    // Regex za pronalaženje import-ova sa "@/"
    const importRegex = /import\s+.*?\s+from\s+['"](@\/[^'"]+)['"]/;
    const match = line.match(importRegex);
    
    if (match) {
      const oldImport = match[1];
      const newImport = getRelativePath(filePath, oldImport);
      const newLine = line.replace(oldImport, newImport);
      
      console.log(`   ${path.relative(path.join(__dirname, '..'), filePath)}:`);
      console.log(`     ${oldImport} → ${newImport}`);
      
      hasChanges = true;
      return newLine;
    }
    
    return line;
  });
  
  if (hasChanges) {
    fs.writeFileSync(filePath, newLines.join('\n'));
    return true;
  }
  
  return false;
}

// Glavna funkcija
function main() {
  const projectRoot = path.join(__dirname, '..');
  const tsFiles = findTsFiles(projectRoot);
  
  let totalChanges = 0;
  
  tsFiles.forEach(filePath => {
    if (fixImportsInFile(filePath)) {
      totalChanges++;
    }
  });
  
  console.log(`\n✅ Završeno! Ažurirano ${totalChanges} fajlova.`);
  
  if (totalChanges > 0) {
    console.log('\n🚀 Sada možete pokrenuti EAS build bez problema sa import-ovima!');
  } else {
    console.log('\n📝 Nema "@/" import-ova za zamenu.');
  }
}

main();
