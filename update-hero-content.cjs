// Script to update the Contentful hero section content
const { createClient } = require('contentful-management');
require('dotenv').config();

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

// Initialize the client
const client = createClient({
  accessToken: managementToken
});

async function updateHeroSectionContent() {
  try {
    console.log('Starting Contentful hero section content update...');
    
    if (!spaceId || !managementToken) {
      throw new Error('Missing required environment variables. Make sure CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN are set.');
    }
    
    // Get space and environment
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment('master');
    
    // Update the hero section entry
    try {
      // Try to get the hero section entry
      const entry = await environment.getEntry('home-hero');
      console.log('Found home-hero entry, updating it...');
      
      // Update button color fields
      if (!entry.fields.primaryButtonColor) {
        entry.fields.primaryButtonColor = { 'en-US': '#7C3AED' }; // Purple accent color
      }
      
      if (!entry.fields.primaryButtonTextColor) {
        entry.fields.primaryButtonTextColor = { 'en-US': '#FFFFFF' }; // White text
      }
      
      if (!entry.fields.secondaryButtonColor) {
        entry.fields.secondaryButtonColor = { 'en-US': '#FFFFFF' }; // White background
      }
      
      if (!entry.fields.secondaryButtonTextColor) {
        entry.fields.secondaryButtonTextColor = { 'en-US': '#7C3AED' }; // Purple text
      }
      
      // Update and publish the entry
      const updatedEntry = await entry.update();
      await updatedEntry.publish();
      console.log('Hero section entry updated successfully with button colors');
      
    } catch (error) {
      if (error.name === 'NotFound') {
        console.log('Hero section entry not found, creating it...');
        
        // Create the hero section entry
        const entry = await environment.createEntryWithId('heroSection', 'home-hero', {
          fields: {
            title: { 'en-US': 'Fun Occupational Therapy for Kids that Makes a Difference' },
            subtitle: { 'en-US': 'Expert resources to help your child develop skills, confidence, and independence through play-based therapy.' },
            image: { 
              'en-US': {
                sys: {
                  type: 'Link',
                  linkType: 'Asset',
                  id: 'hero-image'
                }
              }
            },
            imageAlt: { 'en-US': 'Child engaging in therapy activities' },
            primaryButtonText: { 'en-US': 'Start Exploring' },
            primaryButtonLink: { 'en-US': '/articles' },
            primaryButtonColor: { 'en-US': '#7C3AED' }, // Purple accent color
            primaryButtonTextColor: { 'en-US': '#FFFFFF' }, // White text
            secondaryButtonText: { 'en-US': 'Meet the Therapist' },
            secondaryButtonLink: { 'en-US': '/about' },
            secondaryButtonColor: { 'en-US': '#FFFFFF' }, // White background
            secondaryButtonTextColor: { 'en-US': '#7C3AED' } // Purple text
          }
        });
        
        await entry.publish();
        console.log('Hero section entry created and published successfully');
      } else {
        console.error('Error updating hero section entry:', error.message);
        throw error;
      }
    }
    
    console.log('Content update completed successfully!');
  } catch (error) {
    console.error('Error in update process:', error.message);
    if (error.details) {
      console.error('Error details:', JSON.stringify(error.details, null, 2));
    }
  }
}

// Run the update
updateHeroSectionContent();