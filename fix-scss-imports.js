const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all SCSS files in the project
const sassFiles = glob.sync('./src/**/*.{scss,sass}');
console.log(`Found ${sassFiles.length} SASS files to process.`);

// Process a single file
function processFile(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already uses @use for settings
    if (content.includes('@use \'styles/settings/__settings\'') || 
        content.includes('@use "styles/settings/__settings"')) {
      console.log(`  - Already using @use for settings, skipping.`);
      return 0;
    }
    
    // Check if it uses @import for settings
    const needsSettingsImport = content.includes('@import \'styles/settings/__settings\'') || 
                              content.includes('@import "styles/settings/__settings"');
    
    // Check if it uses colors but doesn't import them
    const usesColors = (
      content.includes('$color-primary') || 
      content.includes('$color-gray') || 
      content.includes('$color-blue') || 
      content.includes('$color-gold')
    );
    
    const hasColorImport = content.includes('@use \'styles/settings/_colors\'') || 
                         content.includes('@use "styles/settings/_colors"');
    
    const needsColorImport = usesColors && !hasColorImport;
    
    // We don't need to modify if nothing to change
    if (!needsSettingsImport && !needsColorImport) {
      console.log(`  - No changes needed.`);
      return 0;
    }
    
    // Make a copy of the content
    let updatedContent = content;
    
    // Replace settings import
    if (needsSettingsImport) {
      updatedContent = updatedContent.replace(
        /@import ['"]styles\/settings\/__settings['"];?/g,
        '@use \'styles/settings/__settings\' as *;'
      );
      console.log(`  - Replaced settings @import with @use.`);
    }
    
    // Add color import if needed
    if (needsColorImport) {
      // Check if we need to add sass:color module
      const needsSassColor = content.includes('color.adjust') || 
                            content.includes('darken(') || 
                            content.includes('lighten(');
      
      let importsToAdd = '';
      
      if (needsSassColor && !content.includes('@use \'sass:color\'')) {
        importsToAdd += '@use \'sass:color\';\n';
        console.log(`  - Added sass:color module.`);
      }
      
      importsToAdd += '@use \'styles/settings/_colors\' as *;\n';
      console.log(`  - Added colors module.`);
      
      // Insert after any existing @use statements, or at the beginning
      const useStatementRegex = /@use [^;]+;(?:\r\n|\r|\n)/g;
      const lastUseMatch = [...updatedContent.matchAll(useStatementRegex)].pop();
      
      if (lastUseMatch) {
        const position = lastUseMatch.index + lastUseMatch[0].length;
        updatedContent = 
          updatedContent.substring(0, position) + 
          importsToAdd + 
          updatedContent.substring(position);
      } else {
        updatedContent = importsToAdd + updatedContent;
      }
    }
    
    // Write back if changed
    if (updatedContent !== content) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`  ✓ Updated ${filePath}`);
      return 1;
    }
    
    return 0;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return 0;
  }
}

// Main function
function main() {
  console.log('Updating SCSS imports to modern @use syntax...');
  let totalUpdated = 0;
  
  sassFiles.forEach(file => {
    totalUpdated += processFile(file);
  });
  
  console.log(`\nDone! Updated ${totalUpdated} of ${sassFiles.length} files.`);
  console.log('\nSome files might still need manual intervention if they use complex constructs.');
}

main(); 