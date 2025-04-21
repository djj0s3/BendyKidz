import { Article, Category, Testimonial, AboutContent, TeamMember, SiteStats, RelatedArticle } from '@shared/schema';

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID || '';
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN || '';

// API base URL for Contentful Content Delivery API
const API_BASE_URL = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master`;

// Helper function to make requests to Contentful
async function fetchFromContentful(endpoint: string, params: Record<string, string> = {}) {
  // Add access token to params
  const queryParams = new URLSearchParams({
    access_token: CONTENTFUL_ACCESS_TOKEN,
    ...params
  });

  try {
    // Log the request URL (without the token) for debugging
    console.log(`Fetching from Contentful: ${API_BASE_URL}${endpoint} with params: ${Object.keys(params).join(', ')}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}?${queryParams.toString()}`);
    
    if (!response.ok) {
      // Get more details from the error response if possible
      let errorDetails = '';
      try {
        const errorJson = await response.json();
        errorDetails = JSON.stringify(errorJson);
      } catch (e) {
        // If can't parse JSON, use text instead
        try {
          errorDetails = await response.text();
        } catch (e2) {
          // If all else fails, just use status
          errorDetails = `${response.status} ${response.statusText}`;
        }
      }
      
      throw new Error(`Contentful API error: ${response.status} ${response.statusText} - ${errorDetails}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching from Contentful:', error);
    throw error;
  }
}

