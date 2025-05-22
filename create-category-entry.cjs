const contentful = require('contentful-management');

async function createCategorySectionEntry() {
  try {
    console.log('Creating category section entry...');
    
    const client = contentful.createClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
    });

    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');

    // Wait a moment for content type to be fully activated
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create entry with great placeholder content
    const entry = await environment.createEntry('categorySection', {
      fields: {
        title: {
          'en-US': 'Browse by Category'
        },
        description: {
          'en-US': 'Find specific resources tailored to your child\'s developmental needs and interests'
        }
      }
    });

    await entry.publish();
    console.log('✅ Category section entry created and published successfully!');
    console.log('🎉 You can now edit this content directly in Contentful!');
    
  } catch (error) {
    console.error('Error creating category section entry:', error.message);
    if (error.message.includes('already exists') || error.message.includes('duplicate')) {
      console.log('✅ Entry already exists - that\'s perfect!');
    }
  }
}

createCategorySectionEntry();