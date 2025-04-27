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

async function createHeaderEntry() {
  try {
    // Initialize the contentful management client
    const client = contentful.createClient({
      accessToken: accessToken
    });

    // Get the space and environment
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment('master');

    console.log('Creating Header entry...');
    
    // Create the entry directly
    const entry = await environment.createEntry('header', {
      fields: {
        title: {
          'en-US': 'BendyKidz'
        },
        logoUrl: {
          'en-US': '' // We can use SVG directly in the code
        },
        navigationItems: {
          'en-US': [
            {
              label: 'Home',
              url: '/',
              order: 1
            },
            {
              label: 'Resources',
              url: '/articles',
              order: 2
            },
            {
              label: 'About',
              url: '/about',
              order: 3
            },
            {
              label: 'Contact',
              url: '/contact',
              order: 4
            }
          ]
        },
        searchPlaceholder: {
          'en-US': 'Search resources and articles...'
        }
      }
    });

    // Publish the entry
    await entry.publish();
    console.log('Header entry created and published successfully!');
    
  } catch (error) {
    console.error('Error creating Header entry:', error);
    process.exit(1);
  }
}

createHeaderEntry();