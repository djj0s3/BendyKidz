// Simple script to test Contentful connection and fetch content types
const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

async function fetchContentTypes() {
  try {
    console.log('Fetching content types from Contentful...');
    
    const response = await fetch(
      `https://cdn.contentful.com/spaces/${spaceId}/environments/master/content_types`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching content types: ${response.status} ${response.statusText}`);
      console.error(`Error details: ${errorText}`);
      return;
    }
    
    const data = await response.json();
    
    console.log(`Found ${data.items.length} content types:`);
    data.items.forEach(contentType => {
      console.log(`- ${contentType.name} (ID: ${contentType.sys.id})`);
      console.log('  Fields:');
      contentType.fields.forEach(field => {
        console.log(`  - ${field.name} (ID: ${field.id}, Type: ${field.type})`);
      });
      console.log('');
    });
  } catch (error) {
    console.error('Error fetching content types:', error);
  }
}

// Fetch all entries to see what's in the space
async function fetchEntries() {
  try {
    console.log('\nFetching all entries from Contentful...');
    
    const response = await fetch(
      `https://cdn.contentful.com/spaces/${spaceId}/environments/master/entries?limit=100`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching entries: ${response.status} ${response.statusText}`);
      console.error(`Error details: ${errorText}`);
      return;
    }
    
    const data = await response.json();
    
    console.log(`Found ${data.items.length} entries:`);
    data.items.forEach(entry => {
      console.log(`- Entry ID: ${entry.sys.id}`);
      console.log(`  Content Type: ${entry.sys.contentType.sys.id}`);
      console.log('  Fields:');
      for (const [key, value] of Object.entries(entry.fields)) {
        console.log(`  - ${key}: ${JSON.stringify(value).substring(0, 100)}${JSON.stringify(value).length > 100 ? '...' : ''}`);
      }
      console.log('');
    });
  } catch (error) {
    console.error('Error fetching entries:', error);
  }
}

// Execute the functions
async function run() {
  await fetchContentTypes();
  await fetchEntries();
}

run();