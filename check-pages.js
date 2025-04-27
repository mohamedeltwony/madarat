// check-pages.js - Script to identify pages needing getStaticProps updates
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Patterns to look for in files
const patterns = {
  getStaticProps: /export\s+async\s+function\s+getStaticProps/,
  getServerSideProps: /export\s+async\s+function\s+getServerSideProps/,
  getSiteMetadata: /getSiteMetadata/,
  getAllMenus: /getAllMenus/,
  layoutWithMetadata: /<Layout[^>]*metadata=/,
  layoutWithoutProps: /<Layout[^>]*>/,
};

// Pages that are exceptions (don't need metadata/menus)
const exceptions = [
  '_app.js',
  '_document.js',
  'api/',
  '500.js',
  'sitemap.xml.js',
];

// Scan the pages directory
function scanPages() {
  const pagesDir = path.join(process.cwd(), 'src/pages');
  const pageFiles = glob.sync('**/*.js', { cwd: pagesDir });

  const results = {
    ok: [],
    needUpdate: [],
    exceptions: [],
  };

  pageFiles.forEach((file) => {
    // Skip exception files
    if (exceptions.some((ex) => file.startsWith(ex))) {
      results.exceptions.push(file);
      return;
    }

    const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');

    // Check if the file has getStaticProps or getServerSideProps
    const hasStaticProps = patterns.getStaticProps.test(content);
    const hasServerProps = patterns.getServerSideProps.test(content);

    // Check if it imports and uses metadata/menus
    const hasSiteMetadata = patterns.getSiteMetadata.test(content);
    const hasAllMenus = patterns.getAllMenus.test(content);
    const hasLayoutWithMetadata = patterns.layoutWithMetadata.test(content);
    const hasLayoutWithoutProps = patterns.layoutWithoutProps.test(content);

    // Determine if the page needs updating
    const hasDataFetching = hasStaticProps || hasServerProps;
    const hasMetadataImports = hasSiteMetadata && hasAllMenus;
    const usesMetadataInLayout = hasLayoutWithMetadata;

    if (hasDataFetching && hasMetadataImports && usesMetadataInLayout) {
      // Page seems to be properly updated
      results.ok.push(file);
    } else if (hasLayoutWithoutProps && !hasMetadataImports) {
      // Page uses Layout but without metadata/menus
      results.needUpdate.push({
        file,
        issues: {
          missingMetadataImport: !hasSiteMetadata,
          missingMenusImport: !hasAllMenus,
          layoutWithoutMetadata:
            hasLayoutWithoutProps && !hasLayoutWithMetadata,
          missingDataFetching: !hasDataFetching,
        },
      });
    } else if (hasDataFetching && !hasMetadataImports) {
      // Page has data fetching but doesn't get metadata/menus
      results.needUpdate.push({
        file,
        issues: {
          missingMetadataImport: !hasSiteMetadata,
          missingMenusImport: !hasAllMenus,
          layoutWithoutMetadata:
            hasLayoutWithoutProps && !hasLayoutWithMetadata,
        },
      });
    }
  });

  return results;
}

// Main execution
const results = scanPages();

console.log('\n======= PAGES SCAN RESULTS =======\n');

console.log(`💚 ${results.ok.length} pages appear to be correctly updated:`);
results.ok.forEach((file) => console.log(`  - ${file}`));

console.log(`\n🚫 ${results.exceptions.length} pages excluded from checks:`);
results.exceptions.forEach((file) => console.log(`  - ${file}`));

console.log(`\n⚠️ ${results.needUpdate.length} pages need updates:`);
results.needUpdate.forEach(({ file, issues }) => {
  console.log(`  - ${file}`);
  if (issues.missingDataFetching)
    console.log('    • Missing getStaticProps or getServerSideProps');
  if (issues.missingMetadataImport)
    console.log('    • Missing getSiteMetadata import/usage');
  if (issues.missingMenusImport)
    console.log('    • Missing getAllMenus import/usage');
  if (issues.layoutWithoutMetadata)
    console.log('    • Layout component without metadata/menus props');
});

console.log('\n==================================\n');
