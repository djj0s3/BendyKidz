const contentful = require('contentful-management');
require('dotenv').config();

// Initialize the Contentful client
const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
});

async function fixAboutImage() {
  try {
    console.log('Starting to fix about page image...');
    
    // Get space and environment
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    // Check if we have the about page entry
    console.log('Looking for about page entry...');
    const entries = await environment.getEntries({
      content_type: 'aboutPage'
    });
    
    if (entries.items.length === 0) {
      console.log('No about page entry found!');
      return;
    }
    
    console.log(`Found ${entries.items.length} about page entries`);
    const aboutEntry = entries.items[0];
    
    // Get existing field values
    const fields = aboutEntry.fields;
    
    // We know the emma-avatar asset exists and works
    const avatarAssetId = 'emma-avatar';
    
    // Update the image field to use emma-avatar
    console.log('Updating image field to use emma-avatar...');
    aboutEntry.fields.image = { 
      'en-US': {
        sys: {
          type: 'Link',
          linkType: 'Asset',
          id: avatarAssetId
        }
      } 
    };
    
    console.log('Updating the entry...');
    const updatedEntry = await aboutEntry.update();
    console.log('Publishing the entry...');
    await updatedEntry.publish();
    console.log('Entry updated and published successfully!');
    
  } catch (error) {
    console.error('Error fixing about image:', error);
  }
}

// Run the function
fixAboutImage()
  .then(() => console.log('Script completed successfully'))
  .catch(error => console.error('Script failed:', error));