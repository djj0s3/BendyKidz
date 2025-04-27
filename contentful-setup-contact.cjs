const contentful = require('contentful-management');
require('dotenv').config();

async function setupContactContent() {
  try {
    // Initialize the Contentful Management client
    const client = contentful.createClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
    });

    console.log('Connecting to Contentful space...');
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
    
    console.log('Getting environment...');
    const environment = await space.getEnvironment('master');

    // Create the Contact Info content type
    console.log('Creating Contact Info content type...');
    
    // Since updating a published content type can cause issues, attempt to delete it first
    try {
      console.log('Checking if contactInfo content type already exists...');
      const existingContentType = await environment.getContentType('contactInfo');
      console.log('Content type contactInfo exists, attempting to unpublish and delete...');
      
      try {
        // Unpublish first
        await existingContentType.unpublish();
        console.log('Content type unpublished...');
      } catch (unpublishErr) {
        console.log('Error unpublishing content type, may not be published yet:', unpublishErr.message);
      }
      
      // Now try to delete it
      try {
        await existingContentType.delete();
        console.log('Content type deleted successfully');
      } catch (deleteErr) {
        console.log('Error deleting content type:', deleteErr.message);
        // We'll still try to create the new one
      }
    } catch (error) {
      if (error.name === 'NotFound') {
        console.log('Content type contactInfo not found, will create new');
      } else {
        console.log('Error checking for content type:', error.message);
        // Continue and try to create the content type anyway
      }
    }
    
    // Create the content type
    console.log('Creating new contactInfo content type...');
    try {
      const contentTypeData = {
        name: 'Contact Info',
        displayField: 'title',
        fields: createContactInfoFields(),
        sys: {
          id: 'contactInfo'
        }
      };
      
      const contentType = await environment.createContentTypeWithId('contactInfo', contentTypeData);
      await contentType.publish();
      console.log('Created and published contactInfo content type');
    } catch (error) {
      console.log('Error creating content type:', error);
      throw error;
    }

    // Create or update the contact info entry
    console.log('Creating/updating contact info entry...');
    
    const contactData = {
      fields: {
        title: {
          'en-US': 'Contact Us'
        },
        subtitle: {
          'en-US': 'Have questions about occupational therapy for your child? We\'re here to help.'
        },
        officeLocation: {
          'en-US': '123 Therapy Lane\nWellness City, WC 12345'
        },
        phoneNumber: {
          'en-US': '(555) 123-4567'
        },
        email: {
          'en-US': 'info@bendykidz.com'
        },
        officeHours: {
          'en-US': 'Monday - Friday: 9:00 AM - 5:00 PM\nSaturday: 10:00 AM - 2:00 PM'
        },
        messageFormTitle: {
          'en-US': 'Send Us a Message'
        },
        socialLinks: {
          'en-US': [
            {
              "social": "Facebook|https://facebook.com/bendykidz"
            },
            {
              "social": "Twitter|https://twitter.com/bendykidz"
            },
            {
              "social": "Instagram|https://instagram.com/bendykidz"
            },
            {
              "social": "Pinterest|https://pinterest.com/bendykidz"
            }
          ]
        },
        mapTitle: {
          'en-US': 'Find Us'
        },
        mapEmbedUrl: {
          'en-US': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.3059353029!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2suk!4v1619471123295!5m2!1sen!2suk'
        }
      }
    };

    // Try to update if exists, otherwise create new
    try {
      const entry = await environment.getEntry('contact-info');
      console.log('Contact info entry exists, updating...');
      
      entry.fields = contactData.fields;
      const updatedEntry = await entry.update();
      await updatedEntry.publish();
      
      console.log('Updated contact info entry');
    } catch (error) {
      if (error.name === 'NotFound') {
        console.log('Contact info entry not found, creating new...');
        
        const newEntry = await environment.createEntryWithId('contactInfo', 'contact-info', contactData);
        await newEntry.publish();
        
        console.log('Created new contact info entry');
      } else {
        throw error;
      }
    }

    console.log('Contact content setup complete!');
  } catch (error) {
    console.error('Error setting up contact content:', error);
  }
}

function createContactInfoFields() {
  return [
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
      id: 'officeLocation',
      name: 'Office Location',
      type: 'Text',
      required: false
    },
    {
      id: 'phoneNumber',
      name: 'Phone Number',
      type: 'Symbol',
      required: false
    },
    {
      id: 'email',
      name: 'Email Address',
      type: 'Symbol',
      required: false
    },
    {
      id: 'officeHours',
      name: 'Office Hours',
      type: 'Text',
      required: false
    },
    {
      id: 'messageFormTitle',
      name: 'Message Form Title',
      type: 'Symbol',
      required: false
    },
    {
      id: 'socialFacebook',
      name: 'Facebook URL',
      type: 'Symbol',
      required: false
    },
    {
      id: 'socialTwitter',
      name: 'Twitter URL',
      type: 'Symbol',
      required: false
    },
    {
      id: 'socialInstagram',
      name: 'Instagram URL',
      type: 'Symbol',
      required: false
    },
    {
      id: 'socialPinterest',
      name: 'Pinterest URL',
      type: 'Symbol',
      required: false
    },
    {
      id: 'mapTitle',
      name: 'Map Title',
      type: 'Symbol',
      required: false
    },
    {
      id: 'mapEmbedUrl',
      name: 'Map Embed URL',
      type: 'Text',
      required: false
    }
  ];
}

// Run the setup
setupContactContent()
  .then(() => {
    console.log('Successfully set up Contact content in Contentful');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error during Contact content setup:', error);
    process.exit(1);
  });