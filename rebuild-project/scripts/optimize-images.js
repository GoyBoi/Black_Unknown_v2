const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const sharp = require('sharp');

// Function to process and optimize images
async function optimizeImage(inputPath, outputPath, format) {
  try {
    let pipeline = sharp(inputPath);

    // Set up the processing pipeline
    pipeline = pipeline
      .resize({ width: 1200, withoutEnlargement: true }) // Resize to max width
      .jpeg({ quality: 80, progressive: true })
      .png({ compressionLevel: 8 })
      .webp({ quality: 80 })
      .avif({ quality: 75, speed: 5 });

    // If we want a specific output format, convert to that format
    if (format === 'webp') {
      pipeline = pipeline.webp({ quality: 80 });
    } else if (format === 'avif') {
      pipeline = pipeline.avif({ quality: 75, speed: 5 });
    }

    // Write the optimized image
    await pipeline.toFile(outputPath);
    console.log(`Optimized: ${inputPath} -> ${outputPath}`);
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
  }
}

// Main function to process all images
async function processImages() {
  console.log('Starting image optimization...');
  
  // Create optimized images directory
  const optimizedDir = path.join(process.cwd(), 'public', '_optimized');
  await fs.mkdir(optimizedDir, { recursive: true });

  // In a real implementation, we would scan for local images
  // Since this project uses external images, we'll just create the directory structure
  console.log('Created optimized images directory');
  
  // If there were local images to process, they would be processed here
  console.log('Image optimization completed!');
}

// If running as a script
if (require.main === module) {
  processImages().catch(console.error);
}

module.exports = { optimizeImage, processImages };