/**
 * Locale split script
 * Reads existing scripts/locales/<lang>.js, extracts labels into <lang>-page.js,
 * and rewrites the original to only contain the content field.
 */
const fs = require('fs');
const path = require('path');

const LANGS = ['en', 'hu', 'de', 'fr', 'es', 'it', 'asg', 'dot', 'kl', 'qu', 'goa', 'ya'];
const LOCALES_DIR = path.join(__dirname, '..', 'scripts', 'locales');

for (const lang of LANGS) {
  const filePath = path.join(LOCALES_DIR, `${lang}.js`);
  const content = fs.readFileSync(filePath, 'utf8');

  // Parse the export - extract labels object and content object
  const labelsMatch = content.match(/labels:\s*\{([\s\S]*?)\},\s*\n\s*content/);
  const contentMatch = content.match(/content:\s*([\s\S]*?)\n\};/);

  if (!labelsMatch) {
    console.log(`⚠️  ${lang}.js: no labels found, skipping`);
    // File might be already split (ya.js has no content, only labels)
    // Skip if it doesn't have both
    if (content.includes('content')) {
      console.log(`   But it has content - need to handle manually`);
    }
    continue;
  }

  const labelsBody = labelsMatch[1];
  const contentBody = contentMatch ? contentMatch[1].trim() : 'null';

  // Build labels object string (reconstruct with proper formatting)
  const labelsStr = `  labels: {\n${labelsBody}  },`;

  // Write page file
  const varName = `${lang.toUpperCase()}_PAGE`;
  const pageContent = `export const ${varName} = {\n${labelsStr}\n};\n`;
  const pagePath = path.join(LOCALES_DIR, `${lang}-page.js`);
  fs.writeFileSync(pagePath, pageContent, 'utf8');
  console.log(`✅ Created ${lang}-page.js`);

  // Rewrite original file - only keep content
  const origVarName = lang.toUpperCase();
  if (contentBody === 'null') {
    // No content - write minimal file
    const newContent = `export const ${origVarName} = {\n  content: null,\n};\n`;
    fs.writeFileSync(filePath, newContent, 'utf8');
  } else {
    // Has content - write content-only file
    const newContent = `export const ${origVarName} = {\n  content: ${contentBody}\n};\n`;
    fs.writeFileSync(filePath, newContent, 'utf8');
  }
  console.log(`✅ Trimmed ${lang}.js`);
}

console.log('\nDone!');
