// Script to set up Contentful content models and sample content
const spaceId = process.env.CONTENTFUL_SPACE_ID;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

async function setupContentful() {
  try {
    console.log('Setting up Contentful content models...');
    
    // 1. Create content models
    await createContentTypes();
    
    // 2. Create sample content
    await createSampleContent();
    
    console.log('Contentful setup completed successfully!');
  } catch (error) {
    console.error('Error setting up Contentful:', error);
  }
}

async function createContentTypes() {
  console.log('Creating content types...');
  
  // Article content type
  const articleContentType = {
    name: 'Article',
    description: 'Blog article for BendyKidz',
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
        validations: [
          {
            unique: true
          }
        ]
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
        validations: [
          {
            linkContentType: ['author']
          }
        ],
        required: true
      },
      {
        id: 'category',
        name: 'Category',
        type: 'Link',
        linkType: 'Entry',
        validations: [
          {
            linkContentType: ['category']
          }
        ],
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
        type: 'Boolean',
        defaultValue: false
      }
    ]
  };
  
  // Author content type
  const authorContentType = {
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
  };
  
  // Category content type
  const categoryContentType = {
    name: 'Category',
    description: 'Category for BendyKidz articles',
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
        validations: [
          {
            unique: true
          }
        ]
      },
      {
        id: 'description',
        name: 'Description',
        type: 'Text',
        required: true
      }
    ]
  };
  
  // Testimonial content type
  const testimonialContentType = {
    name: 'Testimonial',
    description: 'Client testimonial for BendyKidz',
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
  };
  
  // About Page content type
  const aboutPageContentType = {
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
  };
  
  // Team Member content type
  const teamMemberContentType = {
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
  };
  
  // Site Stats content type
  const siteStatsContentType = {
    name: 'Site Stats',
    description: 'Statistics displayed on the BendyKidz homepage',
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
  };
  
  // Create all content types in Contentful
  const contentTypes = [
    { id: 'author', data: authorContentType },
    { id: 'category', data: categoryContentType },
    { id: 'article', data: articleContentType },
    { id: 'testimonial', data: testimonialContentType },
    { id: 'aboutPage', data: aboutPageContentType },
    { id: 'teamMember', data: teamMemberContentType },
    { id: 'siteStats', data: siteStatsContentType }
  ];
  
  for (const contentType of contentTypes) {
    try {
      console.log(`Creating content type: ${contentType.id}`);
      
      // Create the content type
      const createResponse = await fetch(
        `https://api.contentful.com/spaces/${spaceId}/environments/master/content_types`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${managementToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: contentType.data.name,
            description: contentType.data.description,
            displayField: contentType.data.displayField,
            fields: contentType.data.fields,
            sys: {
              id: contentType.id
            }
          })
        }
      );
      
      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error(`Error creating content type ${contentType.id}:`, errorText);
        continue;
      }
      
      const contentTypeData = await createResponse.json();
      
      // Publish the content type
      const publishResponse = await fetch(
        `https://api.contentful.com/spaces/${spaceId}/environments/master/content_types/${contentType.id}/published`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${managementToken}`,
            'Content-Type': 'application/json',
            'X-Contentful-Version': contentTypeData.sys.version
          }
        }
      );
      
      if (!publishResponse.ok) {
        const errorText = await publishResponse.text();
        console.error(`Error publishing content type ${contentType.id}:`, errorText);
      } else {
        console.log(`Content type ${contentType.id} created and published successfully`);
      }
    } catch (error) {
      console.error(`Error processing content type ${contentType.id}:`, error);
    }
  }
}

async function createSampleContent() {
  console.log('Creating sample content...');
  
  // Sample avatar URLs for assets
  const avatarUrls = {
    emma: 'https://randomuser.me/api/portraits/women/65.jpg',
    testimonial1: 'https://randomuser.me/api/portraits/women/32.jpg',
    testimonial2: 'https://randomuser.me/api/portraits/men/25.jpg',
    testimonial3: 'https://randomuser.me/api/portraits/women/47.jpg'
  };
  
  // Sample image URLs for articles and about page
  const imageUrls = {
    article1: 'https://images.unsplash.com/photo-1524503033411-c9566986fc8f',
    article2: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c',
    article3: 'https://images.unsplash.com/photo-1564429097439-923d2f1e4ac1',
    aboutPage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b24'
  };
  
  // Create assets first
  const assets = {
    'emma-avatar': {
      title: 'Emma Wilson Avatar',
      description: 'Portrait of Emma Wilson, the lead occupational therapist',
      url: avatarUrls.emma,
      contentType: 'image/jpeg'
    },
    'testimonial1-avatar': {
      title: 'Sarah Johnson Avatar',
      description: 'Portrait of Sarah Johnson, a parent testimonial',
      url: avatarUrls.testimonial1,
      contentType: 'image/jpeg'
    },
    'testimonial2-avatar': {
      title: 'Michael Chen Avatar',
      description: 'Portrait of Michael Chen, a parent testimonial',
      url: avatarUrls.testimonial2,
      contentType: 'image/jpeg'
    },
    'testimonial3-avatar': {
      title: 'Jessica Rivera Avatar',
      description: 'Portrait of Jessica Rivera, an educator testimonial',
      url: avatarUrls.testimonial3,
      contentType: 'image/jpeg'
    },
    'article1-image': {
      title: 'Pencil Grip Exercise Image',
      description: 'Image showing exercises for pencil grip',
      url: imageUrls.article1,
      contentType: 'image/jpeg'
    },
    'article2-image': {
      title: 'Sensory Play Image',
      description: 'Image of sensory play materials',
      url: imageUrls.article2,
      contentType: 'image/jpeg'
    },
    'article3-image': {
      title: 'Outdoor Activities Image',
      description: 'Image of children playing outdoors',
      url: imageUrls.article3,
      contentType: 'image/jpeg'
    },
    'about-image': {
      title: 'About Page Image',
      description: 'Image for the About page',
      url: imageUrls.aboutPage,
      contentType: 'image/jpeg'
    }
  };
  
  const createdAssets = {};
  
  // Create and publish each asset
  for (const [assetId, assetData] of Object.entries(assets)) {
    try {
      console.log(`Creating asset: ${assetId}`);
      
      // Create the asset
      const createResponse = await fetch(
        `https://api.contentful.com/spaces/${spaceId}/environments/master/assets`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${managementToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: {
              title: {
                'en-US': assetData.title
              },
              description: {
                'en-US': assetData.description
              },
              file: {
                'en-US': {
                  contentType: assetData.contentType,
                  fileName: `${assetId}.jpg`,
                  upload: assetData.url
                }
              }
            },
            sys: {
              id: assetId
            }
          })
        }
      );
      
      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error(`Error creating asset ${assetId}:`, errorText);
        continue;
      }
      
      const assetResponse = await createResponse.json();
      
      // Process the asset (for image processing)
      const processResponse = await fetch(
        `https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetId}/files/en-US/process`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${managementToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!processResponse.ok) {
        const errorText = await processResponse.text();
        console.error(`Error processing asset ${assetId}:`, errorText);
        continue;
      }
      
      // Give Contentful some time to process the asset
      console.log(`Waiting for asset ${assetId} to be processed...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Get the latest version of the asset
      const getResponse = await fetch(
        `https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetId}`,
        {
          headers: {
            'Authorization': `Bearer ${managementToken}`
          }
        }
      );
      
      if (!getResponse.ok) {
        const errorText = await getResponse.text();
        console.error(`Error getting asset ${assetId}:`, errorText);
        continue;
      }
      
      const latestAsset = await getResponse.json();
      
      // Publish the asset
      const publishResponse = await fetch(
        `https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetId}/published`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${managementToken}`,
            'Content-Type': 'application/json',
            'X-Contentful-Version': latestAsset.sys.version
          }
        }
      );
      
      if (!publishResponse.ok) {
        const errorText = await publishResponse.text();
        console.error(`Error publishing asset ${assetId}:`, errorText);
      } else {
        console.log(`Asset ${assetId} created and published successfully`);
        createdAssets[assetId] = (await publishResponse.json()).sys.id;
      }
    } catch (error) {
      console.error(`Error processing asset ${assetId}:`, error);
    }
  }
  
  // Create author entry
  console.log('Creating author entry...');
  const authorEntry = await createContentEntry('author', {
    name: {
      'en-US': 'Emma Wilson'
    },
    avatar: {
      'en-US': {
        sys: {
          type: 'Link',
          linkType: 'Asset',
          id: 'emma-avatar'
        }
      }
    }
  }, 'author-emma');
  
  // Create category entries
  console.log('Creating category entries...');
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
  
  const categoryEntries = {};
  for (const [categoryId, categoryData] of Object.entries(categories)) {
    const entry = await createContentEntry('category', {
      name: {
        'en-US': categoryData.name
      },
      slug: {
        'en-US': categoryData.slug
      },
      description: {
        'en-US': categoryData.description
      }
    }, `category-${categoryId}`);
    
    if (entry) {
      categoryEntries[categoryId] = entry;
    }
  }
  
  // Create article entries
  console.log('Creating article entries...');
  const articles = [
    {
      id: 'article-1',
      title: 'Simple Exercises to Improve Pencil Grip',
      slug: 'improve-pencil-grip',
      excerpt: 'Learn effective exercises that help children develop the proper pencil grip for writing and drawing.',
      content: '<h2>Why Pencil Grip Matters</h2><p>A proper pencil grip is essential for comfortable, efficient writing and drawing. When children struggle with grip, they may experience hand fatigue, reduced writing speed, and poor handwriting quality.</p><h2>Signs Your Child Might Need Help</h2><ul><li>Complains of hand pain when writing</li><li>Switches hands frequently during writing tasks</li><li>Presses too hard or too lightly on the paper</li><li>Awkward or inefficient pencil grasp</li></ul><h2>Exercises to Try at Home</h2><h3>1. The Pinch and Lift</h3><p>Place small objects (buttons, coins, small erasers) on a table. Have your child pinch each object using their thumb, index, and middle fingers (the same fingers used for a tripod grasp), and place them into a container.</p><h3>2. Vertical Surface Work</h3><p>Attach paper to a wall or easel at eye level. Drawing or writing on vertical surfaces naturally encourages a proper wrist position and grip.</p><h3>3. Rubber Band Trick</h3><p>Place a small rubber band around the wrist, then loop it around the thumb and index finger. This creates sensory feedback and a reminder of where fingers should be positioned.</p><h3>4. Short Pencils</h3><p>Using shorter pencils (golf pencils or broken crayons) naturally encourages children to use a tripod grasp, as there simply isn\'t enough room for extra fingers.</p><h2>When to Seek Help</h2><p>If your child continues to struggle despite trying these techniques, consider consulting with an occupational therapist who can provide personalized assessment and intervention.</p>',
      featuredImage: 'article1-image',
      publishedDate: '2023-03-15',
      readingTime: 4,
      author: 'author-emma',
      category: 'category-fine-motor',
      tags: ['fine motor', 'handwriting', 'school skills'],
      featured: true
    },
    {
      id: 'article-2',
      title: 'Creating a Sensory-Friendly Home Environment',
      slug: 'sensory-friendly-home',
      excerpt: 'Practical tips for adapting your home to support children with sensory processing differences.',
      content: '<h2>Understanding Sensory Needs</h2><p>Children with sensory processing differences experience the world differently. Some seek extra sensory input, while others find certain sensations overwhelming. Creating a sensory-friendly home involves finding the right balance for your child.</p><h2>Visual Environment</h2><ul><li><strong>Reduce Visual Clutter</strong>: Organize toys in covered bins, use neutral colors for walls, and create designated spaces for activities.</li><li><strong>Lighting</strong>: Consider dimmable lights or lamps instead of bright overhead lighting. Some children are sensitive to fluorescent lights that others don\'t notice flickering.</li><li><strong>Visual Schedules</strong>: Use pictures or symbols to create predictable routines, reducing anxiety about what comes next.</li></ul><h2>Sound Management</h2><ul><li><strong>Identify Triggers</strong>: Be aware of sounds that may disturb your child - appliances, traffic noise, or even certain pitches of voice.</li><li><strong>Noise Reduction</strong>: Use rugs, curtains, and soft furnishings to absorb sound. Consider white noise machines for constant background sound that masks unpredictable noises.</li><li><strong>Headphones</strong>: Noise-cancelling headphones can be helpful during particularly overwhelming situations.</li></ul><h2>Touch and Movement</h2><ul><li><strong>Cozy Corner</strong>: Create a retreat space with soft blankets, cushions, and perhaps a small tent where your child can go when feeling overwhelmed.</li><li><strong>Weighted Items</strong>: Weighted blankets, lap pads, or stuffed animals can provide calming deep pressure.</li><li><strong>Movement Opportunities</strong>: Include spaces for safe jumping, spinning, or swinging if your child seeks movement input.</li></ul><h2>Adapting Your Home Room by Room</h2><h3>Bedroom</h3><p>Consider the texture of bedding, reduce echo with soft furnishings, and organize the space to be calming and predictable.</p><h3>Bathroom</h3><p>Adjust water pressure, provide step-by-step visual guides for routines, and consider sensory aspects of toiletries (scents, textures).</p><h3>Kitchen</h3><p>Be mindful of strong odors, provide seating that supports good posture, and reduce background noise during mealtimes.</p><h2>Remember</h2><p>Every child is unique, and their sensory preferences may change over time. Observe, ask, and adjust your environment accordingly. Small changes can make a big difference in your child\'s comfort and ability to thrive at home.</p>',
      featuredImage: 'article2-image',
      publishedDate: '2023-04-22',
      readingTime: 7,
      author: 'author-emma',
      category: 'category-sensory',
      tags: ['sensory processing', 'home environment', 'adaptations'],
      featured: true
    },
    {
      id: 'article-3',
      title: 'Natural Outdoor Activities for Sensory Development',
      slug: 'outdoor-sensory-activities',
      excerpt: 'How nature provides the perfect sensory-rich environment for children\'s development and regulation.',
      content: '<h2>Nature as a Sensory Classroom</h2><p>The outdoors offers unmatched opportunities for sensory exploration. Unlike carefully controlled indoor environments, nature provides a full spectrum of sensory input in a rich, organically balanced way.</p><h2>Vestibular and Proprioceptive Input</h2><p>The uneven terrain of outdoor environments naturally challenges balance and body awareness:</p><ul><li><strong>Climbing Trees:</strong> Requires motor planning, body awareness, and core strength.</li><li><strong>Walking on Different Surfaces:</strong> From soft grass to crunchy gravel, each surface provides different feedback to the body.</li><li><strong>Hills and Slopes:</strong> Provide natural challenges to balance systems.</li></ul><h2>Tactile Stimulation</h2><p>Nature offers unlimited tactile experiences:</p><ul><li><strong>Textures:</strong> Rough bark, smooth stones, sticky sap, soft moss.</li><li><strong>Temperatures:</strong> Cool streams, warm sun, damp morning grass.</li><li><strong>Natural Sensory Bins:</strong> Dirt, sand, mud, and water provide perfect mediums for deep tactile play.</li></ul><h2>Visual and Auditory Benefits</h2><ul><li><strong>Depth Perception:</strong> Focusing on objects at varying distances strengthens visual systems.</li><li><strong>Natural Sounds:</strong> Birds, rustling leaves, and flowing water provide non-overwhelming auditory input.</li><li><strong>Visual Rest:</strong> Natural landscapes allow eyes to relax from the fixed-distance focus of screens and indoor environments.</li></ul><h2>Outdoor Activities for Sensory Regulation</h2><ul><li><strong>Barefoot Walking:</strong> Create a sensory path with different natural materials.</li><li><strong>Mud Kitchen:</strong> Combine tactile play with imaginary play for rich sensory experiences.</li><li><strong>Garden Work:</strong> Digging, planting, and watering engage multiple senses simultaneously.</li><li><strong>Cloud Watching:</strong> A calming activity that can help with visual tracking.</li></ul><h2>All-Weather Benefits</h2><p>Don\'t limit outdoor play to perfect weather days. Rain, snow, and varying temperatures offer unique sensory experiences. As the Scandinavian saying goes, "There\'s no such thing as bad weather, only inappropriate clothing."</p>',
      featuredImage: 'article3-image',
      publishedDate: '2023-06-27',
      readingTime: 8,
      author: 'author-emma',
      category: 'category-sensory',
      tags: ['sensory processing', 'outdoor activities', 'nature play'],
      featured: true
    }
  ];
  
  for (const article of articles) {
    await createContentEntry('article', {
      title: { 'en-US': article.title },
      slug: { 'en-US': article.slug },
      excerpt: { 'en-US': article.excerpt },
      content: { 'en-US': article.content },
      featuredImage: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: article.featuredImage
          }
        }
      },
      publishedDate: { 'en-US': article.publishedDate },
      readingTime: { 'en-US': article.readingTime },
      author: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: article.author
          }
        }
      },
      category: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: article.category
          }
        }
      },
      tags: { 'en-US': article.tags },
      featured: { 'en-US': article.featured }
    }, article.id);
  }
  
  // Create testimonial entries
  console.log('Creating testimonial entries...');
  const testimonials = [
    {
      id: 'testimonial-1',
      name: 'Sarah Johnson',
      role: 'Parent of Alex, 7',
      quote: 'The resources from BendyKidz have completely transformed our daily routine. The practical strategies have helped my son develop independence with dressing and self-care activities.',
      avatar: 'testimonial1-avatar'
    },
    {
      id: 'testimonial-2',
      name: 'Michael Chen',
      role: 'Parent of Lily, 5',
      quote: 'As a parent with no background in child development, I found the articles incredibly accessible and easy to implement. The sensory activities have made a huge difference for my daughter.',
      avatar: 'testimonial2-avatar'
    },
    {
      id: 'testimonial-3',
      name: 'Jessica Rivera',
      role: 'Early Childhood Educator',
      quote: 'I recommend BendyKidz resources to all the families I work with. The evidence-based information is presented in such a practical, parent-friendly way.',
      avatar: 'testimonial3-avatar'
    }
  ];
  
  for (const testimonial of testimonials) {
    await createContentEntry('testimonial', {
      name: { 'en-US': testimonial.name },
      role: { 'en-US': testimonial.role },
      quote: { 'en-US': testimonial.quote },
      avatar: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: testimonial.avatar
          }
        }
      }
    }, testimonial.id);
  }
  
  // Create about page entry
  console.log('Creating about page entry...');
  await createContentEntry('aboutPage', {
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
  }, 'about-page');
  
  // Create team member entry
  console.log('Creating team member entry...');
  await createContentEntry('teamMember', {
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
  }, 'team-member-emma');
  
  // Create site stats entry
  console.log('Creating site stats entry...');
  await createContentEntry('siteStats', {
    title: { 'en-US': 'BendyKidz Site Statistics' },
    resources: { 'en-US': 25 },
    specialists: { 'en-US': 1 },
    activityTypes: { 'en-US': 4 }
  }, 'site-stats');
}

