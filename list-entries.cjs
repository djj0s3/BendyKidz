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

async function listEntries() {
  try {
    // Initialize the contentful management client
    const client = contentful.createClient({
      accessToken: accessToken
    });

    // Get the space and environment
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment('master');
    
    // List entries for the testimonials section content type
    const contentTypeId = '5yFRIbJzIT49cmZXXpeYQX';
    const entries = await environment.getEntries({
      content_type: contentTypeId
    });
    
    console.log(`Found ${entries.items.length} entries for content type ${contentTypeId}:`);
    
    entries.items.forEach(entry => {
      console.log(`- ID: ${entry.sys.id}`);
      console.log(`  Title: ${entry.fields.title['en-US']}`);
      console.log(`  Subtitle: ${entry.fields.subtitle ? entry.fields.subtitle['en-US'] : 'None'}`);
      console.log('  Published:', entry.isPublished() ? 'Yes' : 'No');
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error listing entries:', error);
    process.exit(1);
  }
}

listEntries();