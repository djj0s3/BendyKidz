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

async function createTestimonialsEntry() {
  try {
    // Initialize the contentful management client
    const client = contentful.createClient({
      accessToken: accessToken
    });

    // Get the space and environment
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment('master');
    
    // Use the content type ID from the list (choosing the first one)
    const contentTypeId = '5yFRIbJzIT49cmZXXpeYQX';

    console.log(`Creating entry for content type: ${contentTypeId}`);
    
    // Create the entry
    const entry = await environment.createEntry(contentTypeId, {
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
    console.log('Testimonials Section entry created and published successfully!');
    
  } catch (error) {
    console.error('Error creating entry:', error);
    process.exit(1);
  }
}

createTestimonialsEntry();