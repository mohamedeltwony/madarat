const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all SASS files in the project
const sassFiles = glob.sync('./src/**/*.{scss,sass}');
console.log(`Found ${sassFiles.length} SASS files to process.`);

// Convert @import to @use
function updateImports(content, filePath) {
  // Skip if file already has @use statements
  if (content.includes('@use')) {
    console.log(`Skipping ${filePath} - already has @use statements.`);
    return content;
  }

  // Replace @import statements with @use statements
  let updatedContent = content;
  const importRegex = /@import ['"]([^'"]+)['"]/g;
  const imports = [...content.matchAll(importRegex)];
  
  if (imports.length === 0) {
    return content; // No imports found
  }
  
  // Add color module import if using color functions
  if (updatedContent.includes('darken(') || updatedContent.includes('lighten(')) {
    updatedContent = '@use \'sass:color\';\n' + updatedContent;
  }
  
  // Replace each @import with @use
  imports.forEach(match => {
    const fullMatch = match[0];
    const importPath = match[1];
    
    // Create @use statement
    const useStatement = `@use '${importPath}' as *`;
    
    // Replace only the first occurrence to avoid duplicates
    updatedContent = updatedContent.replace(fullMatch, useStatement);
  });
  
  return updatedContent;
}

// Update deprecated color functions to new syntax
function updateColorFunctions(content) {
  // Add sass:color import if using color functions and doesn't already have it
  let updatedContent = content;
  
  if ((content.includes('darken(') || content.includes('lighten(')) && !content.includes('@use \'sass:color\'')) {
    updatedContent = '@use \'sass:color\';\n' + content;
  }
  
  // Replace darken() function
  const darkenRegex = /darken\(\s*([^,]+),\s*([^)]+)\)/g;
  updatedContent = updatedContent.replace(darkenRegex, 'color.adjust($1, $brightness: -$2)');
  
  // Replace lighten() function
  const lightenRegex = /lighten\(\s*([^,]+),\s*([^)]+)\)/g;
  updatedContent = updatedContent.replace(lightenRegex, 'color.adjust($1, $brightness: $2)');
  
  return updatedContent;
}

// Process all files
let updatedFiles = 0;

sassFiles.forEach(filePath => {
  try {
    console.log(`Processing ${filePath}...`);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Apply all transformations
    let updatedContent = content;
    updatedContent = updateImports(updatedContent, filePath);
    updatedContent = updateColorFunctions(updatedContent);
    
    // Only write if changes were made
    if (updatedContent !== content) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Updated ${filePath}`);
      updatedFiles++;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
});

console.log(`Completed: Updated ${updatedFiles} of ${sassFiles.length} files.`); 