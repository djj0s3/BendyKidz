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

async function createHeaderContent() {
  try {
    // Initialize the contentful management client
    const client = contentful.createClient({
      accessToken: accessToken
    });

    // Get the space and environment
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment('master');

    console.log('Creating Header content type...');

    // Check if content type already exists
    let contentType;
    try {
      contentType = await environment.getContentType('header');
      console.log('Header content type already exists.');
    } catch (error) {
      // Create the content type if it doesn't exist
      contentType = await environment.createContentType({
        name: 'Header',
        sys: {
          id: 'header'
        },
        displayField: 'title',
        fields: [
          {
            id: 'title',
            name: 'Title',
            type: 'Symbol',
            required: true,
            localized: false,
            validations: []
          },
          {
            id: 'logoUrl',
            name: 'Logo URL',
            type: 'Symbol',
            required: false,
            localized: false,
            validations: []
          },
          {
            id: 'navigationItems',
            name: 'Navigation Items',
            type: 'Array',
            required: false,
            localized: false,
            items: {
              type: 'Object',
              validations: [],
              linkType: null
            }
          },
          {
            id: 'searchPlaceholder',
            name: 'Search Placeholder',
            type: 'Symbol',
            required: false,
            localized: false,
            validations: []
          }
        ]
      });

      // Publish the content type
      await contentType.publish();
      console.log('Header content type created and published.');
    }

    console.log('Creating Header entry...');
    
    // Create the entry
    let entry;
    try {
      const entries = await environment.getEntries({
        content_type: 'header',
        limit: 1
      });

      if (entries.items.length > 0) {
        console.log('Header entry already exists.');
        entry = entries.items[0];
      } else {
        // Create the entry if it doesn't exist
        entry = await environment.createEntry('header', {
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
        console.log('Header entry created and published.');
      }

      console.log('Header content setup complete!');
    } catch (error) {
      console.error('Error creating Header entry:', error);
    }
  } catch (error) {
    console.error('Error setting up Header content:', error);
    process.exit(1);
  }
}

createHeaderContent();