// Get all articles
export async function getArticles(): Promise<Article[]> {
  try {
    // First check if the content type exists by getting content types
    const contentTypesResponse = await fetchFromContentful('/content_types');
    const hasArticleContentType = contentTypesResponse.items.some(
      (contentType: any) => contentType.sys.id === 'article'
    );
    
    if (!hasArticleContentType) {
      console.log('Article content type not found in Contentful space. Using fallback data.');
      return [];
    }
    
    const response = await fetchFromContentful('/entries', {
      content_type: 'article',
      include: '2', // Include 2 levels of linked entries (for authors and categories)
      order: '-sys.createdAt' // Sort by newest first
    });
    
    // Transform Contentful response to our Article model
    return response.items.map(transformContentfulArticle);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

// Get featured articles
export async function getFeaturedArticles(): Promise<Article[]> {
  try {
    // First check if the content type exists by getting content types
    const contentTypesResponse = await fetchFromContentful('/content_types');
    const hasArticleContentType = contentTypesResponse.items.some(
      (contentType: any) => contentType.sys.id === 'article'
    );
    
    if (!hasArticleContentType) {
      console.log('Article content type not found in Contentful space. Using fallback data.');
      return [];
    }
    
    // Get authors first to ensure we have them
    console.log('Fetching authors directly...');
    const authorsResponse = await fetchFromContentful('/entries', {
      content_type: 'author',
      include: '2' // Include linked assets like avatars
    });
    
    if (authorsResponse && authorsResponse.items) {
      console.log(`Directly found ${authorsResponse.items.length} authors`);
      authorsResponse.items.forEach((author: any, index: number) => {
        console.log(`Direct author ${index + 1}: ID=${author.sys.id}, Name=${author.fields?.name?.['en-US'] || 'unnamed'}`);
      });
    }
    
    // Get assets directly to ensure we have them
    console.log('Fetching assets directly...');
    const assetResponse = await fetchFromContentful('/assets');
    
    if (assetResponse && assetResponse.items) {
      console.log(`Directly found ${assetResponse.items.length} assets`);
      assetResponse.items.forEach((asset: any, index: number) => {
        console.log(`Direct asset ${index + 1}: ID=${asset.sys.id}, URL=${asset.fields?.file?.url || 'no url'}`);
      });
    }
    
    const response = await fetchFromContentful('/entries', {
      content_type: 'article',
      'fields.featured': 'true',
      include: '10', // Increase the include level to ensure we get all linked assets
      order: '-sys.createdAt'
    });
    
    // Debug asset information
    if (response.includes && response.includes.Asset) {
      console.log('Found assets in response:', response.includes.Asset.length);
      response.includes.Asset.forEach((asset: any, index: number) => {
        console.log(`Asset ${index + 1}: ID=${asset.sys.id}, URL=${asset.fields?.file?.url || 'no url'}`);
      });
    } else {
      console.log('No assets included in the response, adding them manually');
      
      // If no assets in the response, add them manually from our direct fetch
      if (assetResponse && assetResponse.items && assetResponse.items.length > 0) {
        console.log('Manually adding assets to the response');
        response.includes = response.includes || {};
        response.includes.Asset = assetResponse.items;
      }
    }
    
    // Add authors to the response includes if they're not already there
    if (!response.includes?.Entry || !response.includes.Entry.some((entry: any) => entry.sys.contentType?.sys?.id === 'author')) {
      console.log('No authors included in the response, adding them manually');
      
      if (authorsResponse && authorsResponse.items && authorsResponse.items.length > 0) {
        console.log('Manually adding authors to the response');
        response.includes = response.includes || {};
        response.includes.Entry = response.includes.Entry || [];
        
        // Add each author that isn't already in the includes
        for (const author of authorsResponse.items) {
          if (!response.includes.Entry.some((entry: any) => entry.sys.id === author.sys.id)) {
            response.includes.Entry.push(author);
          }
        }
      }
    }
    
    // If authors have linked assets (like avatars), make sure those are included too
    if (authorsResponse?.includes?.Asset) {
      console.log('Adding author avatar assets to the response');
      response.includes = response.includes || {};
      response.includes.Asset = response.includes.Asset || [];
      
      for (const asset of authorsResponse.includes.Asset) {
        if (!response.includes.Asset.some((a: any) => a.sys.id === asset.sys.id)) {
          response.includes.Asset.push(asset);
        }
      }
    }
    
    return response.items.map((item: any) => transformContentfulArticle(item, assetResponse, authorsResponse));
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    return [];
  }
}

// Get a single article by slug
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    // Get authors first to ensure we have them
    console.log('Fetching authors directly...');
    const authorsResponse = await fetchFromContentful('/entries', {
      content_type: 'author',
      include: '2' // Include linked assets like avatars
    });
    
    if (authorsResponse && authorsResponse.items) {
      console.log(`Directly found ${authorsResponse.items.length} authors`);
      authorsResponse.items.forEach((author: any, index: number) => {
        console.log(`Direct author ${index + 1}: ID=${author.sys.id}, Name=${author.fields?.name?.['en-US'] || 'unnamed'}`);
      });
    }
    
    // Fetch assets to ensure we have them
    const assetResponse = await fetchFromContentful('/assets');
    
    const response = await fetchFromContentful('/entries', {
      content_type: 'article',
      'fields.slug': slug,
      include: '10' // Increase include level
    });
    
    if (response.items.length === 0) {
      return null;
    }
    
    // If response doesn't include assets, manually add them
    if (!response.includes?.Asset && assetResponse?.items) {
      response.includes = response.includes || {};
      response.includes.Asset = assetResponse.items;
    }
    
    // Add authors to the response includes if they're not already there
    if (!response.includes?.Entry || !response.includes.Entry.some((entry: any) => entry.sys.contentType?.sys?.id === 'author')) {
      console.log('No authors included in the response, adding them manually');
      
      if (authorsResponse && authorsResponse.items && authorsResponse.items.length > 0) {
        console.log('Manually adding authors to the response');
        response.includes = response.includes || {};
        response.includes.Entry = response.includes.Entry || [];
        
        // Add each author that isn't already in the includes
        for (const author of authorsResponse.items) {
          if (!response.includes.Entry.some((entry: any) => entry.sys.id === author.sys.id)) {
            response.includes.Entry.push(author);
          }
        }
      }
    }
    
    // If authors have linked assets (like avatars), make sure those are included too
    if (authorsResponse?.includes?.Asset) {
      console.log('Adding author avatar assets to the response');
      response.includes = response.includes || {};
      response.includes.Asset = response.includes.Asset || [];
      
      for (const asset of authorsResponse.includes.Asset) {
        if (!response.includes.Asset.some((a: any) => a.sys.id === asset.sys.id)) {
          response.includes.Asset.push(asset);
        }
      }
    }
    
    return transformContentfulArticle(response.items[0], assetResponse, authorsResponse);
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }
}

