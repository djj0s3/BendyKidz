// Script to upload a hero image to Contentful
const { createClient } = require('contentful-management');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

// Initialize the client
const client = createClient({
  accessToken: managementToken
});

async function uploadHeroImage() {
  try {
    console.log('Starting Contentful hero image upload...');
    
    if (!spaceId || !managementToken) {
      throw new Error('Missing required environment variables. Make sure CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN are set.');
    }
    
    // Get space and environment
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment('master');
    
    // Path to the local image
    const localImagePath = path.join(process.cwd(), 'client/public/images/hero-image.png');
    console.log(`Looking for image at: ${localImagePath}`);
    
    // Check if the file exists
    if (!fs.existsSync(localImagePath)) {
      throw new Error(`Image file not found at: ${localImagePath}`);
    }
    
    // Read the file
    const fileData = fs.readFileSync(localImagePath);
    console.log(`Successfully read image file (${fileData.length} bytes)`);
    
    // Create or update the asset
    let asset;
    try {
      // Check if asset already exists
      asset = await environment.getAsset('hero-image');
      console.log('Hero image asset already exists, updating it...');
      
      // Update the asset
      asset.fields = {
        title: { 'en-US': 'Hero Section Image' },
        description: { 'en-US': 'Main image shown in the hero section' },
        file: {
          'en-US': {
            contentType: 'image/png',
            fileName: 'hero-image.png',
            uploadFrom: fileData
          }
        }
      };
      
      asset = await asset.update();
      console.log('Asset updated');
    } catch (error) {
      if (error.name === 'NotFound') {
        // Create new asset
        console.log('Creating new hero image asset...');
        asset = await environment.createAssetFromFiles({
          fields: {
            title: { 'en-US': 'Hero Section Image' },
            description: { 'en-US': 'Main image shown in the hero section' },
            file: {
              'en-US': {
                contentType: 'image/png',
                fileName: 'hero-image.png',
                file: fileData
              }
            }
          }
        });
        console.log('Asset created');
      } else {
        throw error;
      }
    }
    
    // Process and publish the asset
    try {
      await asset.processForAllLocales();
      console.log('Asset processed');
      
      // Wait for asset to be processed
      console.log('Waiting for processing to complete (5 seconds)...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      await asset.publish();
      console.log('Asset published successfully');
    } catch (error) {
      console.error('Error processing/publishing asset:', error.message);
      throw error;
    }
    
    console.log('Hero image upload completed successfully!');
  } catch (error) {
    console.error('Error in upload process:', error.message);
    if (error.details) {
      console.error('Error details:', JSON.stringify(error.details, null, 2));
    }
  }
}

// Run the upload
uploadHeroImage();