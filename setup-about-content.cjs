const contentful = require('contentful-management');
require('dotenv').config();

// Initialize the Contentful client
const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
});

async function setupAboutContent() {
  try {
    console.log('Starting simplified about page content creation...');
    
    // Get space and environment
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    // First, let's check for existing assets we can use
    console.log('Looking for existing assets...');
    const assets = await environment.getAssets();
    
    console.log(`Found ${assets.items.length} assets`);
    assets.items.forEach(asset => {
      console.log(`- Asset ID: ${asset.sys.id}, Title: ${asset.fields.title?.['en-US'] || 'No title'}`);
    });
    
    // We'll use the emma-avatar asset that already exists
    const avatarAssetId = 'emma-avatar';
    
    // Create or update about page entry
    console.log('Checking for existing about page entries...');
    const entries = await environment.getEntries({
      content_type: 'aboutPage'
    });
    
    if (entries.items.length > 0) {
      console.log('About page entry already exists, updating it...');
      const entry = entries.items[0];
      
      entry.fields.title = { 'en-US': 'About BendyKidz Occupational Therapy' };
      entry.fields.subtitle = { 'en-US': 'Empowering children through play-based therapy and parent education' };
      entry.fields.description = { 'en-US': '<p>BendyKidz Occupational Therapy was founded by Emma Wilson, a pediatric occupational therapist with over 15 years of experience working with children of all abilities.</p><p>After years of clinical practice, Emma recognized that families needed more accessible resources to continue supporting their children\'s development at home. This website was created to bridge that gap – providing evidence-based information and practical strategies in an easy-to-implement format.</p>' };
      entry.fields.mission = { 'en-US': '<p>Our mission is to make a meaningful difference in children\'s lives through evidence-based practices, play-based learning, and family-centered care. We believe in making therapeutic strategies accessible to all families, regardless of their location or resources.</p>' };
      entry.fields.image = { 
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: avatarAssetId
          }
        } 
      };
      entry.fields.imageAlt = { 'en-US': 'Emma Wilson, Lead Occupational Therapist' };
      
      console.log('Updating the entry...');
      const updatedEntry = await entry.update();
      console.log('Publishing the entry...');
      await updatedEntry.publish();
      console.log('Entry updated and published successfully!');
    } else {
      console.log('Creating new about page entry...');
      const entry = await environment.createEntry('aboutPage', {
        fields: {
          title: { 'en-US': 'About BendyKidz Occupational Therapy' },
          subtitle: { 'en-US': 'Empowering children through play-based therapy and parent education' },
          description: { 'en-US': '<p>BendyKidz Occupational Therapy was founded by Emma Wilson, a pediatric occupational therapist with over 15 years of experience working with children of all abilities.</p><p>After years of clinical practice, Emma recognized that families needed more accessible resources to continue supporting their children\'s development at home. This website was created to bridge that gap – providing evidence-based information and practical strategies in an easy-to-implement format.</p>' },
          mission: { 'en-US': '<p>Our mission is to make a meaningful difference in children\'s lives through evidence-based practices, play-based learning, and family-centered care. We believe in making therapeutic strategies accessible to all families, regardless of their location or resources.</p>' },
          image: { 
            'en-US': {
              sys: {
                type: 'Link',
                linkType: 'Asset',
                id: avatarAssetId
              }
            } 
          },
          imageAlt: { 'en-US': 'Emma Wilson, Lead Occupational Therapist' }
        }
      });
      
      console.log('Publishing the entry...');
      await entry.publish();
      console.log('Entry created and published successfully!');
    }
    
    console.log('About page content creation completed!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
setupAboutContent()
  .then(() => console.log('Script completed successfully'))
  .catch(error => console.error('Script failed:', error));