// Get related articles
export async function getRelatedArticles(articleId: string, categoryId: string): Promise<RelatedArticle[]> {
  try {
    // Fetch assets first
    const assetResponse = await fetchFromContentful('/assets');
    
    const response = await fetchFromContentful('/entries', {
      content_type: 'article',
      'fields.category.sys.id': categoryId,
      include: '10', // Increase include level
      limit: '3'
    });
    
    // If response doesn't include assets, manually add them
    if (!response.includes?.Asset && assetResponse?.items) {
      response.includes = response.includes || {};
      response.includes.Asset = assetResponse.items;
    }
  
    // Filter out the current article and transform
    return response.items
      .filter((item: any) => item.sys.id !== articleId)
      .map((item: any) => transformContentfulRelatedArticle(item, assetResponse));
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetchFromContentful('/entries', {
      content_type: 'category',
      order: 'fields.name'
    });
    
    return response.items.map((item: any) => transformContentfulCategory(item));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
}

// Get a single category by slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await fetchFromContentful('/entries', {
      content_type: 'category',
      'fields.slug': slug
    });
    
    if (response.items.length === 0) {
      return null;
    }
    
    return transformContentfulCategory(response.items[0]);
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}

// Get articles by category
export async function getArticlesByCategory(categoryId: string): Promise<Article[]> {
  try {
    // Get authors first to ensure we have them
    console.log('Fetching authors directly...');
    const authorsResponse = await fetchFromContentful('/entries', {
      content_type: 'author',
      include: '2' // Include linked assets like avatars
    });
    
    if (authorsResponse && authorsResponse.items) {
      console.log(`Directly found ${authorsResponse.items.length} authors for articles by category`);
      authorsResponse.items.forEach((author: any, index: number) => {
        console.log(`Direct author ${index + 1}: ID=${author.sys.id}, Name=${author.fields?.name?.['en-US'] || 'unnamed'}`);
      });
    }
    
    // Fetch assets first
    const assetResponse = await fetchFromContentful('/assets');
    
    const response = await fetchFromContentful('/entries', {
      content_type: 'article',
      'fields.category.sys.id': categoryId,
      include: '10', // Increase include level
      order: '-sys.createdAt'
    });
    
    // If response doesn't include assets, manually add them
    if (!response.includes?.Asset && assetResponse?.items) {
      response.includes = response.includes || {};
      response.includes.Asset = assetResponse.items;
    }
    
    // Add authors to the response includes if they're not already there
    if (!response.includes?.Entry || !response.includes.Entry.some((entry: any) => entry.sys.contentType?.sys?.id === 'author')) {
      console.log('No authors included in the response, adding them manually');
      
      if (authorsResponse && authorsResponse.items && authorsResponse.items.length > 0) {
        console.log('Manually adding authors to the response');
        response.includes = response.includes || {};
        response.includes.Entry = response.includes.Entry || [];
        
        // Add each author that isn't already in the includes
        for (const author of authorsResponse.items) {
          if (!response.includes.Entry.some((entry: any) => entry.sys.id === author.sys.id)) {
            response.includes.Entry.push(author);
          }
        }
      }
    }
    
    // If authors have linked assets (like avatars), make sure those are included too
    if (authorsResponse?.includes?.Asset) {
      console.log('Adding author avatar assets to the response');
      response.includes = response.includes || {};
      response.includes.Asset = response.includes.Asset || [];
      
      for (const asset of authorsResponse.includes.Asset) {
        if (!response.includes.Asset.some((a: any) => a.sys.id === asset.sys.id)) {
          response.includes.Asset.push(asset);
        }
      }
    }
    
    return response.items.map((item: any) => transformContentfulArticle(item, assetResponse, authorsResponse));
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    return [];
  }
}

// Get testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const response = await fetchFromContentful('/entries', {
      content_type: 'testimonial',
      order: '-sys.createdAt'
    });
    
    return response.items.map(transformContentfulTestimonial);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

