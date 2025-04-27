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

async function createFooterContent() {
  try {
    // Initialize the contentful management client
    const client = contentful.createClient({
      accessToken: accessToken
    });

    // Get the space and environment
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment('master');

    console.log('Creating Footer content type...');

    // Check if content type already exists
    let contentType;
    try {
      contentType = await environment.getContentType('footer');
      console.log('Footer content type already exists.');
    } catch (error) {
      // Create the content type if it doesn't exist
      contentType = await environment.createContentType({
        name: 'Footer',
        sys: {
          id: 'footer'
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
            id: 'description',
            name: 'Description',
            type: 'Text',
            required: false,
            localized: false,
            validations: []
          },
          {
            id: 'socialLinks',
            name: 'Social Links',
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
            id: 'quickLinks',
            name: 'Quick Links Section',
            type: 'Object',
            required: false,
            localized: false,
          },
          {
            id: 'contactInfo',
            name: 'Contact Information',
            type: 'Object',
            required: false,
            localized: false,
          },
          {
            id: 'copyrightText',
            name: 'Copyright Text',
            type: 'Symbol',
            required: false,
            localized: false,
            validations: []
          },
          {
            id: 'policies',
            name: 'Policy Links',
            type: 'Array',
            required: false,
            localized: false,
            items: {
              type: 'Object',
              validations: [],
              linkType: null
            }
          }
        ]
      });

      // Publish the content type
      await contentType.publish();
      console.log('Footer content type created and published.');
    }

    console.log('Creating Footer entry...');
    
    // Create the entry
    let entry;
    try {
      const entries = await environment.getEntries({
        content_type: 'footer',
        limit: 1
      });

      if (entries.items.length > 0) {
        console.log('Footer entry already exists.');
        entry = entries.items[0];
      } else {
        // Create the entry if it doesn't exist
        entry = await environment.createEntry('footer', {
          fields: {
            title: {
              'en-US': 'BendyKidz'
            },
            description: {
              'en-US': 'Expert occupational therapy resources for parents to support their children\'s development through play-based activities.'
            },
            socialLinks: {
              'en-US': [
                {
                  platform: 'facebook',
                  url: '#',
                  icon: 'fab fa-facebook-f'
                },
                {
                  platform: 'instagram',
                  url: '#',
                  icon: 'fab fa-instagram'
                },
                {
                  platform: 'pinterest',
                  url: '#',
                  icon: 'fab fa-pinterest'
                },
                {
                  platform: 'youtube',
                  url: '#',
                  icon: 'fab fa-youtube'
                }
              ]
            },
            quickLinks: {
              'en-US': {
                title: 'Quick Links',
                links: [
                  { label: 'Home', url: '/' },
                  { label: 'About Us', url: '/about' },
                  { label: 'Resources', url: '/articles' },
                  { label: 'Articles', url: '/articles' },
                  { label: 'Contact', url: '/contact' }
                ]
              }
            },
            contactInfo: {
              'en-US': {
                title: 'Contact Us',
                address: '123 Therapy Lane\nWellness City, WC 12345',
                phone: '(555) 123-4567',
                email: 'info@bendykidz.com'
              }
            },
            copyrightText: {
              'en-US': '© {year} BendyKidz. All rights reserved.'
            },
            policies: {
              'en-US': [
                { label: 'Privacy Policy', url: '#' },
                { label: 'Terms of Service', url: '#' },
                { label: 'Cookie Policy', url: '#' }
              ]
            }
          }
        });

        // Publish the entry
        await entry.publish();
        console.log('Footer entry created and published.');
      }

      console.log('Footer content setup complete!');
    } catch (error) {
      console.error('Error creating Footer entry:', error);
    }
  } catch (error) {
    console.error('Error setting up Footer content:', error);
    process.exit(1);
  }
}

createFooterContent();