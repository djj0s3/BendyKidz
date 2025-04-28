const contentful = require('contentful-management');
require('dotenv').config();

// Initialize the Contentful Management Client
const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
});

async function setupAboutContent() {
  try {
    console.log('Starting about page content creation...');
    
    // Get space and environment
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    // Create the asset first
    console.log('Creating image asset...');
    const asset = await environment.createAsset({
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
    
    // Process and publish the asset
    console.log('Processing and publishing the asset...');
    const processedAsset = await asset.processForAllLocales();
    const publishedAsset = await processedAsset.publish();
    console.log('Asset published successfully with ID:', publishedAsset.sys.id);
    
    // Create or update the content type
    let aboutContentType;
    try {
      aboutContentType = await environment.getContentType('aboutPage');
      console.log('About page content type already exists');
    } catch (error) {
      console.log('Creating about page content type...');
      aboutContentType = await environment.createContentType({
        name: 'About Page',
        sys: {
          id: 'aboutPage'
        },
        fields: [
          {
            id: 'title',
            name: 'Title',
            type: 'Symbol',
            required: true
          },
          {
            id: 'subtitle',
            name: 'Subtitle',
            type: 'Symbol',
            required: false
          },
          {
            id: 'description',
            name: 'Description',
            type: 'Text',
            required: true
          },
          {
            id: 'mission',
            name: 'Mission Statement',
            type: 'Text',
            required: false
          },
          {
            id: 'image',
            name: 'Featured Image',
            type: 'Link',
            linkType: 'Asset',
            required: false
          },
          {
            id: 'imageAlt',
            name: 'Image Alt Text',
            type: 'Symbol',
            required: false
          }
        ]
      });
      await aboutContentType.publish();
      console.log('Content type published successfully');
    }
    
    // Create the about page entry
    console.log('Creating about page entry...');
    const aboutEntry = await environment.createEntry('aboutPage', {
      fields: {
        title: {
          'en-US': 'About BendyKidz Occupational Therapy'
        },
        subtitle: {
          'en-US': 'Empowering children through play-based therapy and parent education'
        },
        description: {
          'en-US': `<p>BendyKidz Occupational Therapy was founded by Emma Wilson, a pediatric occupational therapist with over 15 years of experience working with children of all abilities.</p>
          <p>After years of clinical practice, Emma recognized that families needed more accessible resources to continue supporting their children's development at home. This website was created to bridge that gap – providing evidence-based information and practical strategies in an easy-to-implement format.</p>
          <p>At BendyKidz, we believe that therapy doesn't only happen in a clinical setting but continues at home through play and daily activities. Our mission is to empower parents with the knowledge and tools to support their children's development.</p>`
        },
        mission: {
          'en-US': `<p>Our mission is to make a meaningful difference in children's lives through evidence-based practices, play-based learning, and family-centered care. We believe in making therapeutic strategies accessible to all families, regardless of their location or resources.</p>`
        },
        image: {
          'en-US': {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: publishedAsset.sys.id
            }
          }
        },
        imageAlt: {
          'en-US': 'Occupational therapist working with child on fine motor skills'
        }
      }
    });
    
    // Publish the entry
    await aboutEntry.publish();
    console.log('About page entry published successfully');
    
    console.log('Setup completed successfully');
  } catch (error) {
    console.error('Error setting up about content:', error);
  }
}

// Run the setup
setupAboutContent();