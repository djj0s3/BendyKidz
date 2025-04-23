// Script to create Featured Collections content type in Contentful
const { createClient } = require('contentful-management');
require('dotenv').config();

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

// Initialize the client
const client = createClient({
  accessToken: managementToken
});

async function createFeaturedCollections() {
  try {
    console.log('Setting up Featured Collections content type in Contentful...');
    
    if (!spaceId || !managementToken) {
      throw new Error('Missing required environment variables. Make sure CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN are set.');
    }
    
    // Get space and environment
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment('master');
    
    // Create Featured Collection Content Type
    console.log('Creating Featured Collections content type...');
    
    try {
      // Check if content type already exists
      await environment.getContentType('featuredCollection');
      console.log('Featured Collection content type already exists, updating it...');
      
      const contentType = await environment.getContentType('featuredCollection');
      
      contentType.name = 'Featured Collection';
      contentType.description = 'A collection of featured articles grouped by a category or tag';
      contentType.displayField = 'title';
      
      contentType.fields = [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          required: true,
          validations: [
            {
              unique: true
            }
          ]
        },
        {
          id: 'description',
          name: 'Description',
          type: 'Text',
          required: false
        },
        {
          id: 'displayOrder',
          name: 'Display Order',
          type: 'Integer',
          required: true,
          defaultValue: { 'en-US': 1 }
        },
        {
          id: 'filterType',
          name: 'Filter Type',
          type: 'Symbol',
          required: true,
          validations: [
            {
              in: ['category', 'tag', 'featured']
            }
          ],
          defaultValue: { 'en-US': 'featured' }
        },
        {
          id: 'filterValue',
          name: 'Filter Value',
          type: 'Symbol',
          required: false
        },
        {
          id: 'maxItems',
          name: 'Maximum Items',
          type: 'Integer',
          required: true,
          defaultValue: { 'en-US': 3 }
        },
        {
          id: 'active',
          name: 'Active',
          type: 'Boolean',
          required: true,
          defaultValue: { 'en-US': true }
        }
      ];
      
      await contentType.update();
      await contentType.publish();
      
      console.log('Content type updated and published');
      
    } catch (error) {
      if (error.name === 'NotFound') {
        // Create new content type
        const contentType = await environment.createContentTypeWithId('featuredCollection', {
          name: 'Featured Collection',
          description: 'A collection of featured articles grouped by a category or tag',
          displayField: 'title',
          fields: [
            {
              id: 'title',
              name: 'Title',
              type: 'Symbol',
              required: true,
              validations: [
                {
                  unique: true
                }
              ]
            },
            {
              id: 'description',
              name: 'Description',
              type: 'Text',
              required: false
            },
            {
              id: 'displayOrder',
              name: 'Display Order',
              type: 'Integer',
              required: true,
              defaultValue: { 'en-US': 1 }
            },
            {
              id: 'filterType',
              name: 'Filter Type',
              type: 'Symbol',
              required: true,
              validations: [
                {
                  in: ['category', 'tag', 'featured']
                }
              ],
              defaultValue: { 'en-US': 'featured' }
            },
            {
              id: 'filterValue',
              name: 'Filter Value',
              type: 'Symbol',
              required: false
            },
            {
              id: 'maxItems',
              name: 'Maximum Items',
              type: 'Integer',
              required: true,
              defaultValue: { 'en-US': 3 }
            },
            {
              id: 'active',
              name: 'Active',
              type: 'Boolean',
              required: true,
              defaultValue: { 'en-US': true }
            }
          ]
        });
        
        await contentType.publish();
        console.log('New content type created and published');
      } else {
        throw error;
      }
    }
    
    // Create sample entry
    console.log('Creating sample Featured Collection entry...');
    
    try {
      // Check if entry already exists
      await environment.getEntry('featured-monthly');
      console.log('Sample entry already exists, updating it...');
      
      const entry = await environment.getEntry('featured-monthly');
      
      entry.fields = {
        title: { 'en-US': 'Featured This Month' },
        description: { 'en-US': 'A collection of our most popular resources this month' },
        displayOrder: { 'en-US': 1 },
        filterType: { 'en-US': 'featured' },
        filterValue: { 'en-US': '' },
        maxItems: { 'en-US': 3 },
        active: { 'en-US': true }
      };
      
      await entry.update();
      await entry.publish();
      
      console.log('Sample entry updated and published');
      
    } catch (error) {
      if (error.name === 'NotFound') {
        // Create new entry
        const entry = await environment.createEntryWithId('featuredCollection', 'featured-monthly', {
          fields: {
            title: { 'en-US': 'Featured This Month' },
            description: { 'en-US': 'A collection of our most popular resources this month' },
            displayOrder: { 'en-US': 1 },
            filterType: { 'en-US': 'featured' },
            filterValue: { 'en-US': '' },
            maxItems: { 'en-US': 3 },
            active: { 'en-US': true }
          }
        });
        
        await entry.publish();
        console.log('New sample entry created and published');
      } else {
        throw error;
      }
    }
    
    console.log('Featured Collections setup completed successfully!');
    
  } catch (error) {
    console.error('Error in setup process:', error.message);
    if (error.details) {
      console.error('Error details:', JSON.stringify(error.details, null, 2));
    }
  }
}

// Run the setup
createFeaturedCollections();