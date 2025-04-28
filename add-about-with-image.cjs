const contentful = require('contentful-management');
require('dotenv').config();

// Initialize the Contentful client
const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
});

async function addAboutWithImage() {
  try {
    console.log('Starting about page content creation with image...');
    
    // Get space and environment
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    // Create or reuse asset
    console.log('Setting up image asset...');
    
    // Check if asset already exists
    let asset;
    try {
      asset = await environment.getAsset('about-image');
      console.log('About image asset already exists, reusing it');
    } catch (error) {
      console.log('Creating new about image asset...');
      asset = await environment.createAsset({
        sys: {
          id: 'about-image'
        },
        fields: {
          title: {
            'en-US': 'Occupational Therapist Working with Child'
          },
          description: {
            'en-US': 'A therapist helping a child with fine motor skills activities'
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
      console.log('Processing the asset...');
      asset = await asset.processForAllLocales();
      console.log('Publishing the asset...');
      asset = await asset.publish();
      console.log('Asset published successfully!');
    }
    
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
            id: asset.sys.id
          }
        } 
      };
      entry.fields.imageAlt = { 'en-US': 'Occupational therapist working with child on fine motor skills' };
      
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
                id: asset.sys.id
              }
            } 
          },
          imageAlt: { 'en-US': 'Occupational therapist working with child on fine motor skills' }
        }
      });
      
      console.log('Publishing the entry...');
      await entry.publish();
      console.log('Entry created and published successfully!');
    }
    
    console.log('About page content creation with image completed!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
addAboutWithImage()
  .then(() => console.log('Script completed successfully'))
  .catch(error => console.error('Script failed:', error));