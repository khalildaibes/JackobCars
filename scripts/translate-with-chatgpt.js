#!/usr/bin/env node

/**
 * Script to translate manufacturers using ChatGPT API
 * Splits data into chunks and translates to Arabic and English
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CHUNK_SIZE = 20; // Reduced chunk size to avoid rate limits
const LANGUAGES = ['ar', 'en'];
const API_KEY = process.env.OPENAI_API_KEY; // Set your OpenAI API key as environment variable
const MIN_DELAY = 3000; // Minimum delay between requests (3 seconds)
const MAX_RETRIES = 3; // Maximum retry attempts for failed requests

// Import the manufacturers data
const { manufacturers_hebrew } = require('./manufacturers-data');

// ChatGPT API function with retry logic
async function translateWithChatGPT(text, targetLanguage, retryCount = 0) {
  if (!API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable not set');
  }

  const prompt = `Translate the following Hebrew car manufacturer names to ${targetLanguage === 'ar' ? 'Arabic' : 'English'}. 
Return only a valid JSON array with the translations in the same order. Do not include any explanations or extra text.

Hebrew names:
${JSON.stringify(text, null, 2)}

Rules:
- Keep the same order
- Return only the JSON array
- For Arabic, use proper Arabic script
- For English, use standard English names`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Using cheaper model to reduce rate limit issues
        messages: [
          {
            role: 'system',
            content: 'You are a professional translator. Return only valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (response.status === 429 && retryCount < MAX_RETRIES) {
      // Rate limited - wait longer and retry
      const waitTime = Math.pow(2, retryCount + 1) * 1000; // Exponential backoff: 2s, 4s, 8s
      console.log(`⏳ Rate limited. Waiting ${waitTime/1000}s before retry ${retryCount + 1}/${MAX_RETRIES}...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return translateWithChatGPT(text, targetLanguage, retryCount + 1);
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const translatedText = data.choices[0].message.content.trim();
    
    // Extract JSON from response (in case there's extra text)
    const jsonMatch = translatedText.match(/\[.*\]/s);
    if (!jsonMatch) {
      throw new Error('No valid JSON array found in response');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`⚠️  Request failed, retrying... (${retryCount + 1}/${MAX_RETRIES})`);
      const waitTime = Math.pow(2, retryCount + 1) * 1000;
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return translateWithChatGPT(text, targetLanguage, retryCount + 1);
    }
    
    console.error(`Translation error after ${MAX_RETRIES} retries: ${error.message}`);
    throw error;
  }
}

// Split object into chunks
function splitIntoChunks(obj, chunkSize) {
  const entries = Object.entries(obj);
  const chunks = [];
  
  for (let i = 0; i < entries.length; i += chunkSize) {
    chunks.push(entries.slice(i, i + chunkSize));
  }
  
  return chunks;
}

// Process chunks sequentially
async function processChunks(chunks, targetLanguage) {
  const results = [];
  let processedCount = 0;
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const chunkValues = chunk.map(([key, value]) => value);
    
    console.log(`🔄 Processing chunk ${i + 1}/${chunks.length} (${chunkValues.length} items) for ${targetLanguage}...`);
    
    try {
      const translatedValues = await translateWithChatGPT(chunkValues, targetLanguage);
      
      // Create chunk result with keys and translated values
      const chunkResult = chunk.map(([key, originalValue], index) => [
        key, 
        translatedValues[index] || originalValue // Fallback to original if translation fails
      ]);
      
      results.push(...chunkResult);
      processedCount += chunk.length;
      
      console.log(`✅ Chunk ${i + 1} completed. Total processed: ${processedCount}/${chunks.length * chunk.length}`);
      
      // Add delay to respect API rate limits
      if (i < chunks.length - 1) {
        console.log(`⏳ Waiting ${MIN_DELAY/1000} seconds before next chunk...`);
        await new Promise(resolve => setTimeout(resolve, MIN_DELAY));
      }
      
    } catch (error) {
      console.error(`❌ Failed to process chunk ${i + 1}: ${error.message}`);
      // Add original values as fallback
      results.push(...chunk);
    }
  }
  
  return results;
}

// Main translation function
async function translateManufacturers() {
  if (!manufacturers_hebrew || Object.keys(manufacturers_hebrew).length === 0) {
    console.error('❌ No manufacturers data found. Please check manufacturers-data.js');
    return;
  }

  console.log('🚀 Starting manufacturers translation...');
  console.log(`📊 Total items to translate: ${Object.keys(manufacturers_hebrew).length}`);
  console.log(`🌍 Target languages: ${LANGUAGES.join(', ')}`);
  console.log(`📦 Chunk size: ${CHUNK_SIZE}`);
  console.log('');

  // Split into chunks
  const chunks = splitIntoChunks(manufacturers_hebrew, CHUNK_SIZE);
  console.log(`📦 Split into ${chunks.length} chunks`);
  console.log('');

  const translatedObjects = {};

  // Process each language
  for (const language of LANGUAGES) {
    console.log(`🌍 Processing language: ${language}`);
    console.log('=====================================');
    
    try {
      const translatedEntries = await processChunks(chunks, language);
      translatedObjects[language] = Object.fromEntries(translatedEntries);
      
      console.log(`✅ ${language.toUpperCase()} translation completed!`);
      console.log(`📊 Translated ${Object.keys(translatedObjects[language]).length} items`);
      console.log('');
      
    } catch (error) {
      console.error(`❌ Failed to translate to ${language}: ${error.message}`);
      // Create fallback object with original values
      translatedObjects[language] = manufacturers_hebrew;
    }
  }

  // Save results
  saveResults(translatedObjects);
  
  return translatedObjects;
}

// Save results to files
function saveResults(translatedObjects) {
  const outputDir = path.join(__dirname, 'output');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Save individual language files
  for (const [language, data] of Object.entries(translatedObjects)) {
    const filename = `manufacturers_${language}.json`;
    const filepath = path.join(outputDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`💾 Saved ${filename}`);
  }

  // Save combined results
  const combinedFilepath = path.join(outputDir, 'manufacturers_all_languages.json');
  fs.writeFileSync(combinedFilepath, JSON.stringify(translatedObjects, null, 2), 'utf8');
  console.log(`💾 Saved manufacturers_all_languages.json`);

  // Save as JavaScript module for easy import
  const jsModuleFilepath = path.join(outputDir, 'manufacturers_translated.js');
  const jsContent = `// Auto-generated translated manufacturers
module.exports = ${JSON.stringify(translatedObjects, null, 2)};`;
  fs.writeFileSync(jsModuleFilepath, jsContent, 'utf8');
  console.log(`💾 Saved manufacturers_translated.js`);

  console.log('');
  console.log('🎉 Translation completed! Check the output/ directory for results.');
}

// Validation function
function validateTranslations(translatedObjects) {
  console.log('🔍 Validating translations...');
  
  const hebrewKeys = Object.keys(manufacturers_hebrew);
  
  for (const [language, data] of Object.entries(translatedObjects)) {
    const languageKeys = Object.keys(data);
    
    if (hebrewKeys.length !== languageKeys.length) {
      console.log(`⚠️  ${language}: Key count mismatch (Hebrew: ${hebrewKeys.length}, ${language}: ${languageKeys.length})`);
    } else {
      console.log(`✅ ${language}: All keys present`);
    }
    
    // Check for empty translations
    const emptyTranslations = Object.entries(data).filter(([key, value]) => !value || value.trim() === '');
    if (emptyTranslations.length > 0) {
      console.log(`⚠️  ${language}: ${emptyTranslations.length} empty translations found`);
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'translate':
      try {
        const results = await translateManufacturers();
        validateTranslations(results);
      } catch (error) {
        console.error('❌ Translation failed:', error.message);
        process.exit(1);
      }
      break;
      
    case 'validate':
      // Load and validate existing results
      try {
        const outputPath = path.join(__dirname, 'output', 'manufacturers_all_languages.json');
        if (fs.existsSync(outputPath)) {
          const data = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
          validateTranslations(data);
        } else {
          console.log('❌ No translation results found. Run "translate" first.');
        }
      } catch (error) {
        console.error('❌ Validation failed:', error.message);
      }
      break;
      
    default:
      console.log('🚀 Manufacturers ChatGPT Translation Script');
      console.log('=====================================');
      console.log('Commands:');
      console.log('  npm run translate:chatgpt  - Translate using ChatGPT API');
      console.log('  npm run translate:validate - Validate existing translations');
      console.log('');
      console.log('Setup:');
      console.log('1. Set OPENAI_API_KEY environment variable');
      console.log('2. Ensure manufacturers-data.js contains your data');
      console.log('3. Run the translate command');
      break;
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { translateManufacturers, validateTranslations };
