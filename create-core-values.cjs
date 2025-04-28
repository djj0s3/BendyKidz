const contentful = require('contentful-management');
require('dotenv').config();

// Initialize the Contentful client
const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
});

async function createCoreValues() {
  try {
    console.log('Starting to create core values...');
    
    // Get space and environment
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    // Core values to create
    const coreValues = [
      {
        id: 'excellence',
        title: "Excellence",
        description: "Providing the highest quality evidence-based resources and information.",
        icon: "fas fa-star",
        iconColor: "primary",
        displayOrder: 1
      },
      {
        id: 'compassion',
        title: "Compassion",
        description: "Understanding each child's unique journey and supporting families with empathy.",
        icon: "fas fa-heart",
        iconColor: "secondary",
        displayOrder: 2
      },
      {
        id: 'innovation',
        title: "Innovation",
        description: "Constantly evolving our approach to create effective, engaging interventions.",
        icon: "fas fa-lightbulb",
        iconColor: "accent",
        displayOrder: 3
      }
    ];
    
    console.log('Creating each core value...');
    for (const value of coreValues) {
      try {
        // Try to get the entry first
        try {
          const existingEntry = await environment.getEntry(`value-${value.id}`);
          console.log(`Value ${value.title} already exists with ID ${existingEntry.sys.id}, updating it...`);
          
          existingEntry.fields.title = { 'en-US': value.title };
          existingEntry.fields.description = { 'en-US': value.description };
          existingEntry.fields.icon = { 'en-US': value.icon };
          existingEntry.fields.iconColor = { 'en-US': value.iconColor };
          existingEntry.fields.displayOrder = { 'en-US': value.displayOrder };
          
          const updatedEntry = await existingEntry.update();
          await updatedEntry.publish();
          console.log(`Updated and published ${value.title}`);
        } catch (error) {
          // If it doesn't exist, create it
          console.log(`Creating new core value: ${value.title}`);
          const entry = await environment.createEntry('coreValue', {
            sys: { id: `value-${value.id}` },
            fields: {
              title: { 'en-US': value.title },
              description: { 'en-US': value.description },
              icon: { 'en-US': value.icon },
              iconColor: { 'en-US': value.iconColor },
              displayOrder: { 'en-US': value.displayOrder }
            }
          });
          
          console.log(`Publishing entry ${value.title}...`);
          await entry.publish();
          console.log(`Value ${value.title} created and published!`);
        }
      } catch (valueError) {
        console.error(`Error processing value ${value.title}:`, valueError);
      }
    }
    
    // Create team member for Emma
    try {
      console.log('Looking for Emma Wilson team member...');
      let emmaEntry;
      
      try {
        emmaEntry = await environment.getEntry('team-emma');
        console.log('Emma Wilson entry already exists, updating it...');
        
        emmaEntry.fields.name = { 'en-US': 'Emma Wilson' };
        emmaEntry.fields.role = { 'en-US': 'Founder & Lead Occupational Therapist' };
        emmaEntry.fields.bio = { 'en-US': "Emma has over 15 years of experience working with children with diverse needs and abilities. She founded BendyKidz to make occupational therapy resources more accessible to families everywhere.\n\nWith a Master's degree in Occupational Therapy and specialized certifications in Sensory Integration and Pediatric Development, Emma brings a wealth of knowledge and practical experience to help children thrive.\n\nHer approach combines evidence-based practices with a playful, family-centered philosophy that empowers parents to support their children's development at home.\n\nWhen not creating resources or working with clients, Emma enjoys hiking, gardening, and volunteering at local community centers." };
        emmaEntry.fields.avatar = { 
          'en-US': {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: 'emma-avatar'
            }
          } 
        };
        emmaEntry.fields.order = { 'en-US': 1 };
        
        const updatedEmma = await emmaEntry.update();
        await updatedEmma.publish();
        console.log('Emma Wilson entry updated and published!');
      } catch (error) {
        console.log('Creating new team member for Emma Wilson...');
        
        emmaEntry = await environment.createEntry('teamMember', {
          sys: { id: 'team-emma' },
          fields: {
            name: { 'en-US': 'Emma Wilson' },
            role: { 'en-US': 'Founder & Lead Occupational Therapist' },
            bio: { 'en-US': "Emma has over 15 years of experience working with children with diverse needs and abilities. She founded BendyKidz to make occupational therapy resources more accessible to families everywhere.\n\nWith a Master's degree in Occupational Therapy and specialized certifications in Sensory Integration and Pediatric Development, Emma brings a wealth of knowledge and practical experience to help children thrive.\n\nHer approach combines evidence-based practices with a playful, family-centered philosophy that empowers parents to support their children's development at home.\n\nWhen not creating resources or working with clients, Emma enjoys hiking, gardening, and volunteering at local community centers." },
            avatar: { 
              'en-US': {
                sys: {
                  type: 'Link',
                  linkType: 'Asset',
                  id: 'emma-avatar'
                }
              } 
            },
            order: { 'en-US': 1 }
          }
        });
        
        console.log('Publishing Emma Wilson entry...');
        await emmaEntry.publish();
        console.log('Emma Wilson entry created and published!');
      }
    } catch (teamError) {
      console.error('Error processing team member:', teamError);
    }
    
    console.log('Core values and team member creation completed!');
    
  } catch (error) {
    console.error('Error in core values creation:', error);
  }
}

// Run the function
createCoreValues()
  .then(() => console.log('Script completed successfully'))
  .catch(error => console.error('Script failed:', error));