// Get about page content
export async function getAboutContent(): Promise<AboutContent | null> {
  try {
    const response = await fetchFromContentful('/entries', {
      content_type: 'aboutPage',
      include: '1'
    });
    
    if (response.items.length === 0) {
      return null;
    }
    
    return transformContentfulAboutContent(response.items[0]);
  } catch (error) {
    console.error('Error fetching about content:', error);
    return null;
  }
}

// Get team members
export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const response = await fetchFromContentful('/entries', {
      content_type: 'teamMember',
      order: 'fields.order'
    });
    
    return response.items.map(transformContentfulTeamMember);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

// Get site statistics
export async function getSiteStats(): Promise<SiteStats | null> {
  try {
    const response = await fetchFromContentful('/entries', {
      content_type: 'siteStats'
    });
    
    if (response.items.length === 0) {
      return null;
    }
    
    return transformContentfulSiteStats(response.items[0]);
  } catch (error) {
    console.error('Error fetching site stats:', error);
    return null;
  }
}

// Helper functions to transform Contentful data
function transformContentfulArticle(item: any, assetResponse?: any, authorsResponse?: any): Article {
  const fields = item.fields;
  const featuredImageAssetId = fields.featuredImage?.sys?.id;
  
  // Debug for author relationship
  console.log("Article author field:", JSON.stringify(fields.author, null, 2));
  
  // Get author information
  let authorId = '';
  let authorName = 'Unknown Author';
  let authorAvatarUrl = '';
  
  // First try to find the linked entry in the includes
  const authorEntryId = fields.author?.sys?.id;
  console.log(`Looking for author with ID: ${authorEntryId}`);
  const authorEntry = findLinkedEntry(item, authorEntryId);
  
  if (authorEntry) {
    console.log("Found author entry in includes:", JSON.stringify(authorEntry.fields, null, 2));
    authorId = authorEntry.sys.id;
    authorName = authorEntry.fields?.name?.['en-US'] || authorEntry.fields?.name || 'Unknown Author';
    
    // Get author avatar
    const authorAvatarId = authorEntry.fields?.avatar?.['en-US']?.sys?.id || 
                           authorEntry.fields?.avatar?.sys?.id;
    
    console.log(`Author avatar ID: ${authorAvatarId}`);
    
    if (authorAvatarId) {
      // Try to find in includes first
      let authorAvatarAsset = findLinkedAsset(item, authorAvatarId);
      
      // If not found, try direct assets
      if (!authorAvatarAsset && assetResponse && assetResponse.items) {
        console.log(`Looking for author avatar ${authorAvatarId} in direct asset response`);
        authorAvatarAsset = assetResponse.items.find((asset: any) => asset.sys.id === authorAvatarId);
        
        if (authorAvatarAsset) {
          console.log(`Found author avatar ${authorAvatarId} in direct asset response`);
        }
      }
      
      if (authorAvatarAsset) {
        const fileUrl = authorAvatarAsset.fields?.file?.['en-US']?.url || 
                       authorAvatarAsset.fields?.file?.url;
        
        if (fileUrl) {
          authorAvatarUrl = 'https:' + fileUrl;
          console.log(`Author avatar URL: ${authorAvatarUrl}`);
        }
      }
    }
  } else if (authorEntryId && authorsResponse) {
    // If not found in includes but we have a direct authors response, try to find there
    console.log(`Looking for author ${authorEntryId} in direct authors response`);
    const directAuthor = authorsResponse.items?.find((author: any) => author.sys.id === authorEntryId);
    
    if (directAuthor) {
      console.log('Found author in direct authors response:', JSON.stringify(directAuthor.fields, null, 2));
      authorId = directAuthor.sys.id;
      authorName = directAuthor.fields?.name?.['en-US'] || 'Unknown Author';
      
      // Get avatar ID
      const authorAvatarId = directAuthor.fields?.avatar?.['en-US']?.sys?.id;
      
      if (authorAvatarId) {
        // Look for the avatar in the authors response includes first
        let authorAvatarAsset = null;
        if (authorsResponse.includes?.Asset) {
          console.log(`Looking for author avatar in authors response includes`);
          authorAvatarAsset = authorsResponse.includes.Asset.find((asset: any) => asset.sys.id === authorAvatarId);
        }
        
        // If not found, try direct assets
        if (!authorAvatarAsset && assetResponse && assetResponse.items) {
          console.log(`Looking for author avatar ${authorAvatarId} in direct asset response`);
          authorAvatarAsset = assetResponse.items.find((asset: any) => asset.sys.id === authorAvatarId);
        }
        
        if (authorAvatarAsset) {
          console.log('Found author avatar:', JSON.stringify(authorAvatarAsset.fields, null, 2));
          const fileUrl = authorAvatarAsset.fields?.file?.['en-US']?.url || 
                         authorAvatarAsset.fields?.file?.url;
          
          if (fileUrl) {
            authorAvatarUrl = 'https:' + fileUrl;
            console.log(`Author avatar URL: ${authorAvatarUrl}`);
          }
        }
      }
    } else {
      console.log(`Author not found in direct authors response`);
    }
  } else {
    console.log(`Author entry not found in includes and no direct authors response available`);
  }
  
  // Get category information
  const categoryEntryId = fields.category?.sys?.id;
  const categoryEntry = findLinkedEntry(item, categoryEntryId);
  
  // Try to find the asset in the response includes first
  let featuredImageAsset = findLinkedAsset(item, featuredImageAssetId);
  
  // If not found but we have a direct asset response, try to find it there
  if (!featuredImageAsset && assetResponse && assetResponse.items) {
    console.log(`Looking for asset ${featuredImageAssetId} in direct asset response`);
    featuredImageAsset = assetResponse.items.find((asset: any) => asset.sys.id === featuredImageAssetId);
    
    if (featuredImageAsset) {
      console.log(`Found asset ${featuredImageAssetId} in direct asset response`);
    }
  }
  
  // Debug image information
  console.log(`Transforming article: ${fields.title} (ID: ${item.sys.id})`);
  console.log(`  Featured image asset ID: ${featuredImageAssetId || 'none'}`);
  if (featuredImageAsset) {
    console.log(`  Featured image details:`);
    console.log(`    - Found asset: ${featuredImageAsset.sys.id}`);
    console.log(`    - Has file field: ${!!featuredImageAsset.fields?.file}`);
    
    // Handle both direct and localized fields
    const fileUrl = featuredImageAsset.fields?.file?.['en-US']?.url || 
                   featuredImageAsset.fields?.file?.url;
    
    console.log(`    - File URL: ${fileUrl || 'none'}`);
    if (fileUrl) {
      console.log(`    - Full Image URL: ${'https:' + fileUrl}`);
    }
  } else {
    console.log(`  No featured image asset found`);
  }
  
  // Get file URL considering both direct and localized fields
  const featuredImageUrl = featuredImageAsset ? 
    'https:' + (featuredImageAsset.fields?.file?.['en-US']?.url || 
               featuredImageAsset.fields?.file?.url || '') : '';
  
  return {
    id: item.sys.id,
    title: fields.title || '',
    slug: fields.slug || '',
    excerpt: fields.excerpt || '',
    content: fields.content || '',
    featuredImage: featuredImageUrl,
    publishedDate: fields.publishedDate || item.sys.createdAt,
    readingTime: fields.readingTime || 5,
    author: {
      id: authorId,
      name: authorName,
      avatar: authorAvatarUrl
    },
    category: {
      id: categoryEntry?.sys?.id || '',
      name: categoryEntry?.fields?.name?.['en-US'] || categoryEntry?.fields?.name || 'Uncategorized',
      slug: categoryEntry?.fields?.slug?.['en-US'] || categoryEntry?.fields?.slug || 'uncategorized',
      description: categoryEntry?.fields?.description?.['en-US'] || categoryEntry?.fields?.description || ''
    },
    tags: fields.tags || []
  };
}

