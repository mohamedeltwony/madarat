const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Icon sizes needed for web app manifest
const iconSizes = [36, 48, 72, 96, 144, 192, 512];

// Source logo path
const sourceLogo = path.join(__dirname, '../public/images/مدارات-2.png');
const outputDir = path.join(__dirname, '../public/images/icons');

async function generateIcons() {
  try {
    // Create icons directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });
    
    console.log('🎨 Generating app icons...');
    
    // Generate each icon size
    for (const size of iconSizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(sourceLogo)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(outputPath);
        
      console.log(`✅ Generated ${size}x${size} icon`);
    }
    
    // Generate Apple Touch Icon (180x180)
    const appleTouchIconPath = path.join(outputDir, 'apple-touch-icon.png');
    await sharp(sourceLogo)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 } // White background for Apple
      })
      .png()
      .toFile(appleTouchIconPath);
    
    console.log('✅ Generated Apple Touch Icon (180x180)');
    
    // Generate favicon.ico (32x32)
    const faviconPath = path.join(__dirname, '../public/favicon.ico');
    await sharp(sourceLogo)
      .resize(32, 32)
      .png()
      .toFile(faviconPath.replace('.ico', '.png'));
    
    console.log('✅ Generated favicon (32x32)');
    
    console.log('🎉 All icons generated successfully!');
    console.log(`📁 Icons saved to: ${outputDir}`);
    
  } catch (error) {
    console.error('❌ Error generating icons:', error);
  }
}

// Run the script
generateIcons(); 