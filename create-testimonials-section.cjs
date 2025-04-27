#!/usr/bin/env node

const contentful = require('contentful-management');

// Get environment variables
require('dotenv').config();

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

if (!spaceId || !accessToken) {
  console.error('Missing required environment variables: CONTENTFUL_SPACE_ID and/or CONTENTFUL_MANAGEMENT_TOKEN');
  process.exit(1);
}

async function createTestimonialsSection() {
  try {
    // Initialize the contentful management client
    const client = contentful.createClient({
      accessToken: accessToken
    });

    // Get the space and environment
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment('master');

    console.log('Creating TestimonialsSection content type...');

    // Check if content type already exists
    let contentType;
    try {
      contentType = await environment.getContentType('testimonialsSection');
      console.log('TestimonialsSection content type already exists.');
    } catch (error) {
      // Create the content type if it doesn't exist
      contentType = await environment.createContentType({
        name: 'Testimonials Section',
        sys: {
          id: 'testimonialsSection'
        },
        displayField: 'title',
        fields: [
          {
            id: 'title',
            name: 'Section Title',
            type: 'Symbol',
            required: true,
            localized: false,
            validations: []
          },
          {
            id: 'subtitle',
            name: 'Section Subtitle',
            type: 'Symbol',
            required: false,
            localized: false,
            validations: []
          }
        ]
      });

      // Publish the content type
      await contentType.publish();
      console.log('TestimonialsSection content type created and published.');
    }

    // Create an entry after a brief delay (to ensure content type is fully processed)
    console.log('Creating TestimonialsSection entry...');
    
    setTimeout(async () => {
      try {
        // Get the latest environment to ensure we're using the updated content type
        const updatedEnvironment = await space.getEnvironment('master');
        
        // Create the entry
        const entry = await updatedEnvironment.createEntry('testimonialsSection', {
          fields: {
            title: {
              'en-US': 'Every Child Can Thrive with the Right Support'
            },
            subtitle: {
              'en-US': 'See what parents and educators are saying about our resources'
            }
          }
        });

        // Publish the entry
        await entry.publish();
        console.log('TestimonialsSection entry created and published.');
        console.log('Testimonials Section setup complete!');
      } catch (entryError) {
        console.error('Error creating entry:', entryError);
      }
    }, 5000); // 5 second delay
    
  } catch (error) {
    console.error('Error setting up Testimonials Section:', error);
    process.exit(1);
  }
}

createTestimonialsSection();