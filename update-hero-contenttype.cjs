// Script to update the Contentful hero section content type
const { createClient } = require('contentful-management');
require('dotenv').config();

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

// Initialize the client
const client = createClient({
  accessToken: managementToken
});

async function updateHeroSectionContentType() {
  try {
    console.log('Starting Contentful hero section content type update...');
    
    if (!spaceId || !managementToken) {
      throw new Error('Missing required environment variables. Make sure CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN are set.');
    }
    
    // Get space and environment
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment('master');
    
    // Get existing content type
    try {
      const contentType = await environment.getContentType('heroSection');
      console.log('Found heroSection content type, updating it...');
      
      // Check if the button color fields already exist
      const existingFields = contentType.fields.map(field => field.id);
      const fieldsToAdd = [];
      
      if (!existingFields.includes('primaryButtonColor')) {
        fieldsToAdd.push({
          id: 'primaryButtonColor',
          name: 'Primary Button Color',
          type: 'Symbol',
          required: false,
          validations: [
            {
              regexp: {
                pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
                flags: null
              },
              message: 'Please enter a valid hex color code (e.g., #FF5733)'
            }
          ]
        });
      }
      
      if (!existingFields.includes('primaryButtonTextColor')) {
        fieldsToAdd.push({
          id: 'primaryButtonTextColor',
          name: 'Primary Button Text Color',
          type: 'Symbol',
          required: false,
          validations: [
            {
              regexp: {
                pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
                flags: null
              },
              message: 'Please enter a valid hex color code (e.g., #FFFFFF)'
            }
          ]
        });
      }
      
      if (!existingFields.includes('secondaryButtonColor')) {
        fieldsToAdd.push({
          id: 'secondaryButtonColor',
          name: 'Secondary Button Color',
          type: 'Symbol',
          required: false,
          validations: [
            {
              regexp: {
                pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
                flags: null
              },
              message: 'Please enter a valid hex color code (e.g., #FFFFFF)'
            }
          ]
        });
      }
      
      if (!existingFields.includes('secondaryButtonTextColor')) {
        fieldsToAdd.push({
          id: 'secondaryButtonTextColor',
          name: 'Secondary Button Text Color',
          type: 'Symbol',
          required: false,
          validations: [
            {
              regexp: {
                pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
                flags: null
              },
              message: 'Please enter a valid hex color code (e.g., #000000)'
            }
          ]
        });
      }
      
      if (fieldsToAdd.length > 0) {
        // Add new fields
        contentType.fields = [...contentType.fields, ...fieldsToAdd];
        
        // Update and publish content type
        const updatedContentType = await contentType.update();
        await updatedContentType.publish();
        console.log('heroSection content type updated successfully with new button color fields');
      } else {
        console.log('No new fields to add, heroSection content type already has the button color fields');
      }
      
    } catch (error) {
      console.error('Error updating hero section content type:', error.message);
      throw error;
    }
    
    console.log('Content type update completed successfully!');
  } catch (error) {
    console.error('Error in update process:', error.message);
    if (error.details) {
      console.error('Error details:', JSON.stringify(error.details, null, 2));
    }
  }
}

// Run the update
updateHeroSectionContentType();