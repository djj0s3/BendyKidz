// Script to fix image assets in Contentful
require('dotenv').config();
const { createClient } = require('contentful-management');

// Get credentials from environment variables
const spaceId = process.env.CONTENTFUL_SPACE_ID;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

console.log('Starting Contentful image asset fix...');
console.log(`Space ID: ${spaceId}`);
console.log(`Management Token available: ${managementToken ? 'Yes' : 'No'}`);

// Create client
const client = createClient({
  accessToken: managementToken
});

async function run() {
  try {
    // Get environment
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment('master');
    console.log('Connected to Contentful space and environment');
    
    // Define the image assets with proper URLs
    const imageAssets = [
      {
        id: 'emma-avatar',
        title: 'Emma Wilson Avatar',
        description: 'Portrait of Emma Wilson, the lead occupational therapist',
        url: 'https://randomuser.me/api/portraits/women/65.jpg'
      },
      {
        id: 'article1-image',
        title: 'Pencil Grip Exercise Image',
        description: 'Image showing exercises for pencil grip',
        url: 'https://images.unsplash.com/photo-1524503033411-c9566986fc8f?w=800&auto=format&fit=crop'
      }
    ];
    
    // Process each image asset
    for (const imageAsset of imageAssets) {
      console.log(`Processing asset: ${imageAsset.id}`);
      
      // Create or update the asset
      try {
        // Try to get existing asset
        const existingAsset = await environment.getAsset(imageAsset.id);
        console.log(`Asset ${imageAsset.id} exists, updating it`);
        
        // Update asset data
        existingAsset.fields = {
          title: { 'en-US': imageAsset.title },
          description: { 'en-US': imageAsset.description },
          file: {
            'en-US': {
              contentType: 'image/jpeg',
              fileName: `${imageAsset.id}.jpg`,
              upload: imageAsset.url
            }
          }
        };
        
        // Save the updated asset
        const updatedAsset = await existingAsset.update();
        console.log(`Asset ${imageAsset.id} updated`);
        
        // Process the asset for all locales
        try {
          await updatedAsset.processForAllLocales();
          console.log(`Asset ${imageAsset.id} processed`);
        } catch (processError) {
          console.log(`Warning: Could not process asset ${imageAsset.id}, it may already be processed:`, processError.message);
        }
        
        // Wait a moment to allow processing
        console.log(`Waiting for asset ${imageAsset.id} to process...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Publish the asset
        try {
          await updatedAsset.publish();
          console.log(`Asset ${imageAsset.id} published`);
        } catch (publishError) {
          console.log(`Warning: Could not publish asset ${imageAsset.id}, it may already be published:`, publishError.message);
        }
      } catch (assetError) {
        if (assetError.name === 'NotFound') {
          console.log(`Asset ${imageAsset.id} not found, creating it`);
          
          // Create new asset
          const newAsset = await environment.createAssetWithId(imageAsset.id, {
            fields: {
              title: { 'en-US': imageAsset.title },
              description: { 'en-US': imageAsset.description },
              file: {
                'en-US': {
                  contentType: 'image/jpeg',
                  fileName: `${imageAsset.id}.jpg`,
                  upload: imageAsset.url
                }
              }
            }
          });
          
          console.log(`Asset ${imageAsset.id} created`);
          
          // Process the asset
          try {
            await newAsset.processForAllLocales();
            console.log(`Asset ${imageAsset.id} processed`);
          } catch (processError) {
            console.log(`Warning: Could not process asset ${imageAsset.id}:`, processError.message);
          }
          
          // Wait for processing
          console.log(`Waiting for asset ${imageAsset.id} to process...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Publish the asset
          try {
            await newAsset.publish();
            console.log(`Asset ${imageAsset.id} published`);
          } catch (publishError) {
            console.log(`Warning: Could not publish asset ${imageAsset.id}:`, publishError.message);
          }
        } else {
          console.error(`Error handling asset ${imageAsset.id}:`, assetError.message);
        }
      }
    }
    
    console.log('Now updating the article to use the correct featured image...');
    
    // Update the article to use the proper image
    try {
      const article = await environment.getEntry('article-1');
      console.log('Found article, updating featured image...');
      
      // Update the featured image reference
      article.fields.featuredImage = {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: 'article1-image'
          }
        }
      };
      
      // Save the updated article
      const updatedArticle = await article.update();
      console.log('Article updated with new featured image');
      
      // Publish the updated article
      try {
        await updatedArticle.publish();
        console.log('Article published with new featured image');
      } catch (publishError) {
        console.log('Warning: Could not publish article:', publishError.message);
      }
    } catch (articleError) {
      console.error('Error updating article:', articleError.message);
    }
    
    console.log('Image asset fix completed!');
  } catch (error) {
    console.error('Error fixing image assets:', error.message);
    if (error.details) {
      console.error('Error details:', JSON.stringify(error.details, null, 2));
    }
  }
}

// Run the script
run();