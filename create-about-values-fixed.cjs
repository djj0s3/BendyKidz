const contentful = require('contentful-management');
require('dotenv').config();

// Initialize the Contentful client
const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
});

async function createCoreValuesContentTypes() {
  try {
    console.log('Starting to set up core values content types...');
    
    // Get space and environment
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    // Create Core Value content type if it doesn't exist
    let coreValueContentType;
    try {
      coreValueContentType = await environment.getContentType('coreValue');
      console.log('Core value content type already exists');
    } catch (error) {
      console.log('Creating core value content type...');
      coreValueContentType = await environment.createContentType({
        name: 'Core Value',
        sys: { id: 'coreValue' },
        fields: [
          { id: 'title', name: 'Title', type: 'Symbol', required: true },
          { id: 'description', name: 'Description', type: 'Text', required: true },
          { id: 'icon', name: 'Icon Name', type: 'Symbol', required: false },
          { id: 'iconColor', name: 'Icon Color', type: 'Symbol', required: false },
          { id: 'displayOrder', name: 'Display Order', type: 'Integer', required: false }
        ]
      });
      
      console.log('Publishing core value content type...');
      await coreValueContentType.publish();
    }
    
    // Create Team Member content type if it doesn't exist
    let teamMemberContentType;
    try {
      teamMemberContentType = await environment.getContentType('teamMember');
      console.log('Team member content type already exists');
    } catch (error) {
      console.log('Creating team member content type...');
      teamMemberContentType = await environment.createContentType({
        name: 'Team Member',
        sys: { id: 'teamMember' },
        fields: [
          { id: 'name', name: 'Name', type: 'Symbol', required: true },
          { id: 'role', name: 'Role', type: 'Symbol', required: true },
          { id: 'bio', name: 'Biography', type: 'Text', required: true },
          { id: 'avatar', name: 'Avatar', type: 'Link', linkType: 'Asset', required: false },
          { id: 'order', name: 'Display Order', type: 'Integer', required: false }
        ]
      });
      
      console.log('Publishing team member content type...');
      await teamMemberContentType.publish();
    }
    
    // Create core values
    const coreValues = [
      {
        title: "Excellence",
        description: "Providing the highest quality evidence-based resources and information.",
        icon: "fas fa-star",
        iconColor: "primary",
        displayOrder: 1
      },
      {
        title: "Compassion",
        description: "Understanding each child's unique journey and supporting families with empathy.",
        icon: "fas fa-heart",
        iconColor: "secondary",
        displayOrder: 2
      },
      {
        title: "Innovation",
        description: "Constantly evolving our approach to create effective, engaging interventions.",
        icon: "fas fa-lightbulb",
        iconColor: "accent",
        displayOrder: 3
      }
    ];
    
    console.log('Creating core values...');
    for (const value of coreValues) {
      // Check if it already exists
      const entries = await environment.getEntries({
        content_type: 'coreValue',
        'fields.title': value.title
      });
      
      if (entries.items.length > 0) {
        console.log(`Core value "${value.title}" already exists, skipping...`);
        continue;
      }
      
      console.log(`Creating core value: ${value.title}`);
      const entry = await environment.createEntry('coreValue', {
        fields: {
          title: { 'en-US': value.title },
          description: { 'en-US': value.description },
          icon: { 'en-US': value.icon },
          iconColor: { 'en-US': value.iconColor },
          displayOrder: { 'en-US': value.displayOrder }
        }
      });
      
      console.log('Publishing entry...');
      await entry.publish();
    }
    
    // Create team member for Emma if it doesn't exist
    const teamEntries = await environment.getEntries({
      content_type: 'teamMember',
      'fields.name': 'Emma Wilson'
    });
    
    if (teamEntries.items.length === 0) {
      console.log('Creating team member: Emma Wilson');
      
      // Check if we have the Emma avatar asset
      const avatarAssetId = 'emma-avatar';
      
      const teamMemberEntry = await environment.createEntry('teamMember', {
        fields: {
          name: { 'en-US': 'Emma Wilson' },
          role: { 'en-US': 'Founder & Lead Occupational Therapist' },
          bio: { 'en-US': "Emma has over 15 years of experience working with children with diverse needs and abilities. She founded BendyKidz to make occupational therapy resources more accessible to families everywhere.\n\nWith a Master's degree in Occupational Therapy and specialized certifications in Sensory Integration and Pediatric Development, Emma brings a wealth of knowledge and practical experience to help children thrive.\n\nHer approach combines evidence-based practices with a playful, family-centered philosophy that empowers parents to support their children's development at home.\n\nWhen not creating resources or working with clients, Emma enjoys hiking, gardening, and volunteering at local community centers." },
          avatar: { 
            'en-US': {
              sys: {
                type: 'Link',
                linkType: 'Asset',
                id: avatarAssetId
              }
            } 
          },
          order: { 'en-US': 1 }
        }
      });
      
      console.log('Publishing team member entry...');
      await teamMemberEntry.publish();
    } else {
      console.log('Team member Emma Wilson already exists, skipping...');
    }
    
    console.log('Core values and team member setup completed successfully!');
    
  } catch (error) {
    console.error('Error in setup:', error);
  }
}

// Run the function
createCoreValuesContentTypes()
  .then(() => console.log('Script completed successfully'))
  .catch(error => console.error('Script failed:', error));