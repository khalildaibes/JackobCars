#!/usr/bin/env node

/**
 * Script to assemble translated chunks back into complete objects
 * Run this after you've translated all chunks manually
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CHUNK_SIZE = 10;
const TOTAL_CHUNKS = 11;

// Import the original manufacturers data for validation
const { manufacturers_hebrew } = require('./manufacturers-data');

// Function to load translated chunk
function loadTranslatedChunk(chunkNumber, language) {
  const chunkPath = path.join(__dirname, 'chunks', `chunk_${chunkNumber.toString().padStart(2, '0')}_${language}.json`);
  
  if (!fs.existsSync(chunkPath)) {
    console.error(`❌ Missing translated chunk: ${chunkPath}`);
    return null;
  }
  
  try {
    return JSON.parse(fs.readFileSync(chunkPath, 'utf8'));
  } catch (error) {
    console.error(`❌ Error reading chunk ${chunkNumber} (${language}): ${error.message}`);
    return null;
  }
}

// Function to assemble translations
function assembleTranslations() {
  console.log('🔧 Assembling translated chunks...');
  console.log(`📊 Total chunks: ${TOTAL_CHUNKS}`);
  console.log('');
  
  const assembled = { ar: {}, en: {} };
  let successCount = 0;
  
  for (let i = 1; i <= TOTAL_CHUNKS; i++) {
    console.log(`🔄 Processing chunk ${i}/${TOTAL_CHUNKS}...`);
    
    // Load Arabic translation
    const arabicChunk = loadTranslatedChunk(i, 'ar');
    if (!arabicChunk) continue;
    
    // Load English translation
    const englishChunk = loadTranslatedChunk(i, 'en');
    if (!englishChunk) continue;
    
    // Merge into assembled objects
    Object.assign(assembled.ar, arabicChunk);
    Object.assign(assembled.en, englishChunk);
    
    successCount++;
    console.log(`✅ Chunk ${i} assembled successfully`);
  }
  
  if (successCount === TOTAL_CHUNKS) {
    console.log(`🎉 All ${TOTAL_CHUNKS} chunks assembled successfully!`);
    
    // Save assembled results
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Save individual language files
    fs.writeFileSync(path.join(outputDir, 'manufacturers_ar.json'), JSON.stringify(assembled.ar, null, 2));
    fs.writeFileSync(path.join(outputDir, 'manufacturers_en.json'), JSON.stringify(assembled.en, null, 2));
    
    // Save combined results
    fs.writeFileSync(path.join(outputDir, 'manufacturers_all_languages.json'), JSON.stringify(assembled, null, 2));
    
    // Save as JavaScript module
    const jsContent = `// Auto-assembled translated manufacturers
module.exports = ${JSON.stringify(assembled, null, 2)};`;
    fs.writeFileSync(path.join(outputDir, 'manufacturers_translated.js'), jsContent);
    
    console.log('💾 Results saved to output/ directory');
    
    // Validate results
    const originalCount = Object.keys(manufacturers_hebrew).length;
    const arabicCount = Object.keys(assembled.ar).length;
    const englishCount = Object.keys(assembled.en).length;
    
    console.log('');
    console.log('🔍 Validation Results:');
    console.log(`   Original: ${originalCount} items`);
    console.log(`   Arabic: ${arabicCount} items`);
    console.log(`   English: ${englishCount} items`);
    
    if (originalCount === arabicCount && originalCount === englishCount) {
      console.log('✅ All counts match - assembly successful!');
    } else {
      console.log('⚠️  Count mismatch detected');
    }
    
  } else {
    console.error(`❌ Only ${successCount}/${TOTAL_CHUNKS} chunks were assembled successfully`);
    console.log('Please ensure all chunks are translated before running this script');
  }
}

// Run assembly
if (require.main === module) {
  assembleTranslations();
}

module.exports = { assembleTranslations };
