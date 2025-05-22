const contentful = require('contentful-management');

async function createCategorySectionContentType() {
  try {
    console.log('Starting Contentful setup for category section...');
    
    const client = contentful.createClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
    });

    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');

    // Create the categorySection content type
    console.log('Creating categorySection content type...');
    
    try {
      const contentType = await environment.createContentType({
        sys: {
          id: 'categorySection'
        },
        name: 'Category Section',
        description: 'Content for the Browse by Category section on the homepage',
        displayField: 'title',
        fields: [
          {
            id: 'title',
            name: 'Section Title',
            type: 'Symbol',
            localized: false,
            required: true,
            validations: [],
            disabled: false,
            omitted: false
          },
          {
            id: 'description',
            name: 'Section Description',
            type: 'Text',
            localized: false,
            required: true,
            validations: [],
            disabled: false,
            omitted: false
          }
        ]
      });

      await contentType.publish();
      console.log('✅ categorySection content type created and published');

      // Create entry with placeholder content
      console.log('Creating category section entry...');
      
      const entry = await environment.createEntry('categorySection', {
        fields: {
          title: {
            'en-US': 'Browse by Category'
          },
          description: {
            'en-US': 'Find specific resources tailored to your child\'s developmental needs and interests'
          }
        }
      });

      await entry.publish();
      console.log('✅ Category section entry created and published');

    } catch (error) {
      if (error.name === 'ValidationFailed' && error.message.includes('already exists')) {
        console.log('categorySection content type already exists, updating entry...');
        
        // Try to create/update the entry
        try {
          const entry = await environment.createEntry('categorySection', {
            fields: {
              title: {
                'en-US': 'Browse by Category'
              },
              description: {
                'en-US': 'Find specific resources tailored to your child\'s developmental needs and interests'
              }
            }
          });
          await entry.publish();
          console.log('✅ Category section entry created and published');
        } catch (entryError) {
          console.log('Entry might already exist, that\'s okay!');
        }
      } else {
        throw error;
      }
    }

    console.log('🎉 Category section setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up category section:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

createCategorySectionContentType();