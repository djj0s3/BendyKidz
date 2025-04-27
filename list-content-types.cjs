// Script to list content types in Contentful
const contentful = require('contentful-management');
require('dotenv').config();

async function listContentTypes() {
  try {
    const client = contentful.createClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
    });
    
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    const contentTypes = await environment.getContentTypes();
    console.log('Available content types:');
    contentTypes.items.forEach(type => {
      console.log(`- ${type.sys.id}: ${type.name}`);
    });
  } catch (error) {
    console.error('Error listing content types:', error);
  }
}

listContentTypes();