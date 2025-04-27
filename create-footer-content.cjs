const contentful = require('contentful-management');
require('dotenv').config();

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_MANAGEMENT_TOKEN) {
  console.error('Error: CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN environment variables are required.');
  process.exit(1);
}

async function createFooterContentType() {
  try {
    console.log('Creating Contentful client with management token...');
    const client = contentful.createClient({
      accessToken: CONTENTFUL_MANAGEMENT_TOKEN
    });

    console.log(`Accessing space ${CONTENTFUL_SPACE_ID}...`);
    const space = await client.getSpace(CONTENTFUL_SPACE_ID);
    
    console.log('Accessing default environment...');
    const environment = await space.getEnvironment('master');

    // Check if footer content type already exists
    try {
      const existingContentType = await environment.getContentType('footer');
      console.log('Footer content type already exists, updating it...');
      
      // You can update fields here if needed
      // existingContentType.fields.push(...);
      // await existingContentType.update();
      
      return existingContentType;
    } catch (error) {
      console.log('Footer content type does not exist yet, creating it...');
    }

    // Create the Footer content type
    console.log('Creating footer content type...');
    const footerContentType = await environment.createContentTypeWithId('footer', {
      name: 'Footer',
      description: 'Website footer with quick links, contact information and social media links',
      displayField: 'title',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          required: true,
          localized: false
        },
        {
          id: 'description',
          name: 'Description',
          type: 'Text',
          required: true,
          localized: false
        },
        {
          id: 'socialLinks',
          name: 'Social Links',
          type: 'Array',
          items: {
            type: 'Object',
            validations: []
          },
          required: false,
          localized: false
        },
        {
          id: 'quickLinks',
          name: 'Quick Links',
          type: 'Object',
          required: true,
          localized: false
        },
        {
          id: 'contactInfo',
          name: 'Contact Information',
          type: 'Object',
          required: true,
          localized: false
        },
        {
          id: 'copyrightText',
          name: 'Copyright Text',
          type: 'Symbol',
          required: true,
          localized: false
        },
        {
          id: 'policies',
          name: 'Policy Links',
          type: 'Array',
          items: {
            type: 'Object',
            validations: []
          },
          required: false,
          localized: false
        }
      ]
    });

    console.log('Publishing footer content type...');
    await footerContentType.publish();
    console.log('Footer content type has been created and published successfully!');
    
    return footerContentType;
  } catch (error) {
    console.error('Error creating footer content type:', error);
    throw error;
  }
}

async function createFooterEntry(contentType) {
  try {
    const client = contentful.createClient({
      accessToken: CONTENTFUL_MANAGEMENT_TOKEN
    });

    const space = await client.getSpace(CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');

    // Check if a footer entry already exists
    const entries = await environment.getEntries({
      content_type: 'footer'
    });

    if (entries.items.length > 0) {
      console.log('Footer entry already exists, skipping creation...');
      return entries.items[0];
    }

    console.log('Creating footer entry...');
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
            { platform: 'facebook', url: '#', icon: 'fab fa-facebook-f' },
            { platform: 'instagram', url: '#', icon: 'fab fa-instagram' },
            { platform: 'pinterest', url: '#', icon: 'fab fa-pinterest' },
            { platform: 'youtube', url: '#', icon: 'fab fa-youtube' }
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

    console.log('Publishing footer entry...');
    await entry.publish();
    console.log('Footer entry has been created and published successfully!');
    
    return entry;
  } catch (error) {
    console.error('Error creating footer entry:', error);
    throw error;
  }
}

async function run() {
  try {
    console.log('Starting footer content setup...');
    const contentType = await createFooterContentType();
    console.log('Waiting 5 seconds for Contentful to process the content type...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const entry = await createFooterEntry(contentType);
    console.log('Footer setup completed successfully!');
  } catch (error) {
    console.error('Footer setup failed:', error);
    process.exit(1);
  }
}

run();