function transformContentfulRelatedArticle(item: any, assetResponse?: any): RelatedArticle {
  const fields = item.fields;
  const featuredImageAssetId = fields.featuredImage?.sys?.id;
  
  // Try to find in includes first
  let featuredImageAsset = findLinkedAsset(item, featuredImageAssetId);
  
  // If not found but we have direct assets, try there
  if (!featuredImageAsset && assetResponse && assetResponse.items) {
    console.log(`Looking for related article asset ${featuredImageAssetId} in direct asset response`);
    featuredImageAsset = assetResponse.items.find((asset: any) => asset.sys.id === featuredImageAssetId);
    
    if (featuredImageAsset) {
      console.log(`Found related article asset ${featuredImageAssetId} in direct asset response`);
    }
  }
  
  return {
    id: item.sys.id,
    title: fields.title || '',
    slug: fields.slug || '',
    excerpt: fields.excerpt || '',
    featuredImage: featuredImageAsset?.fields?.file?.url ? 'https:' + featuredImageAsset.fields.file.url : ''
  };
}

function transformContentfulCategory(item: any): Category {
  const fields = item.fields;
  
  return {
    id: item.sys.id,
    name: fields.name || '',
    slug: fields.slug || '',
    description: fields.description || ''
  };
}

function transformContentfulTestimonial(item: any): Testimonial {
  const fields = item.fields;
  
  return {
    id: item.sys.id,
    name: fields.name || '',
    role: fields.role || '',
    quote: fields.quote || '',
    avatar: findLinkedAsset(item, fields.avatar?.sys?.id)?.fields?.file?.url 
      ? 'https:' + findLinkedAsset(item, fields.avatar.sys.id).fields.file.url 
      : ''
  };
}

