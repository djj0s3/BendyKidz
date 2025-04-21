// Script to set up Contentful hero section content
const { createClient } = require('contentful-management');
require('dotenv').config();

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

// Initialize the client
const client = createClient({
  accessToken: managementToken
});

async function setupHeroSection() {
  try {
    console.log('Starting Contentful hero section setup...');
    
    if (!spaceId || !managementToken) {
      throw new Error('Missing required environment variables. Make sure CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN are set.');
    }
    
    // Get space and environment
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment('master');
    
    // Create hero section content type
    await createHeroSectionContentType(environment);
    
    // Create hero section sample content
    await createHeroSectionContent(environment);
    
    console.log('Contentful hero section setup completed successfully!');
  } catch (error) {
    console.error('Error setting up hero section in Contentful:', error.message);
    if (error.details) {
      console.error('Error details:', JSON.stringify(error.details, null, 2));
    }
  }
}

async function createHeroSectionContentType(environment) {
  try {
    console.log('Creating hero section content type...');
    
    // Check if content type already exists
    try {
      await environment.getContentType('heroSection');
      console.log('heroSection content type already exists, skipping creation');
      return;
    } catch (error) {
      if (error.name !== 'NotFound') {
        throw error;
      }
      console.log('Creating new heroSection content type');
    }
    
    // Create the content type
    const contentType = await environment.createContentTypeWithId('heroSection', {
      name: 'Hero Section',
      description: 'Content for the hero section on the home page',
      displayField: 'title',
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
          required: true
        },
        {
          id: 'image',
          name: 'Hero Image',
          type: 'Link',
          linkType: 'Asset',
          required: true
        },
        {
          id: 'imageAlt',
          name: 'Image Alt Text',
          type: 'Symbol',
          required: true
        },
        {
          id: 'primaryButtonText',
          name: 'Primary Button Text',
          type: 'Symbol',
          required: true
        },
        {
          id: 'primaryButtonLink',
          name: 'Primary Button Link',
          type: 'Symbol',
          required: true
        },
        {
          id: 'secondaryButtonText',
          name: 'Secondary Button Text',
          type: 'Symbol',
          required: true
        },
        {
          id: 'secondaryButtonLink',
          name: 'Secondary Button Link',
          type: 'Symbol',
          required: true
        }
      ]
    });
    
    // Publish the content type
    await contentType.publish();
    console.log('heroSection content type published successfully');
  } catch (error) {
    console.error('Error creating hero section content type:', error.message);
    throw error;
  }
}

async function createHeroSectionContent(environment) {
  try {
    console.log('Creating hero section sample content...');
    
    // Create hero image asset
    let heroImage;
    try {
      // Check if asset already exists
      heroImage = await environment.getAsset('hero-image');
      console.log('Hero image asset already exists, updating it...');
      
      heroImage.fields = {
        title: { 'en-US': 'Hero Section Image' },
        description: { 'en-US': 'Main image shown in the hero section' },
        file: {
          'en-US': {
            fileName: 'hero-image.jpg',
            contentType: 'image/jpeg',
            upload: 'https://images.unsplash.com/photo-1574436323527-85696ca0ac2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
          }
        }
      };
      
      heroImage = await heroImage.update();
    } catch (error) {
      if (error.name === 'NotFound') {
        // Create new asset
        heroImage = await environment.createAssetWithId('hero-image', {
          fields: {
            title: { 'en-US': 'Hero Section Image' },
            description: { 'en-US': 'Main image shown in the hero section' },
            file: {
              'en-US': {
                fileName: 'hero-image.jpg',
                contentType: 'image/jpeg',
                upload: 'https://images.unsplash.com/photo-1574436323527-85696ca0ac2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
              }
            }
          }
        });
      } else {
        throw error;
      }
    }
    
    // Process and publish the asset
    await heroImage.processForAllLocales();
    
    // Wait for asset to be processed
    console.log('Waiting for hero image to be processed...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await heroImage.publish();
    console.log('Hero image asset published successfully');
    
    // Create or update hero section entry
    await createOrUpdateEntry(environment, 'heroSection', 'home-hero', {
      title: 'Fun Occupational Therapy for Kids that Makes a Difference',
      subtitle: 'Expert resources to help your child develop skills, confidence, and independence through play-based therapy.',
      image: {
        sys: {
          type: 'Link',
          linkType: 'Asset',
          id: 'hero-image'
        }
      },
      imageAlt: 'Child engaging in therapy activities',
      primaryButtonText: 'Start Exploring',
      primaryButtonLink: '/articles',
      secondaryButtonText: 'Meet the Therapist',
      secondaryButtonLink: '/about'
    });
    
    console.log('Hero section content created successfully');
  } catch (error) {
    console.error('Error creating hero section content:', error.message);
    throw error;
  }
}

async function createOrUpdateEntry(environment, contentTypeId, entryId, fields) {
  try {
    let entry;
    try {
      // Check if entry already exists
      entry = await environment.getEntry(entryId);
      console.log(`Entry ${entryId} already exists, updating it...`);
      
      // Update fields
      Object.keys(fields).forEach(key => {
        entry.fields[key] = { 'en-US': fields[key] };
      });
      
      entry = await entry.update();
    } catch (error) {
      if (error.name === 'NotFound') {
        // Create new entry
        console.log(`Creating new ${contentTypeId} entry with ID ${entryId}`);
        
        // Format fields with locale
        const fieldWithLocale = {};
        Object.keys(fields).forEach(key => {
          fieldWithLocale[key] = { 'en-US': fields[key] };
        });
        
        entry = await environment.createEntryWithId(contentTypeId, entryId, {
          fields: fieldWithLocale
        });
      } else {
        throw error;
      }
    }
    
    // Publish the entry
    await entry.publish();
    console.log(`Entry ${entryId} published successfully`);
    return entry;
  } catch (error) {
    console.error(`Error creating/updating ${contentTypeId} entry:`, error.message);
    throw error;
  }
}

// Run the setup
setupHeroSection();