// Explicit CommonJS file for Contentful setup
require('dotenv').config();
const { createClient } = require('contentful-management');

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

if (!spaceId || !managementToken) {
  console.error('Error: Missing required environment variables');
  console.error('Required: CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN');
  process.exit(1);
}

console.log('Starting Contentful setup');
console.log(`Space ID: ${spaceId}`);
console.log('Management Token available:', !!managementToken);

// Create Contentful client
const client = createClient({
  accessToken: managementToken
});

async function run() {
  try {
    // Get environment
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment('master');
    console.log('Connected to Contentful space and environment');
    
    // Create content types
    await createContentTypes(environment);
    
    // Wait for content types to be processed
    console.log('Waiting for content types to be processed...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Create assets and content
    await createContent(environment);
    
    console.log('Contentful setup completed successfully!');
  } catch (error) {
    console.error('Error setting up Contentful:', error.message);
  }
}

async function createContentTypes(environment) {
  console.log('Creating content types...');
  
  const contentTypes = [
    {
      id: 'category',
      name: 'Category',
      description: 'Categories for BendyKidz articles',
      displayField: 'name',
      fields: [
        {
          id: 'name',
          name: 'Name',
          type: 'Symbol',
          required: true
        },
        {
          id: 'slug',
          name: 'Slug',
          type: 'Symbol',
          required: true,
          validations: [{ unique: true }]
        },
        {
          id: 'description',
          name: 'Description',
          type: 'Text',
          required: true
        }
      ]
    },
    {
      id: 'author',
      name: 'Author',
      description: 'Author for BendyKidz articles',
      displayField: 'name',
      fields: [
        {
          id: 'name',
          name: 'Name',
          type: 'Symbol',
          required: true
        },
        {
          id: 'avatar',
          name: 'Avatar',
          type: 'Link',
          linkType: 'Asset',
          required: true
        }
      ]
    },
    {
      id: 'article',
      name: 'Article',
      description: 'Articles for BendyKidz',
      displayField: 'title',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          required: true
        },
        {
          id: 'slug',
          name: 'Slug',
          type: 'Symbol',
          required: true,
          validations: [{ unique: true }]
        },
        {
          id: 'excerpt',
          name: 'Excerpt',
          type: 'Text',
          required: true
        },
        {
          id: 'content',
          name: 'Content',
          type: 'Text',
          required: true
        },
        {
          id: 'featuredImage',
          name: 'Featured Image',
          type: 'Link',
          linkType: 'Asset',
          required: true
        },
        {
          id: 'publishedDate',
          name: 'Published Date',
          type: 'Date',
          required: true
        },
        {
          id: 'readingTime',
          name: 'Reading Time (minutes)',
          type: 'Integer',
          required: true
        },
        {
          id: 'author',
          name: 'Author',
          type: 'Link',
          linkType: 'Entry',
          validations: [{ linkContentType: ['author'] }],
          required: true
        },
        {
          id: 'category',
          name: 'Category',
          type: 'Link',
          linkType: 'Entry',
          validations: [{ linkContentType: ['category'] }],
          required: true
        },
        {
          id: 'tags',
          name: 'Tags',
          type: 'Array',
          items: {
            type: 'Symbol'
          }
        },
        {
          id: 'featured',
          name: 'Featured',
          type: 'Boolean'
        }
      ]
    },
    {
      id: 'testimonial',
      name: 'Testimonial',
      description: 'Client testimonials for BendyKidz',
      displayField: 'name',
      fields: [
        {
          id: 'name',
          name: 'Name',
          type: 'Symbol',
          required: true
        },
        {
          id: 'role',
          name: 'Role',
          type: 'Symbol',
          required: true
        },
        {
          id: 'quote',
          name: 'Quote',
          type: 'Text',
          required: true
        },
        {
          id: 'avatar',
          name: 'Avatar',
          type: 'Link',
          linkType: 'Asset',
          required: true
        }
      ]
    },
    {
      id: 'aboutPage',
      name: 'About Page',
      description: 'About page content for BendyKidz',
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
          id: 'description',
          name: 'Description',
          type: 'Text',
          required: true
        },
        {
          id: 'mission',
          name: 'Mission',
          type: 'Text',
          required: true
        },
        {
          id: 'image',
          name: 'Image',
          type: 'Link',
          linkType: 'Asset',
          required: true
        },
        {
          id: 'imageAlt',
          name: 'Image Alt Text',
          type: 'Symbol',
          required: true
        }
      ]
    },
    {
      id: 'teamMember',
      name: 'Team Member',
      description: 'Team member for BendyKidz',
      displayField: 'name',
      fields: [
        {
          id: 'name',
          name: 'Name',
          type: 'Symbol',
          required: true
        },
        {
          id: 'role',
          name: 'Role',
          type: 'Symbol',
          required: true
        },
        {
          id: 'bio',
          name: 'Bio',
          type: 'Text',
          required: true
        },
        {
          id: 'avatar',
          name: 'Avatar',
          type: 'Link',
          linkType: 'Asset',
          required: true
        },
        {
          id: 'order',
          name: 'Display Order',
          type: 'Integer',
          required: true
        }
      ]
    },
    {
      id: 'siteStats',
      name: 'Site Stats',
      description: 'Statistics for BendyKidz homepage',
      displayField: 'title',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          required: true
        },
        {
          id: 'resources',
          name: 'Resources Count',
          type: 'Integer',
          required: true
        },
        {
          id: 'specialists',
          name: 'Specialists Count',
          type: 'Integer',
          required: true
        },
        {
          id: 'activityTypes',
          name: 'Activity Types Count',
          type: 'Integer',
          required: true
        }
      ]
    }
  ];
  
  for (const contentType of contentTypes) {
    try {
      console.log(`Creating content type: ${contentType.id}`);
      
      try {
        // Check if content type exists
        const existingContentType = await environment.getContentType(contentType.id);
        console.log(`Content type ${contentType.id} already exists, updating it`);
        
        // Update content type
        existingContentType.name = contentType.name;
        existingContentType.description = contentType.description;
        existingContentType.displayField = contentType.displayField;
        existingContentType.fields = contentType.fields;
        
        // Save and publish
        const updatedContentType = await existingContentType.update();
        await updatedContentType.publish();
        console.log(`Content type ${contentType.id} updated and published`);
      } catch (error) {
        if (error.name === 'NotFound') {
          // Create new content type if it doesn't exist
          const newContentType = await environment.createContentTypeWithId(contentType.id, {
            name: contentType.name,
            description: contentType.description,
            displayField: contentType.displayField,
            fields: contentType.fields
          });
          
          await newContentType.publish();
          console.log(`Content type ${contentType.id} created and published`);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error(`Error processing content type ${contentType.id}:`, error.message);
    }
  }
}

async function createContent(environment) {
  console.log('Creating content...');
  
  // Create assets
  const assets = {
    'emma-avatar': {
      title: 'Emma Wilson Avatar',
      description: 'Portrait of Emma Wilson, the lead occupational therapist',
      file: {
        fileName: 'emma-avatar.jpg',
        contentType: 'image/jpeg',
        upload: 'https://randomuser.me/api/portraits/women/65.jpg'
      }
    },
    'testimonial1-avatar': {
      title: 'Sarah Johnson Avatar',
      description: 'Portrait of Sarah Johnson, parent testimonial',
      file: {
        fileName: 'testimonial1-avatar.jpg',
        contentType: 'image/jpeg',
        upload: 'https://randomuser.me/api/portraits/women/32.jpg'
      }
    },
    'testimonial2-avatar': {
      title: 'Michael Chen Avatar',
      description: 'Portrait of Michael Chen, parent testimonial',
      file: {
        fileName: 'testimonial2-avatar.jpg',
        contentType: 'image/jpeg',
        upload: 'https://randomuser.me/api/portraits/men/25.jpg'
      }
    },
    'testimonial3-avatar': {
      title: 'Jessica Rivera Avatar',
      description: 'Portrait of Jessica Rivera, educator testimonial',
      file: {
        fileName: 'testimonial3-avatar.jpg',
        contentType: 'image/jpeg',
        upload: 'https://randomuser.me/api/portraits/women/47.jpg'
      }
    },
    'article1-image': {
      title: 'Pencil Grip Exercise Image',
      description: 'Image showing exercises for pencil grip',
      file: {
        fileName: 'article1-image.jpg',
        contentType: 'image/jpeg',
        upload: 'https://images.unsplash.com/photo-1524503033411-c9566986fc8f'
      }
    },
    'article2-image': {
      title: 'Sensory Play Image',
      description: 'Image of sensory play materials',
      file: {
        fileName: 'article2-image.jpg',
        contentType: 'image/jpeg',
        upload: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c'
      }
    },
    'article3-image': {
      title: 'Outdoor Activities Image',
      description: 'Image of children playing outdoors',
      file: {
        fileName: 'article3-image.jpg',
        contentType: 'image/jpeg',
        upload: 'https://images.unsplash.com/photo-1564429097439-923d2f1e4ac1'
      }
    },
    'about-image': {
      title: 'About Page Image',
      description: 'Image for the About page',
      file: {
        fileName: 'about-image.jpg',
        contentType: 'image/jpeg',
        upload: 'https://images.unsplash.com/photo-1516627145497-ae6968895b24'
      }
    }
  };
  
  for (const [assetId, assetData] of Object.entries(assets)) {
    try {
      console.log(`Creating asset: ${assetId}`);
      
      try {
        // Check if asset exists
        const existingAsset = await environment.getAsset(assetId);
        console.log(`Asset ${assetId} already exists, updating it`);
        
        // Update asset
        existingAsset.fields = {
          title: { 'en-US': assetData.title },
          description: { 'en-US': assetData.description },
          file: { 'en-US': assetData.file }
        };
        
        const updatedAsset = await existingAsset.update();
        await updatedAsset.processForAllLocales();
        
        // Wait for processing
        console.log(`Waiting for asset ${assetId} to process...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Publish
        await updatedAsset.publish();
        console.log(`Asset ${assetId} updated and published`);
      } catch (error) {
        if (error.name === 'NotFound') {
          // Create new asset
          const newAsset = await environment.createAssetWithId(assetId, {
            fields: {
              title: { 'en-US': assetData.title },
              description: { 'en-US': assetData.description },
              file: { 'en-US': assetData.file }
            }
          });
          
          await newAsset.processForAllLocales();
          
          // Wait for processing
          console.log(`Waiting for asset ${assetId} to process...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Publish
          await newAsset.publish();
          console.log(`Asset ${assetId} created and published`);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error(`Error processing asset ${assetId}:`, error.message);
    }
  }
  
  // Create entries
  
  // 1. Create author entry
  console.log('Creating author entry...');
  await createOrUpdateEntry(environment, 'author', 'author-emma', {
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
  });
  
  // 2. Create categories
  console.log('Creating categories...');
  const categories = {
    'fine-motor': {
      name: 'Fine Motor Skills',
      slug: 'fine-motor',
      description: 'Resources for developing precision, hand strength, and coordination in small movements.'
    },
    'gross-motor': {
      name: 'Gross Motor Skills',
      slug: 'gross-motor',
      description: 'Activities to improve coordination, strength, and control of large muscle groups.'
    },
    'sensory': {
      name: 'Sensory Processing',
      slug: 'sensory',
      description: 'Tools and strategies for children with sensory processing challenges.'
    }
  };
  
  for (const [categoryId, categoryData] of Object.entries(categories)) {
    await createOrUpdateEntry(environment, 'category', `category-${categoryId}`, {
      name: { 'en-US': categoryData.name },
      slug: { 'en-US': categoryData.slug },
      description: { 'en-US': categoryData.description }
    });
  }
  
  // 3. Create articles
  console.log('Creating articles...');
  
  const articles = [
    {
      id: 'article-1',
      fields: {
        title: { 'en-US': 'Simple Exercises to Improve Pencil Grip' },
        slug: { 'en-US': 'improve-pencil-grip' },
        excerpt: { 'en-US': 'Learn effective exercises that help children develop the proper pencil grip for writing and drawing.' },
        content: { 'en-US': '<h2>Why Pencil Grip Matters</h2><p>A proper pencil grip is essential for comfortable, efficient writing and drawing. When children struggle with grip, they may experience hand fatigue, reduced writing speed, and poor handwriting quality.</p><h2>Signs Your Child Might Need Help</h2><ul><li>Complains of hand pain when writing</li><li>Switches hands frequently during writing tasks</li><li>Presses too hard or too lightly on the paper</li><li>Awkward or inefficient pencil grasp</li></ul><h2>Exercises to Try at Home</h2><h3>1. The Pinch and Lift</h3><p>Place small objects (buttons, coins, small erasers) on a table. Have your child pinch each object using their thumb, index, and middle fingers (the same fingers used for a tripod grasp), and place them into a container.</p><h3>2. Vertical Surface Work</h3><p>Attach paper to a wall or easel at eye level. Drawing or writing on vertical surfaces naturally encourages a proper wrist position and grip.</p><h3>3. Rubber Band Trick</h3><p>Place a small rubber band around the wrist, then loop it around the thumb and index finger. This creates sensory feedback and a reminder of where fingers should be positioned.</p><h3>4. Short Pencils</h3><p>Using shorter pencils (golf pencils or broken crayons) naturally encourages children to use a tripod grasp, as there simply isn\'t enough room for extra fingers.</p><h2>When to Seek Help</h2><p>If your child continues to struggle despite trying these techniques, consider consulting with an occupational therapist who can provide personalized assessment and intervention.</p>' },
        featuredImage: {
          'en-US': {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: 'article1-image'
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
      }
    },
    {
      id: 'article-2',
      fields: {
        title: { 'en-US': 'Creating a Sensory-Friendly Home Environment' },
        slug: { 'en-US': 'sensory-friendly-home' },
        excerpt: { 'en-US': 'Practical tips for adapting your home to support children with sensory processing differences.' },
        content: { 'en-US': '<h2>Understanding Sensory Needs</h2><p>Children with sensory processing differences experience the world differently. Some seek extra sensory input, while others find certain sensations overwhelming. Creating a sensory-friendly home involves finding the right balance for your child.</p><h2>Visual Environment</h2><ul><li><strong>Reduce Visual Clutter</strong>: Organize toys in covered bins, use neutral colors for walls, and create designated spaces for activities.</li><li><strong>Lighting</strong>: Consider dimmable lights or lamps instead of bright overhead lighting. Some children are sensitive to fluorescent lights that others don\'t notice flickering.</li><li><strong>Visual Schedules</strong>: Use pictures or symbols to create predictable routines, reducing anxiety about what comes next.</li></ul><h2>Sound Management</h2><ul><li><strong>Identify Triggers</strong>: Be aware of sounds that may disturb your child - appliances, traffic noise, or even certain pitches of voice.</li><li><strong>Noise Reduction</strong>: Use rugs, curtains, and soft furnishings to absorb sound. Consider white noise machines for constant background sound that masks unpredictable noises.</li><li><strong>Headphones</strong>: Noise-cancelling headphones can be helpful during particularly overwhelming situations.</li></ul><h2>Touch and Movement</h2><ul><li><strong>Cozy Corner</strong>: Create a retreat space with soft blankets, cushions, and perhaps a small tent where your child can go when feeling overwhelmed.</li><li><strong>Weighted Items</strong>: Weighted blankets, lap pads, or stuffed animals can provide calming deep pressure.</li><li><strong>Movement Opportunities</strong>: Include spaces for safe jumping, spinning, or swinging if your child seeks movement input.</li></ul><h2>Adapting Your Home Room by Room</h2><h3>Bedroom</h3><p>Consider the texture of bedding, reduce echo with soft furnishings, and organize the space to be calming and predictable.</p><h3>Bathroom</h3><p>Adjust water pressure, provide step-by-step visual guides for routines, and consider sensory aspects of toiletries (scents, textures).</p><h3>Kitchen</h3><p>Be mindful of strong odors, provide seating that supports good posture, and reduce background noise during mealtimes.</p><h2>Remember</h2><p>Every child is unique, and their sensory preferences may change over time. Observe, ask, and adjust your environment accordingly. Small changes can make a big difference in your child\'s comfort and ability to thrive at home.</p>' },
        featuredImage: {
          'en-US': {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: 'article2-image'
            }
          }
        },
        publishedDate: { 'en-US': '2023-04-22' },
        readingTime: { 'en-US': 7 },
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
              id: 'category-sensory'
            }
          }
        },
        tags: { 'en-US': ['sensory processing', 'home environment', 'adaptations'] },
        featured: { 'en-US': true }
      }
    },
    {
      id: 'article-3',
      fields: {
        title: { 'en-US': 'Natural Outdoor Activities for Sensory Development' },
        slug: { 'en-US': 'outdoor-sensory-activities' },
        excerpt: { 'en-US': 'How nature provides the perfect sensory-rich environment for children\'s development and regulation.' },
        content: { 'en-US': '<h2>Nature as a Sensory Classroom</h2><p>The outdoors offers unmatched opportunities for sensory exploration. Unlike carefully controlled indoor environments, nature provides a full spectrum of sensory input in a rich, organically balanced way.</p><h2>Vestibular and Proprioceptive Input</h2><p>The uneven terrain of outdoor environments naturally challenges balance and body awareness:</p><ul><li><strong>Climbing Trees:</strong> Requires motor planning, body awareness, and core strength.</li><li><strong>Walking on Different Surfaces:</strong> From soft grass to crunchy gravel, each surface provides different feedback to the body.</li><li><strong>Hills and Slopes:</strong> Provide natural challenges to balance systems.</li></ul><h2>Tactile Stimulation</h2><p>Nature offers unlimited tactile experiences:</p><ul><li><strong>Textures:</strong> Rough bark, smooth stones, sticky sap, soft moss.</li><li><strong>Temperatures:</strong> Cool streams, warm sun, damp morning grass.</li><li><strong>Natural Sensory Bins:</strong> Dirt, sand, mud, and water provide perfect mediums for deep tactile play.</li></ul><h2>Visual and Auditory Benefits</h2><ul><li><strong>Depth Perception:</strong> Focusing on objects at varying distances strengthens visual systems.</li><li><strong>Natural Sounds:</strong> Birds, rustling leaves, and flowing water provide non-overwhelming auditory input.</li><li><strong>Visual Rest:</strong> Natural landscapes allow eyes to relax from the fixed-distance focus of screens and indoor environments.</li></ul><h2>Outdoor Activities for Sensory Regulation</h2><ul><li><strong>Barefoot Walking:</strong> Create a sensory path with different natural materials.</li><li><strong>Mud Kitchen:</strong> Combine tactile play with imaginary play for rich sensory experiences.</li><li><strong>Garden Work:</strong> Digging, planting, and watering engage multiple senses simultaneously.</li><li><strong>Cloud Watching:</strong> A calming activity that can help with visual tracking.</li></ul><h2>All-Weather Benefits</h2><p>Don\'t limit outdoor play to perfect weather days. Rain, snow, and varying temperatures offer unique sensory experiences. As the Scandinavian saying goes, "There\'s no such thing as bad weather, only inappropriate clothing."</p>' },
        featuredImage: {
          'en-US': {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: 'article3-image'
            }
          }
        },
        publishedDate: { 'en-US': '2023-06-27' },
        readingTime: { 'en-US': 8 },
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
              id: 'category-sensory'
            }
          }
        },
        tags: { 'en-US': ['sensory processing', 'outdoor activities', 'nature play'] },
        featured: { 'en-US': true }
      }
    }
  ];
  
  for (const article of articles) {
    await createOrUpdateEntry(environment, 'article', article.id, article.fields);
  }
  
  // 4. Create testimonials
  console.log('Creating testimonials...');
  
  const testimonials = [
    {
      id: 'testimonial-1',
      fields: {
        name: { 'en-US': 'Sarah Johnson' },
        role: { 'en-US': 'Parent of Alex, 7' },
        quote: { 'en-US': 'The resources from BendyKidz have completely transformed our daily routine. The practical strategies have helped my son develop independence with dressing and self-care activities.' },
        avatar: {
          'en-US': {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: 'testimonial1-avatar'
            }
          }
        }
      }
    },
    {
      id: 'testimonial-2',
      fields: {
        name: { 'en-US': 'Michael Chen' },
        role: { 'en-US': 'Parent of Lily, 5' },
        quote: { 'en-US': 'As a parent with no background in child development, I found the articles incredibly accessible and easy to implement. The sensory activities have made a huge difference for my daughter.' },
        avatar: {
          'en-US': {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: 'testimonial2-avatar'
            }
          }
        }
      }
    },
    {
      id: 'testimonial-3',
      fields: {
        name: { 'en-US': 'Jessica Rivera' },
        role: { 'en-US': 'Early Childhood Educator' },
        quote: { 'en-US': 'I recommend BendyKidz resources to all the families I work with. The evidence-based information is presented in such a practical, parent-friendly way.' },
        avatar: {
          'en-US': {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: 'testimonial3-avatar'
            }
          }
        }
      }
    }
  ];
  
  for (const testimonial of testimonials) {
    await createOrUpdateEntry(environment, 'testimonial', testimonial.id, testimonial.fields);
  }
  
  // 5. Create About page
  console.log('Creating about page...');
  
  await createOrUpdateEntry(environment, 'aboutPage', 'about-page', {
    title: { 'en-US': 'About BendyKidz Occupational Therapy' },
    subtitle: { 'en-US': 'Empowering children through play-based therapy and parent education' },
    description: { 'en-US': '<p>BendyKidz Occupational Therapy was founded by Emma Wilson, a pediatric occupational therapist with over 15 years of experience working with children of all abilities.</p><p>After years of clinical practice, Emma recognized that families needed more accessible resources to continue supporting their children\'s development at home. This website was created to bridge that gap – providing evidence-based information and practical strategies in an easy-to-implement format.</p><p>At BendyKidz, we believe that therapy doesn\'t only happen in a clinical setting but continues at home through play and daily activities. Our mission is to empower parents with the knowledge and tools to support their children\'s development.</p>' },
    mission: { 'en-US': '<p>Our mission is to make a meaningful difference in children\'s lives through evidence-based practices, play-based learning, and family-centered care. We believe in making therapeutic strategies accessible to all families, regardless of their location or resources.</p>' },
    image: {
      'en-US': {
        sys: {
          type: 'Link',
          linkType: 'Asset',
          id: 'about-image'
        }
      }
    },
    imageAlt: { 'en-US': 'Occupational therapist working with child on fine motor skills' }
  });
  
  // 6. Create team member
  console.log('Creating team member...');
  
  await createOrUpdateEntry(environment, 'teamMember', 'team-member-emma', {
    name: { 'en-US': 'Emma Wilson' },
    role: { 'en-US': 'Founder & Lead Occupational Therapist' },
    bio: { 'en-US': 'Emma has over 15 years of experience working with children with diverse needs and abilities. With a Master\'s degree in Occupational Therapy and specialized certifications in Sensory Integration and Pediatric Development, Emma brings a wealth of knowledge and practical experience to help children thrive. Her approach combines evidence-based practices with a playful, family-centered philosophy that empowers parents to support their children\'s development at home.' },
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
  });
  
  // 7. Create site stats
  console.log('Creating site stats...');
  
  await createOrUpdateEntry(environment, 'siteStats', 'site-stats', {
    title: { 'en-US': 'BendyKidz Site Statistics' },
    resources: { 'en-US': 25 },
    specialists: { 'en-US': 1 },
    activityTypes: { 'en-US': 4 }
  });
}

async function createOrUpdateEntry(environment, contentTypeId, entryId, fields) {
  try {
    console.log(`Processing ${contentTypeId} entry: ${entryId}`);
    
    // Check if entry exists
    try {
      const existingEntry = await environment.getEntry(entryId);
      console.log(`Entry ${entryId} already exists, updating it`);
      
      // Update fields
      existingEntry.fields = fields;
      
      // Save and publish
      const updatedEntry = await existingEntry.update();
      await updatedEntry.publish();
      console.log(`Entry ${entryId} updated and published`);
      return updatedEntry;
    } catch (error) {
      // Create if doesn't exist
      if (error.name === 'NotFound') {
        const newEntry = await environment.createEntryWithId(contentTypeId, entryId, {
          fields: fields
        });
        
        await newEntry.publish();
        console.log(`Entry ${entryId} created and published`);
        return newEntry;
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error(`Error processing entry ${entryId}:`, error.message);
    return null;
  }
}

// Run the setup
run();