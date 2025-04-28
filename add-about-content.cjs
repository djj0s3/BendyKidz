const contentful = require('contentful-management');
require('dotenv').config();

// Initialize the Contentful client
const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
});

async function addAboutContent() {
  try {
    console.log('Starting about page content creation...');
    
    // Get space and environment
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    // Check if we already have an about page content type
    console.log('Checking if content type exists...');
    let contentType;
    try {
      contentType = await environment.getContentType('aboutPage');
      console.log('Content type already exists');
    } catch (error) {
      // Create the content type if it doesn't exist
      console.log('Creating content type...');
      contentType = await environment.createContentType({
        name: 'About Page',
        sys: { id: 'aboutPage' },
        fields: [
          { id: 'title', name: 'Title', type: 'Symbol', required: true },
          { id: 'subtitle', name: 'Subtitle', type: 'Symbol', required: false },
          { id: 'description', name: 'Description', type: 'Text', required: true },
          { id: 'mission', name: 'Mission Statement', type: 'Text', required: false },
          { id: 'imageUrl', name: 'Image URL', type: 'Symbol', required: false },
          { id: 'imageAlt', name: 'Image Alt Text', type: 'Symbol', required: false }
        ]
      });
      console.log('Publishing content type...');
      await contentType.publish();
    }
    
    // Check if we already have an about page entry
    console.log('Checking for existing entries...');
    const entries = await environment.getEntries({
      content_type: 'aboutPage'
    });
    
    if (entries.items.length > 0) {
      console.log('About page entry already exists');
      // Update it
      const entry = entries.items[0];
      console.log('Updating existing entry...');
      
      entry.fields.title = { 'en-US': 'About BendyKidz Occupational Therapy' };
      entry.fields.subtitle = { 'en-US': 'Empowering children through play-based therapy and parent education' };
      entry.fields.description = { 'en-US': '<p>BendyKidz Occupational Therapy was founded by Emma Wilson, a pediatric occupational therapist with over 15 years of experience working with children of all abilities.</p><p>After years of clinical practice, Emma recognized that families needed more accessible resources to continue supporting their children\'s development at home. This website was created to bridge that gap – providing evidence-based information and practical strategies in an easy-to-implement format.</p>' };
      entry.fields.mission = { 'en-US': '<p>Our mission is to make a meaningful difference in children\'s lives through evidence-based practices, play-based learning, and family-centered care. We believe in making therapeutic strategies accessible to all families, regardless of their location or resources.</p>' };
      entry.fields.imageUrl = { 'en-US': 'https://images.unsplash.com/photo-1516627145497-ae6968895b24?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' };
      entry.fields.imageAlt = { 'en-US': 'Occupational therapist working with child on fine motor skills' };
      
      const updatedEntry = await entry.update();
      console.log('Entry updated');
      console.log('Publishing entry...');
      await updatedEntry.publish();
      console.log('Entry published successfully!');
    } else {
      // Create new entry
      console.log('Creating new entry...');
      const entry = await environment.createEntry('aboutPage', {
        fields: {
          title: { 'en-US': 'About BendyKidz Occupational Therapy' },
          subtitle: { 'en-US': 'Empowering children through play-based therapy and parent education' },
          description: { 'en-US': '<p>BendyKidz Occupational Therapy was founded by Emma Wilson, a pediatric occupational therapist with over 15 years of experience working with children of all abilities.</p><p>After years of clinical practice, Emma recognized that families needed more accessible resources to continue supporting their children\'s development at home. This website was created to bridge that gap – providing evidence-based information and practical strategies in an easy-to-implement format.</p>' },
          mission: { 'en-US': '<p>Our mission is to make a meaningful difference in children\'s lives through evidence-based practices, play-based learning, and family-centered care. We believe in making therapeutic strategies accessible to all families, regardless of their location or resources.</p>' },
          imageUrl: { 'en-US': 'https://images.unsplash.com/photo-1516627145497-ae6968895b24?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
          imageAlt: { 'en-US': 'Occupational therapist working with child on fine motor skills' }
        }
      });
      
      console.log('Publishing entry...');
      await entry.publish();
      console.log('Entry published successfully!');
    }
    
    console.log('About page content set up completed successfully!');
  } catch (error) {
    console.error('Error setting up about page content:', error);
  }
}

// Run the function
addAboutContent()
  .then(() => console.log('Complete'))
  .catch(err => console.error('Failed:', err));