const contentful = require('contentful-management');
require('dotenv').config();

// Initialize the Contentful Management Client
const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
});

async function createAboutContent() {
  try {
    console.log('Starting about page content creation...');
    
    // Get space and environment
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    console.log('Checking if about page content already exists...');
    
    try {
      const entries = await environment.getEntries({
        content_type: 'aboutPage',
        limit: 1
      });
      
      if (entries.items.length > 0) {
        console.log('About page content already exists. Updating it...');
        const entry = entries.items[0];
        
        entry.fields.title = {
          'en-US': 'About BendyKidz Occupational Therapy'
        };
        
        entry.fields.subtitle = {
          'en-US': 'Empowering children through play-based therapy and parent education'
        };
        
        entry.fields.description = {
          'en-US': `<p>BendyKidz Occupational Therapy was founded by Emma Wilson, a pediatric occupational therapist with over 15 years of experience working with children of all abilities.</p>
          <p>After years of clinical practice, Emma recognized that families needed more accessible resources to continue supporting their children's development at home. This website was created to bridge that gap – providing evidence-based information and practical strategies in an easy-to-implement format.</p>
          <p>At BendyKidz, we believe that therapy doesn't only happen in a clinical setting but continues at home through play and daily activities. Our mission is to empower parents with the knowledge and tools to support their children's development.</p>`
        };
        
        entry.fields.mission = {
          'en-US': "<p>Our mission is to make a meaningful difference in children's lives through evidence-based practices, play-based learning, and family-centered care. We believe in making therapeutic strategies accessible to all families, regardless of their location or resources.</p>"
        };
        
        // Update image reference if present
        if (entry.fields.image && entry.fields.image['en-US']) {
          console.log('Image reference already exists. Keeping it as is.');
        } else {
          console.log('Creating a new image asset...');
          
          // Create a new image asset
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
          const processedAsset = await asset.processForAllLocales();
          const publishedAsset = await processedAsset.publish();
          
          // Reference the asset in the entry
          entry.fields.image = {
            'en-US': {
              sys: {
                type: 'Link',
                linkType: 'Asset',
                id: publishedAsset.sys.id
              }
            }
          };
          
          entry.fields.imageAlt = {
            'en-US': 'Occupational therapist working with child on fine motor skills'
          };
        }
        
        // Update and publish the entry
        const updatedEntry = await entry.update();
        await updatedEntry.publish();
        
        console.log('About page content updated successfully!');
      } else {
        console.log('About page content does not exist. Creating new entry...');
        
        // Create a new image asset
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
        const processedAsset = await asset.processForAllLocales();
        const publishedAsset = await processedAsset.publish();
        
        // Create the about page entry
        const entry = await environment.createEntry('aboutPage', {
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
              'en-US': "<p>Our mission is to make a meaningful difference in children's lives through evidence-based practices, play-based learning, and family-centered care. We believe in making therapeutic strategies accessible to all families, regardless of their location or resources.</p>"
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
        await entry.publish();
        
        console.log('About page content created successfully!');
      }
    } catch (error) {
      console.error('Error accessing entries:', error);
      
      // If the error is that the content type doesn't exist, create it
      if (error.name === 'NotFound' || error.message.includes('Unknown content type')) {
        console.log('Content type aboutPage does not exist. Creating it first...');
        
        // Create the content type
        const contentType = await environment.createContentType({
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
        
        // Publish the content type
        await contentType.publish();
        console.log('Content type aboutPage created successfully!');
        
        // Now try again to create the content
        await createAboutContent();
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error creating about page content:', error);
  }
}

// Execute the function
createAboutContent()
  .then(() => console.log('Script completed'))
  .catch(error => console.error('Script failed:', error));