require('dotenv').config();
const contentful = require('contentful-management');

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_MANAGEMENT_TOKEN) {
  console.error('Error: CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN environment variables are required.');
  process.exit(1);
}

async function initContentfulClient() {
  const client = contentful.createClient({
    accessToken: CONTENTFUL_MANAGEMENT_TOKEN
  });
  const space = await client.getSpace(CONTENTFUL_SPACE_ID);
  const environment = await space.getEnvironment('master');
  return environment;
}

// Get content types from Contentful
async function getContentTypes() {
  try {
    const environment = await initContentfulClient();
    const response = await environment.getContentTypes();
    console.log(`Found ${response.items.length} content types:`);
    
    response.items.forEach(contentType => {
      console.log(`- ${contentType.name} (ID: ${contentType.sys.id})`);
      console.log('  Fields:');
      contentType.fields.forEach(field => {
        console.log(`  - ${field.name} (ID: ${field.id}, Type: ${field.type})`);
      });
      console.log('');
    });
  } catch (error) {
    console.error('Error getting content types:', error);
  }
}

// Create a content type
async function createContentType(id, name, fields) {
  try {
    const environment = await initContentfulClient();
    
    try {
      // Check if content type already exists
      await environment.getContentType(id);
      console.log(`Content type '${id}' already exists.`);
      return;
    } catch (error) {
      // Content type doesn't exist, create it
      console.log(`Creating content type '${id}'...`);
      
      const contentType = await environment.createContentTypeWithId(id, {
        name: name,
        fields: fields
      });
      
      console.log('Publishing content type...');
      await contentType.publish();
      console.log(`Content type '${id}' created and published successfully.`);
    }
  } catch (error) {
    console.error(`Error creating content type '${id}':`, error);
  }
}

// Create a content entry
async function createEntry(contentTypeId, fields) {
  try {
    const environment = await initContentfulClient();
    
    console.log(`Creating entry for content type '${contentTypeId}'...`);
    const entry = await environment.createEntry(contentTypeId, {
      fields: fields
    });
    
    console.log('Publishing entry...');
    await entry.publish();
    console.log(`Entry for '${contentTypeId}' created and published successfully.`);
  } catch (error) {
    console.error(`Error creating entry for '${contentTypeId}':`, error);
  }
}

async function run() {
  try {
    // Get existing content types
    await getContentTypes();
    
    // Define simple content types and create them
    
    // Header Content Type
    const headerFields = [
      {
        id: 'title',
        name: 'Title',
        type: 'Symbol',
        required: true
      },
      {
        id: 'navItems',
        name: 'Navigation Items (JSON)',
        type: 'Text',
        required: true
      },
      {
        id: 'searchPlaceholder',
        name: 'Search Placeholder',
        type: 'Symbol',
        required: false
      }
    ];
    
    await createContentType('simpleHeader', 'Simple Header', headerFields);
    
    // Footer Content Type
    const footerFields = [
      {
        id: 'title',
        name: 'Title',
        type: 'Symbol',
        required: true
      },
      {
        id: 'description',
        name: 'Description',
        type: 'Text',
        required: true
      },
      {
        id: 'socialLinksJson',
        name: 'Social Links (JSON)',
        type: 'Text',
        required: false
      },
      {
        id: 'quickLinksJson',
        name: 'Quick Links (JSON)',
        type: 'Text',
        required: true
      },
      {
        id: 'contactInfoJson',
        name: 'Contact Info (JSON)',
        type: 'Text',
        required: true
      },
      {
        id: 'copyrightText',
        name: 'Copyright Text',
        type: 'Symbol',
        required: true
      },
      {
        id: 'policiesJson',
        name: 'Policies (JSON)',
        type: 'Text',
        required: false
      }
    ];
    
    await createContentType('simpleFooter', 'Simple Footer', footerFields);
    
    // Create actual entries
    
    // Header Entry
    const headerData = {
      title: { 'en-US': 'BendyKidz' },
      navItems: { 
        'en-US': JSON.stringify([
          { label: 'Home', url: '/', order: 1 },
          { label: 'Resources', url: '/articles', order: 2 },
          { label: 'About', url: '/about', order: 3 },
          { label: 'Contact', url: '/contact', order: 4 }
        ])
      },
      searchPlaceholder: { 'en-US': 'Search resources and articles...' }
    };
    
    await createEntry('simpleHeader', headerData);
    
    // Footer Entry
    const footerData = {
      title: { 'en-US': 'BendyKidz' },
      description: { 
        'en-US': 'Expert occupational therapy resources for parents to support their children\'s development through play-based activities.'
      },
      socialLinksJson: { 
        'en-US': JSON.stringify([
          { platform: 'facebook', url: '#', icon: 'fab fa-facebook-f' },
          { platform: 'instagram', url: '#', icon: 'fab fa-instagram' },
          { platform: 'pinterest', url: '#', icon: 'fab fa-pinterest' },
          { platform: 'youtube', url: '#', icon: 'fab fa-youtube' }
        ])
      },
      quickLinksJson: { 
        'en-US': JSON.stringify({
          title: 'Quick Links',
          links: [
            { label: 'Home', url: '/' },
            { label: 'About Us', url: '/about' },
            { label: 'Resources', url: '/articles' },
            { label: 'Articles', url: '/articles' },
            { label: 'Contact', url: '/contact' }
          ]
        })
      },
      contactInfoJson: { 
        'en-US': JSON.stringify({
          title: 'Contact Us',
          address: '123 Therapy Lane\nWellness City, WC 12345',
          phone: '(555) 123-4567',
          email: 'info@bendykidz.com'
        })
      },
      copyrightText: { 'en-US': '© {year} BendyKidz. All rights reserved.' },
      policiesJson: { 
        'en-US': JSON.stringify([
          { label: 'Privacy Policy', url: '#' },
          { label: 'Terms of Service', url: '#' },
          { label: 'Cookie Policy', url: '#' }
        ])
      }
    };
    
    await createEntry('simpleFooter', footerData);
    
    console.log('Setup completed successfully!');
  } catch (error) {
    console.error('Error during setup:', error);
  }
}

run();