const contentful = require('contentful-management');
require('dotenv').config();

// Initialize the Contentful client
const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
});

async function checkContentType() {
  try {
    console.log('Fetching content type details...');
    
    // Get space and environment
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    // Get content type
    const contentType = await environment.getContentType('aboutPage');
    
    console.log('Content type fields:');
    contentType.fields.forEach(field => {
      console.log(`- ${field.id} (${field.type}${field.linkType ? ', linkType: ' + field.linkType : ''})`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
checkContentType()
  .then(() => console.log('Complete'))
  .catch(err => console.error('Failed:', err));