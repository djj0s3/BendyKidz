require('dotenv').config();
const contentful = require('contentful-management');

// Initialize the Contentful client
const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
});

async function createAboutPageContent() {
  console.log('Starting about page content creation...');
  try {
    // Get space and environment
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    console.log('Creating content type...');
    
    // Check if content type exists
    let contentType;
    try {
      contentType = await environment.getContentType('aboutPage');
      console.log('Content type already exists');
    } catch (error) {
      console.log('Creating content type...');
      contentType = await environment.createContentType({
        name: 'About Page',
        sys: { id: 'aboutPage' },
        fields: [
          { id: 'title', name: 'Title', type: 'Symbol', required: true },
          { id: 'subtitle', name: 'Subtitle', type: 'Symbol', required: false },
          { id: 'description', name: 'Description', type: 'Text', required: true },
          { id: 'mission', name: 'Mission Statement', type: 'Text', required: false },
          { id: 'image', name: 'Featured Image', type: 'Link', linkType: 'Asset', required: false },
          { id: 'imageAlt', name: 'Image Alt Text', type: 'Symbol', required: false }
        ]
      });
      await contentType.publish();
      console.log('Content type published');
    }
    
    // Create and upload the image asset
    console.log('Creating image asset...');
    
    // Check if asset already exists
    let asset;
    try {
      asset = await environment.getAsset('about-image');
      console.log('Asset already exists');
    } catch (error) {
      console.log('Creating new asset...');
      asset = await environment.createAsset({
        sys: {
          id: 'about-image'
        },
        fields: {
          title: {
            'en-US': 'Occupational Therapist Working with Child'
          },
          description: {
            'en-US': 'A therapist helping a child with fine motor skills'
          },
          file: {
            'en-US': {
              contentType: 'image/jpeg',
              fileName: 'therapist-child.jpg',
              upload: 'https://images.unsplash.com/photo-1516627145497-ae6968895b24?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            }
          }
        }
      });
    
      // Process and publish asset
      try {
        asset = await asset.processForAllLocales();
        asset = await asset.publish();
        console.log('Asset published successfully!');
      } catch (error) {
        console.log('Error processing or publishing asset:', error);
      }
    }
    
    console.log('Creating about page entry...');
    
    // Create entry
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
              id: asset.sys.id
            }
          }
        },
        imageAlt: { 'en-US': 'Occupational therapist working with child on fine motor skills' }
      }
    });
    
    // Publish the entry
    await entry.publish();
    console.log('About page entry published successfully!');
    
  } catch (error) {
    console.error('Error creating about page content:', error);
  }
}

// Run the function
createAboutPageContent()
  .then(() => console.log('Complete!'))
  .catch(err => console.error('Failed:', err));