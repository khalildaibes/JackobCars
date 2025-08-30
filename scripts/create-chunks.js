#!/usr/bin/env node

/**
 * Script to split manufacturers data into individual chunk files
 * Each chunk can be manually translated in ChatGPT
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CHUNK_SIZE = 10; // Number of items per chunk (smaller for easier ChatGPT handling)

// Import the manufacturers data
const { manufacturers_hebrew } = require('./manufacturers-data');

// Split object into chunks
function splitIntoChunks(obj, chunkSize) {
  const entries = Object.entries(obj);
  const chunks = [];
  
  for (let i = 0; i < entries.length; i += chunkSize) {
    chunks.push(entries.slice(i, i + chunkSize));
  }
  
  return chunks;
}

// Create chunk files
function createChunkFiles(chunks) {
  const chunksDir = path.join(__dirname, 'chunks');
  
  // Create chunks directory if it doesn't exist
  if (!fs.existsSync(chunksDir)) {
    fs.mkdirSync(chunksDir, { recursive: true });
  }

  console.log(`📁 Creating ${chunks.length} chunk files in: ${chunksDir}`);
  console.log('');

  // Create individual chunk files
  chunks.forEach((chunk, index) => {
    const chunkNumber = index + 1;
    const chunkData = Object.fromEntries(chunk);
    
    // Create JSON file for the chunk
    const jsonFilename = `chunk_${chunkNumber.toString().padStart(2, '0')}.json`;
    const jsonPath = path.join(chunksDir, jsonFilename);
    fs.writeFileSync(jsonPath, JSON.stringify(chunkData, null, 2), 'utf8');
    
    // Create text file with just the values for easy ChatGPT input
    const textFilename = `chunk_${chunkNumber.toString().padStart(2, '0')}_values.txt`;
    const textPath = path.join(chunksDir, textFilename);
    const values = chunk.map(([key, value]) => value);
    fs.writeFileSync(textPath, values.join('\n'), 'utf8');
    
    // Create instructions file for each chunk
    const instructionsFilename = `chunk_${chunkNumber.toString().padStart(2, '0')}_instructions.txt`;
    const instructionsPath = path.join(chunksDir, instructionsFilename);
    const instructions = `CHUNK ${chunkNumber} - ${chunk.length} items

TRANSLATE TO ARABIC:
${values.join('\n')}

TRANSLATE TO ENGLISH:
${values.join('\n')}

Instructions:
1. Copy the values above
2. Paste into ChatGPT with prompt: "Translate these Hebrew car manufacturer names to [Arabic/English]. Return only a JSON array with translations in the same order."
3. Save the translated results
4. Repeat for both languages

Original keys for this chunk:
${chunk.map(([key, value]) => `${key}: ${value}`).join('\n')}`;
    
    fs.writeFileSync(instructionsPath, instructions, 'utf8');
    
    console.log(`✅ Created chunk ${chunkNumber}: ${chunk.length} items`);
    console.log(`   📄 ${jsonFilename} - Full chunk data with keys`);
    console.log(`   📝 ${textFilename} - Values only (for ChatGPT input)`);
    console.log(`   📋 ${instructionsFilename} - Translation instructions`);
    console.log('');
  });

  // Create master index file
  const indexContent = `# Manufacturers Translation Chunks

Total items: ${Object.keys(manufacturers_hebrew).length}
Total chunks: ${chunks.length}
Items per chunk: ${CHUNK_SIZE}

## Chunk Files Created:

${chunks.map((chunk, index) => {
  const chunkNumber = index + 1;
  const itemCount = chunk.length;
  const sampleItems = chunk.slice(0, 3).map(([key, value]) => value).join(', ');
  return `${chunkNumber}. **chunk_${chunkNumber.toString().padStart(2, '0')}** (${itemCount} items)
   - Sample: ${sampleItems}${itemCount > 3 ? '...' : ''}
   - Files: chunk_${chunkNumber.toString().padStart(2, '0')}.json, chunk_${chunkNumber.toString().padStart(2, '0')}_values.txt, chunk_${chunkNumber.toString().padStart(2, '0')}_instructions.txt`;
}).join('\n\n')}

## Translation Process:

1. **Start with chunk 1** and work through them sequentially
2. **For each chunk:**
   - Open the \`_values.txt\` file
   - Copy the Hebrew values
   - Paste into ChatGPT with translation prompt
   - Save both Arabic and English results
   - Note the chunk number for later assembly

3. **After all chunks are translated:**
   - Use the \`assemble-translations.js\` script to combine results
   - This will create the final translated objects

## File Structure:
\`\`\`
chunks/
├── chunk_01.json          # Full chunk data
├── chunk_01_values.txt    # Values for ChatGPT
├── chunk_01_instructions.txt
├── chunk_02.json
├── chunk_02_values.txt
├── chunk_02_instructions.txt
└── ...
\`\`\`

## ChatGPT Prompts:

**For Arabic:**
"Translate these Hebrew car manufacturer names to Arabic. Return only a JSON array with translations in the same order. Do not include explanations."

**For English:**
"Translate these Hebrew car manufacturer names to English. Return only a JSON array with translations in the same order. Do not include explanations."

## Example Input:
\`\`\`
טויוטה
הונדה
ב.מ.וו
\`\`\`

## Expected Output:
\`\`\`
["تويوتا", "هوندا", "بي إم دبليو"]
\`\`\`

Good luck with the translations! 🚀`;
  
  const indexPath = path.join(chunksDir, 'README.md');
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  
  console.log(`📚 Created README.md with complete instructions`);
  console.log('');
}

// Create assembly script
function createAssemblyScript(chunks) {
  const assemblyScript = `#!/usr/bin/env node

/**
 * Script to assemble translated chunks back into complete objects
 * Run this after you've translated all chunks manually
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CHUNK_SIZE = ${CHUNK_SIZE};
const TOTAL_CHUNKS = ${chunks.length};

// Import the original manufacturers data for validation
const { manufacturers_hebrew } = require('./manufacturers-data');

// Function to load translated chunk
function loadTranslatedChunk(chunkNumber, language) {
  const chunkPath = path.join(__dirname, 'chunks', \`chunk_\${chunkNumber.toString().padStart(2, '0')}_\${language}.json\`);
  
  if (!fs.existsSync(chunkPath)) {
    console.error(\`❌ Missing translated chunk: \${chunkPath}\`);
    return null;
  }
  
  try {
    return JSON.parse(fs.readFileSync(chunkPath, 'utf8'));
  } catch (error) {
    console.error(\`❌ Error reading chunk \${chunkNumber} (\${language}): \${error.message}\`);
    return null;
  }
}

// Function to assemble translations
function assembleTranslations() {
  console.log('🔧 Assembling translated chunks...');
  console.log(\`📊 Total chunks: \${TOTAL_CHUNKS}\`);
  console.log('');
  
  const assembled = { ar: {}, en: {} };
  let successCount = 0;
  
  for (let i = 1; i <= TOTAL_CHUNKS; i++) {
    console.log(\`🔄 Processing chunk \${i}/\${TOTAL_CHUNKS}...\`);
    
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
    console.log(\`✅ Chunk \${i} assembled successfully\`);
  }
  
  if (successCount === TOTAL_CHUNKS) {
    console.log(\`🎉 All \${TOTAL_CHUNKS} chunks assembled successfully!\`);
    
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
    const jsContent = \`// Auto-assembled translated manufacturers
module.exports = \${JSON.stringify(assembled, null, 2)};\`;
    fs.writeFileSync(path.join(outputDir, 'manufacturers_translated.js'), jsContent);
    
    console.log('💾 Results saved to output/ directory');
    
    // Validate results
    const originalCount = Object.keys(manufacturers_hebrew).length;
    const arabicCount = Object.keys(assembled.ar).length;
    const englishCount = Object.keys(assembled.en).length;
    
    console.log('');
    console.log('🔍 Validation Results:');
    console.log(\`   Original: \${originalCount} items\`);
    console.log(\`   Arabic: \${arabicCount} items\`);
    console.log(\`   English: \${englishCount} items\`);
    
    if (originalCount === arabicCount && originalCount === englishCount) {
      console.log('✅ All counts match - assembly successful!');
    } else {
      console.log('⚠️  Count mismatch detected');
    }
    
  } else {
    console.error(\`❌ Only \${successCount}/\${TOTAL_CHUNKS} chunks were assembled successfully\`);
    console.log('Please ensure all chunks are translated before running this script');
  }
}

// Run assembly
if (require.main === module) {
  assembleTranslations();
}

module.exports = { assembleTranslations };
`;
  
  const assemblyPath = path.join(__dirname, 'assemble-translations.js');
  fs.writeFileSync(assemblyPath, assemblyScript, 'utf8');
  
  console.log(`🔧 Created assemble-translations.js script`);
  console.log('');
}

// Main execution
function main() {
  if (!manufacturers_hebrew || Object.keys(manufacturers_hebrew).length === 0) {
    console.error('❌ No manufacturers data found. Please check manufacturers-data.js');
    return;
  }

  console.log('🚀 Creating manufacturers chunks for manual translation...');
  console.log(`📊 Total items: ${Object.keys(manufacturers_hebrew).length}`);
  console.log(`📦 Chunk size: ${CHUNK_SIZE}`);
  console.log('');

  // Split into chunks
  const chunks = splitIntoChunks(manufacturers_hebrew, CHUNK_SIZE);
  console.log(`📦 Split into ${chunks.length} chunks`);
  console.log('');

  // Create chunk files
  createChunkFiles(chunks);
  
  // Create assembly script
  createAssemblyScript(chunks);

  console.log('🎉 Chunk creation completed!');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Go to the chunks/ directory');
  console.log('2. Start with chunk_01_values.txt');
  console.log('3. Translate each chunk in ChatGPT');
  console.log('4. Save results as chunk_01_ar.json and chunk_01_en.json');
  console.log('5. Repeat for all chunks');
  console.log('6. Run: node assemble-translations.js');
  console.log('');
  console.log('📁 Check the chunks/ directory for all files and instructions');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createChunkFiles, splitIntoChunks };







