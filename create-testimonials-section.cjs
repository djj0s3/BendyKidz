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

    // Check if entry already exists
    let entry;
    const entries = await environment.getEntries({
      content_type: 'testimonialsSection',
      limit: 1
    });

    if (entries.items.length > 0) {
      console.log('TestimonialsSection entry already exists.');
      entry = entries.items[0];
    } else {
      // Create the entry if it doesn't exist
      entry = await environment.createEntry('testimonialsSection', {
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
    }

    console.log('Testimonials Section setup complete!');
  } catch (error) {
    console.error('Error setting up Testimonials Section:', error);
    process.exit(1);
  }
}

createTestimonialsSection();