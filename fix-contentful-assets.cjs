// Script to directly fix the asset issue in Contentful
require('dotenv').config();
const { createClient } = require('contentful-management');

// Get credentials from environment variables
const spaceId = process.env.CONTENTFUL_SPACE_ID;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

console.log('Starting Contentful asset fix...');
console.log(`Space ID: ${spaceId}`);

// Create client with full logging
const client = createClient({
  accessToken: managementToken,
  logHandler: (level, data) => console.log(level, JSON.stringify(data))
});

async function run() {
  try {
    // Get environment
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment('master');
    console.log('Connected to Contentful space and environment');
    
    // Directly check for assets
    console.log('Checking all assets in space...');
    const assets = await environment.getAssets({
      skip: 0,
      limit: 100
    });
    
    console.log(`Found ${assets.items.length} assets in space`);
    
    // Log details about each asset
    for (const asset of assets.items) {
      try {
        console.log(`Asset ${asset.sys.id}:`);
        console.log(`  Title: ${asset.fields?.title?.['en-US'] || 'No title'}`);
        console.log(`  Description: ${asset.fields?.description?.['en-US'] || 'No description'}`);
        
        const fileField = asset.fields?.file?.['en-US'];
        if (fileField) {
          console.log(`  Content type: ${fileField.contentType}`);
          console.log(`  File name: ${fileField.fileName}`);
          
          // Check for URL
          if (fileField.url) {
            console.log(`  URL: ${fileField.url}`);
          } else if (fileField.upload) {
            console.log(`  Has upload: ${!!fileField.upload}`);
          } else {
            console.log('  No URL or upload found');
          }
        } else {
          console.log('  No file field found');
        }
        
        console.log(`  Published: ${asset.sys.publishedVersion ? 'Yes' : 'No'}`);
        
        if (!asset.sys.publishedVersion) {
          console.log('  Attempting to publish asset...');
          try {
            const published = await asset.publish();
            console.log('  Asset successfully published');
          } catch (pubError) {
            console.log(`  Failed to publish: ${pubError.message}`);
          }
        }
      } catch (assetError) {
        console.log(`Error processing asset ${asset.sys.id}: ${assetError.message}`);
      }
      
      console.log('--------------------------');
    }
    
    // Check article entries for asset links
    console.log('\nChecking article entries for asset links...');
    const articles = await environment.getEntries({
      content_type: 'article'
    });
    
    console.log(`Found ${articles.items.length} article entries`);
    
    // Check each article's featured image
    for (const article of articles.items) {
      console.log(`\nChecking article "${article.fields?.title?.['en-US']}"`);
      
      // Check featured image link
      const featuredImageLink = article.fields?.featuredImage?.['en-US']?.sys;
      if (featuredImageLink) {
        console.log(`  Has featured image link: ID=${featuredImageLink.id}`);
        
        // Check if the asset exists
        try {
          const linkedAsset = await environment.getAsset(featuredImageLink.id);
          console.log(`  Found linked asset: ${linkedAsset.sys.id}`);
          
          // Check if the asset has a URL
          const fileField = linkedAsset.fields?.file?.['en-US'];
          if (fileField && fileField.url) {
            console.log(`  Asset has URL: ${fileField.url}`);
          } else if (fileField && fileField.upload) {
            console.log(`  Asset has upload but no URL yet`);
            
            // Try to process the asset
            console.log('  Attempting to process asset...');
            try {
              await linkedAsset.processForAllLocales();
              console.log('  Asset processed');
              
              // Wait a moment for processing
              await new Promise(resolve => setTimeout(resolve, 3000));
              
              // Get the processed asset
              const processedAsset = await environment.getAsset(linkedAsset.sys.id);
              const processedFile = processedAsset.fields?.file?.['en-US'];
              
              if (processedFile && processedFile.url) {
                console.log(`  Processed asset now has URL: ${processedFile.url}`);
              } else {
                console.log('  Processed asset still has no URL');
              }
              
              // Publish the asset
              if (!processedAsset.sys.publishedVersion) {
                console.log('  Publishing processed asset...');
                await processedAsset.publish();
                console.log('  Asset published');
              }
            } catch (processError) {
              console.log(`  Failed to process asset: ${processError.message}`);
            }
          } else {
            console.log('  Asset has no file field or URL');
          }
        } catch (assetError) {
          console.log(`  Error finding linked asset: ${assetError.message}`);
        }
      } else {
        console.log('  No featured image link found');
      }
    }
    
    console.log('\nContentful asset check and fix completed!');
  } catch (error) {
    console.error('Error checking Contentful assets:', error);
  }
}

// Run the script
run();