async function createContentEntry(contentType, fields, entryId) {
  try {
    // Create the entry
    const createResponse = await fetch(
      `https://api.contentful.com/spaces/${spaceId}/environments/master/entries`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${managementToken}`,
          'Content-Type': 'application/json',
          'X-Contentful-Content-Type': contentType
        },
        body: JSON.stringify({
          fields,
          sys: {
            id: entryId
          }
        })
      }
    );
    
    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error(`Error creating ${contentType} entry ${entryId}:`, errorText);
      return null;
    }
    
    const entryData = await createResponse.json();
    
    // Publish the entry
    const publishResponse = await fetch(
      `https://api.contentful.com/spaces/${spaceId}/environments/master/entries/${entryId}/published`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${managementToken}`,
          'Content-Type': 'application/json',
          'X-Contentful-Version': entryData.sys.version
        }
      }
    );
    
    if (!publishResponse.ok) {
      const errorText = await publishResponse.text();
      console.error(`Error publishing ${contentType} entry ${entryId}:`, errorText);
      return null;
    }
    
    console.log(`${contentType} entry ${entryId} created and published successfully`);
    return entryId;
  } catch (error) {
    console.error(`Error creating ${contentType} entry ${entryId}:`, error);
    return null;
  }
}

// Run the setup
setupContentful();