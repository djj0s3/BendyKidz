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

async function createFooterEntry() {
  try {
    // Initialize the contentful management client
    const client = contentful.createClient({
      accessToken: accessToken
    });

    // Get the space and environment
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment('master');

    console.log('Creating Footer entry...');
    
    // Create the entry directly
    const entry = await environment.createEntry('footer', {
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
    console.log('Footer entry created and published successfully!');
    
  } catch (error) {
    console.error('Error creating Footer entry:', error);
    process.exit(1);
  }
}

createFooterEntry();