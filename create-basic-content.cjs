// Minimal script to create just some basic content in Contentful
require('dotenv').config();
const { createClient } = require('contentful-management');

// Get credentials from environment variables
const spaceId = process.env.CONTENTFUL_SPACE_ID;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

console.log('Starting basic Contentful content creation');
console.log(`Space ID: ${spaceId}`);
console.log(`Management Token available: ${managementToken ? 'Yes' : 'No'}`);

// Create client
const client = createClient({
  accessToken: managementToken
});

async function run() {
  try {
    // Get environment
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment('master');
    console.log('Connected to Contentful space and environment');
    
    // Create a basic category
    console.log('Creating a basic category entry...');
    const categoryFields = {
      name: { 'en-US': 'Fine Motor Skills' },
      slug: { 'en-US': 'fine-motor' },
      description: { 'en-US': 'Resources for developing precision, hand strength, and coordination in small movements.' }
    };
    
    try {
      const existingCategory = await environment.getEntry('category-fine-motor');
      console.log('Category already exists, updating it');
      
      existingCategory.fields = categoryFields;
      const updatedCategory = await existingCategory.update();
      await updatedCategory.publish();
      console.log('Category updated and published');
    } catch (error) {
      if (error.name === 'NotFound') {
        const newCategory = await environment.createEntryWithId('category', 'category-fine-motor', {
          fields: categoryFields
        });
        
        await newCategory.publish();
        console.log('Category created and published');
      } else {
        throw error;
      }
    }
    
    // Create a basic asset
    console.log('Creating a basic asset...');
    const assetData = {
      title: { 'en-US': 'Emma Wilson Avatar' },
      description: { 'en-US': 'Portrait of Emma Wilson, the lead occupational therapist' },
      file: {
        'en-US': {
          contentType: 'image/jpeg',
          fileName: 'emma-avatar.jpg',
          upload: 'https://randomuser.me/api/portraits/women/65.jpg'
        }
      }
    };
    
    try {
      // First check if asset exists
      try {
        const existingAsset = await environment.getAsset('emma-avatar');
        console.log('Asset already exists, using it');
      } catch (assetError) {
        if (assetError.name === 'NotFound') {
          // Create new asset
          console.log('Creating new asset...');
          const newAsset = await environment.createAssetWithId('emma-avatar', {
            fields: assetData
          });
          
          try {
            await newAsset.processForAllLocales();
            
            // Wait for processing
            console.log('Waiting for asset to process...');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Try to publish, but don't fail if it's already published
            try {
              await newAsset.publish();
              console.log('Asset created and published');
            } catch (publishError) {
              console.log('Could not publish asset, may already be published:', publishError.message);
            }
          } catch (processError) {
            console.log('Could not process asset:', processError.message);
          }
        } else {
          console.error('Error checking asset:', assetError.message);
        }
      }
    } catch (error) {
      console.error('Asset creation error:', error.message);
    }
    
    // Create basic author entry
    console.log('Creating a basic author entry...');
    const authorFields = {
      name: { 'en-US': 'Emma Wilson' },
      avatar: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: 'emma-avatar'
          }
        }
      }
    };
    
    try {
      try {
        const existingAuthor = await environment.getEntry('author-emma');
        console.log('Author already exists, updating it');
        
        existingAuthor.fields = authorFields;
        const updatedAuthor = await existingAuthor.update();
        try {
          await updatedAuthor.publish();
          console.log('Author updated and published');
        } catch (publishError) {
          console.log('Could not publish author, continuing anyway:', publishError.message);
        }
      } catch (authorError) {
        if (authorError.name === 'NotFound') {
          console.log('Creating new author entry...');
          const newAuthor = await environment.createEntryWithId('author', 'author-emma', {
            fields: authorFields
          });
          
          try {
            await newAuthor.publish();
            console.log('Author created and published');
          } catch (publishError) {
            console.log('Could not publish author, continuing anyway:', publishError.message);
          }
        } else {
          console.error('Error checking author:', authorError.message);
        }
      }
    } catch (error) {
      console.error('Author creation error:', error.message);
    }
    
    // Create basic article
    console.log('Creating a basic article entry...');
    const articleFields = {
      title: { 'en-US': 'Simple Exercises to Improve Pencil Grip' },
      slug: { 'en-US': 'improve-pencil-grip' },
      excerpt: { 'en-US': 'Learn effective exercises that help children develop the proper pencil grip for writing and drawing.' },
      content: { 'en-US': '<h2>Why Pencil Grip Matters</h2><p>A proper pencil grip is essential for comfortable, efficient writing and drawing. When children struggle with grip, they may experience hand fatigue, reduced writing speed, and poor handwriting quality.</p>' },
      featuredImage: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: 'emma-avatar' // Using existing asset temporarily
          }
        }
      },
      publishedDate: { 'en-US': '2023-03-15' },
      readingTime: { 'en-US': 4 },
      author: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: 'author-emma'
          }
        }
      },
      category: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: 'category-fine-motor'
          }
        }
      },
      tags: { 'en-US': ['fine motor', 'handwriting', 'school skills'] },
      featured: { 'en-US': true }
    };
    
    try {
      try {
        const existingArticle = await environment.getEntry('article-1');
        console.log('Article already exists, updating it');
        
        existingArticle.fields = articleFields;
        const updatedArticle = await existingArticle.update();
        try {
          await updatedArticle.publish();
          console.log('Article updated and published');
        } catch (publishError) {
          console.log('Could not publish article, continuing anyway:', publishError.message);
        }
      } catch (articleError) {
        if (articleError.name === 'NotFound') {
          console.log('Creating new article entry...');
          const newArticle = await environment.createEntryWithId('article', 'article-1', {
            fields: articleFields
          });
          
          try {
            await newArticle.publish();
            console.log('Article created and published');
          } catch (publishError) {
            console.log('Could not publish article, continuing anyway:', publishError.message);
          }
        } else {
          console.error('Error checking article:', articleError.message);
        }
      }
    } catch (error) {
      console.error('Article creation error:', error.message);
    }
    
    console.log('Basic content creation completed successfully!');
  } catch (error) {
    console.error('Error creating content:', error.message);
    if (error.details) {
      console.error('Error details:', JSON.stringify(error.details, null, 2));
    }
  }
}

// Run the script
run();