function transformContentfulAboutContent(item: any): AboutContent {
  const fields = item.fields;
  
  return {
    title: fields.title || '',
    subtitle: fields.subtitle || '',
    description: fields.description || '',
    mission: fields.mission || '',
    image: findLinkedAsset(item, fields.image?.sys?.id)?.fields?.file?.url 
      ? 'https:' + findLinkedAsset(item, fields.image.sys.id).fields.file.url 
      : '',
    imageAlt: fields.imageAlt || ''
  };
}

function transformContentfulTeamMember(item: any): TeamMember {
  const fields = item.fields;
  
  return {
    id: item.sys.id,
    name: fields.name || '',
    role: fields.role || '',
    bio: fields.bio || '',
    avatar: findLinkedAsset(item, fields.avatar?.sys?.id)?.fields?.file?.url 
      ? 'https:' + findLinkedAsset(item, fields.avatar.sys.id).fields.file.url 
      : ''
  };
}

function transformContentfulSiteStats(item: any): SiteStats {
  const fields = item.fields;
  
  return {
    resources: fields.resources || 0,
    specialists: fields.specialists || 0,
    activityTypes: fields.activityTypes || 0
  };
}

// Helper to find linked entries
function findLinkedEntry(response: any, entryId: string) {
  if (!entryId || !response.includes || !response.includes.Entry) {
    return null;
  }
  
  return response.includes.Entry.find((entry: any) => entry.sys.id === entryId);
}

// Helper to find linked assets
function findLinkedAsset(response: any, assetId: string) {
  if (!assetId) {
    console.log('findLinkedAsset called with null/undefined assetId');
    return null;
  }
  
  if (!response.includes) {
    console.log(`findLinkedAsset: response has no includes property for asset ${assetId}`);
    return null;
  }
  
  if (!response.includes.Asset) {
    console.log(`findLinkedAsset: response includes has no Asset property for asset ${assetId}`);
    console.log('Available includes:', Object.keys(response.includes).join(', '));
    return null;
  }
  
  console.log(`Looking for asset ID ${assetId} among ${response.includes.Asset.length} assets`);
  
  const asset = response.includes.Asset.find((asset: any) => asset.sys.id === assetId);
  
  if (!asset) {
    console.log(`Asset with ID ${assetId} not found in includes.Asset array`);
    // List all available asset IDs for debugging
    console.log('Available asset IDs:', response.includes.Asset.map((a: any) => a.sys.id).join(', '));
  } else {
    console.log(`Found asset with ID ${assetId}`);
  }
  
  return asset;
}
