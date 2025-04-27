const contentful = require('contentful-management');
require('dotenv').config();

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_MANAGEMENT_TOKEN) {
  console.error('Error: CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN environment variables are required.');
  process.exit(1);
}

async function createHeaderContentType() {
  try {
    console.log('Creating Contentful client with management token...');
    const client = contentful.createClient({
      accessToken: CONTENTFUL_MANAGEMENT_TOKEN
    });

    console.log(`Accessing space ${CONTENTFUL_SPACE_ID}...`);
    const space = await client.getSpace(CONTENTFUL_SPACE_ID);
    
    console.log('Accessing default environment...');
    const environment = await space.getEnvironment('master');

    // Check if header content type already exists
    try {
      const existingContentType = await environment.getContentType('header');
      console.log('Header content type already exists, updating it...');
      
      // You can update fields here if needed
      // existingContentType.fields.push(...);
      // await existingContentType.update();
      
      return existingContentType;
    } catch (error) {
      console.log('Header content type does not exist yet, creating it...');
    }

    // Create the Header content type
    console.log('Creating header content type...');
    const headerContentType = await environment.createContentTypeWithId('header', {
      name: 'Header',
      description: 'Website header with navigation menu',
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
          id: 'logoUrl',
          name: 'Logo URL',
          type: 'Symbol',
          required: false,
          localized: false
        },
        {
          id: 'navigationItems',
          name: 'Navigation Items',
          type: 'Array',
          items: {
            type: 'Object',
            validations: []
          },
          required: true,
          localized: false
        },
        {
          id: 'searchPlaceholder',
          name: 'Search Placeholder',
          type: 'Symbol',
          required: false,
          localized: false
        }
      ]
    });

    console.log('Publishing header content type...');
    await headerContentType.publish();
    console.log('Header content type has been created and published successfully!');
    
    return headerContentType;
  } catch (error) {
    console.error('Error creating header content type:', error);
    throw error;
  }
}

async function createHeaderEntry(contentType) {
  try {
    const client = contentful.createClient({
      accessToken: CONTENTFUL_MANAGEMENT_TOKEN
    });

    const space = await client.getSpace(CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');

    // Check if a header entry already exists
    const entries = await environment.getEntries({
      content_type: 'header'
    });

    if (entries.items.length > 0) {
      console.log('Header entry already exists, skipping creation...');
      return entries.items[0];
    }

    console.log('Creating header entry...');
    const entry = await environment.createEntry('header', {
      fields: {
        title: {
          'en-US': 'BendyKidz'
        },
        logoUrl: {
          'en-US': ''  // Leave empty for now
        },
        navigationItems: {
          'en-US': [
            { label: 'Home', url: '/', order: 1 },
            { label: 'Resources', url: '/articles', order: 2 },
            { label: 'About', url: '/about', order: 3 },
            { label: 'Contact', url: '/contact', order: 4 }
          ]
        },
        searchPlaceholder: {
          'en-US': 'Search resources and articles...'
        }
      }
    });

    console.log('Publishing header entry...');
    await entry.publish();
    console.log('Header entry has been created and published successfully!');
    
    return entry;
  } catch (error) {
    console.error('Error creating header entry:', error);
    throw error;
  }
}

async function run() {
  try {
    console.log('Starting header content setup...');
    const contentType = await createHeaderContentType();
    console.log('Waiting 5 seconds for Contentful to process the content type...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const entry = await createHeaderEntry(contentType);
    console.log('Header setup completed successfully!');
  } catch (error) {
    console.error('Header setup failed:', error);
    process.exit(1);
  }
}

run();