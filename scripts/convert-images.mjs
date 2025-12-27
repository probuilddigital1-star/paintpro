import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

async function convertImages() {
  console.log('Converting images...\n');

  // Convert og-image.svg to og-image.png (1200x630 for social sharing)
  console.log('1. Converting og-image.svg to og-image.png...');
  const ogSvg = readFileSync(join(publicDir, 'og-image.svg'));
  await sharp(ogSvg)
    .resize(1200, 630)
    .png()
    .toFile(join(publicDir, 'og-image.png'));
  console.log('   ✓ Created og-image.png (1200x630)\n');

  // Convert favicon.svg to apple-touch-icon.png (180x180)
  console.log('2. Converting favicon.svg to apple-touch-icon.png...');
  const faviconSvg = readFileSync(join(publicDir, 'favicon.svg'));
  await sharp(faviconSvg)
    .resize(180, 180)
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'));
  console.log('   ✓ Created apple-touch-icon.png (180x180)\n');

  console.log('All images converted successfully!');
}

convertImages().catch(console.error);
