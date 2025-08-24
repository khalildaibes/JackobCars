#!/usr/bin/env node

/**
 * Script to extract manufacturers_hebrew data from TypeScript file
 * and create a JavaScript file that can be imported
 */

const fs = require('fs');
const path = require('path');

function extractManufacturersData() {
  try {
    // Path to the TypeScript file
    const tsFilePath = path.join(__dirname, '..', 'data', 'manufacturers_multilingual.ts');
    
    if (!fs.existsSync(tsFilePath)) {
      console.error('❌ TypeScript file not found:', tsFilePath);
      return;
    }

    console.log('📖 Reading TypeScript file...');
    const content = fs.readFileSync(tsFilePath, 'utf8');

    // Find the manufacturers_hebrew export
    const hebrewMatch = content.match(/export const manufacturers_hebrew = (\{[\s\S]*?\});/);
    
    if (!hebrewMatch) {
      console.error('❌ manufacturers_hebrew export not found in the file');
      return;
    }

    const hebrewData = hebrewMatch[1];
    
    // Create the JavaScript data file
    const jsContent = `// Auto-extracted manufacturers_hebrew data
// Generated from data/manufacturers_multilingual.ts

const manufacturers_hebrew = ${hebrewData};

module.exports = { manufacturers_hebrew };
`;

    const outputPath = path.join(__dirname, 'manufacturers-data.js');
    fs.writeFileSync(outputPath, jsContent, 'utf8');
    
    console.log('✅ Successfully extracted manufacturers_hebrew data');
    console.log(`💾 Saved to: ${outputPath}`);
    
    // Count the items
    try {
      const data = eval(`(${hebrewData})`);
      const itemCount = Object.keys(data).length;
      console.log(`📊 Extracted ${itemCount} manufacturer entries`);
    } catch (e) {
      console.log('⚠️  Could not count items (data may be complex)');
    }

  } catch (error) {
    console.error('❌ Error extracting data:', error.message);
  }
}

// Run the extraction
if (require.main === module) {
  extractManufacturersData();
}

module.exports = { extractManufacturersData };





