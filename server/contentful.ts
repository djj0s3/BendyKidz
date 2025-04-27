import { Article, Category, Testimonial, TestimonialsSection, AboutContent, TeamMember, SiteStats, RelatedArticle, HeroSection, FeaturedCollection, Header, Footer, ContactPageInfo } from '@shared/schema';

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
        console.log(`FULL AUTHOR FIELDS: ${JSON.stringify(author.fields, null, 2)}`);
      });
    }
    
    // Get assets directly to ensure we have them
    console.log('Fetching assets directly...');
    const assetResponse = await fetchFromContentful('/assets');
    
    if (assetResponse && assetResponse.items) {
      console.log(`Directly found ${assetResponse.items.length} assets`);
      assetResponse.items.forEach((asset: any, index: number) => {
        console.log(`Direct asset ${index + 1}: ID=${asset.sys.id}, URL=${asset.fields?.file?.['en-US']?.url || asset.fields?.file?.url || 'no url'}`);
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
        console.log(`Asset ${index + 1}: ID=${asset.sys.id}, URL=${asset.fields?.file?.['en-US']?.url || asset.fields?.file?.url || 'no url'}`);
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
    
    const articles = response.items.map((item: any) => transformContentfulArticle(item, assetResponse, authorsResponse));
    
    // Log the final articles for debugging
    console.log('FINAL ARTICLES:', JSON.stringify(articles, null, 2));
    
    return articles;
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
export async function getTestimonialsSection(): Promise<TestimonialsSection | null> {
  try {
    const response = await fetchFromContentful('entries', {
      content_type: 'testimonialsSection',
      limit: '1',
      include: '0'
    });

    if (!response.items || response.items.length === 0) {
      return {
        title: "Every Child Can Thrive with the Right Support",
        subtitle: ""
      };
    }

    return transformContentfulTestimonialsSection(response.items[0]);
  } catch (error) {
    console.error('Error fetching testimonials section:', error);
    return {
      title: "Every Child Can Thrive with the Right Support",
      subtitle: ""
    };
  }
}

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

// Get hero section content
export async function getHeroSection(): Promise<HeroSection | null> {
  try {
    console.log('Fetching hero section from Contentful...');
    const response = await fetchFromContentful('/entries', {
      content_type: 'heroSection',
      include: '2'
    });
    
    console.log('Hero section response:', JSON.stringify(response, null, 2));
    
    if (response.items.length === 0) {
      console.log('No hero section found in Contentful');
      return null;
    }
    
    const heroSection = transformContentfulHeroSection(response.items[0]);
    console.log('Transformed hero section:', heroSection);
    return heroSection;
  } catch (error) {
    console.error('Error fetching hero section:', error);
    return null;
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

// Get all featured collections
export async function getFeaturedCollections(): Promise<FeaturedCollection[]> {
  try {
    console.log('Fetching featured collections from Contentful...');
    const response = await fetchFromContentful('/entries', {
      content_type: 'featuredCollection',
      order: 'fields.displayOrder',
      include: '1',
    });

    if (!response?.items?.length) {
      console.log('No featured collections found in Contentful');
      return [];
    }

    console.log(`Found ${response.items.length} featured collections`);
    return response.items.map(transformContentfulFeaturedCollection);
  } catch (error) {
    console.error('Error fetching featured collections:', error);
    return [];
  }
}

// Get header content
export async function getHeader(): Promise<Header> {
  try {
    console.log('Fetching header content from Contentful...');
    // First try the original header content type
    let response;
    try {
      response = await fetchFromContentful('/entries', {
        content_type: 'header',
        limit: '1',
        include: '0'
      });
    } catch (error: any) {
      console.log('Error fetching header with content_type=header, trying simpleHeader...', error.message || 'Unknown error');
      response = { items: [] };
    }

    // If not found, try the simple header content type
    if (!response?.items?.length) {
      console.log('No header found with content_type=header, trying simpleHeader...');
      try {
        response = await fetchFromContentful('/entries', {
          content_type: 'simpleHeader',
          limit: '1',
          include: '0'
        });
      } catch (error: any) {
        console.log('Error fetching header with content_type=simpleHeader:', error.message || 'Unknown error');
        response = { items: [] };
      }
    }

    if (!response?.items?.length) {
      console.log('No header found in Contentful, using default header');
      // Return default header if no content found
      return {
        title: 'BendyKidz',
        navigationItems: [
          { label: 'Home', url: '/', order: 1 },
          { label: 'Resources', url: '/articles', order: 2 },
          { label: 'About', url: '/about', order: 3 },
          { label: 'Contact', url: '/contact', order: 4 }
        ],
        searchPlaceholder: 'Search resources and articles...'
      };
    }

    console.log('Found header in Contentful, transforming data');
    return transformContentfulHeader(response.items[0]);
  } catch (error: any) {
    console.error('Error fetching header content:', error);
    // Return default header if error
    return {
      title: 'BendyKidz',
      navigationItems: [
        { label: 'Home', url: '/', order: 1 },
        { label: 'Resources', url: '/articles', order: 2 },
        { label: 'About', url: '/about', order: 3 },
        { label: 'Contact', url: '/contact', order: 4 }
      ],
      searchPlaceholder: 'Search resources and articles...'
    };
  }
}

// Get footer content
export async function getFooter(): Promise<Footer> {
  try {
    console.log('Fetching footer content from Contentful...');
    // First try the original footer content type
    let response;
    try {
      response = await fetchFromContentful('/entries', {
        content_type: 'footer',
        limit: '1',
        include: '0'
      });
    } catch (error: any) {
      console.log('Error fetching footer with content_type=footer, trying simpleFooter...', error.message || 'Unknown error');
      response = { items: [] };
    }

    // If not found, try the simple footer content type
    if (!response?.items?.length) {
      console.log('No footer found with content_type=footer, trying simpleFooter...');
      try {
        response = await fetchFromContentful('/entries', {
          content_type: 'simpleFooter',
          limit: '1',
          include: '0'
        });
      } catch (error: any) {
        console.log('Error fetching footer with content_type=simpleFooter:', error.message || 'Unknown error');
        response = { items: [] };
      }
    }

    if (!response?.items?.length) {
      console.log('No footer found in Contentful, using default footer');
      // Return default footer if no content found
      return {
        title: 'BendyKidz',
        description: 'Expert occupational therapy resources for parents to support their children\'s development through play-based activities.',
        socialLinks: [
          { platform: 'facebook', url: '#', icon: 'fab fa-facebook-f' },
          { platform: 'instagram', url: '#', icon: 'fab fa-instagram' },
          { platform: 'pinterest', url: '#', icon: 'fab fa-pinterest' },
          { platform: 'youtube', url: '#', icon: 'fab fa-youtube' }
        ],
        quickLinks: {
          title: 'Quick Links',
          links: [
            { label: 'Home', url: '/' },
            { label: 'About Us', url: '/about' },
            { label: 'Resources', url: '/articles' },
            { label: 'Articles', url: '/articles' },
            { label: 'Contact', url: '/contact' }
          ]
        },
        contactInfo: {
          title: 'Contact Us',
          address: '123 Therapy Lane\nWellness City, WC 12345',
          phone: '(555) 123-4567',
          email: 'info@bendykidz.com'
        },
        copyrightText: '© {year} BendyKidz. All rights reserved.',
        policies: [
          { label: 'Privacy Policy', url: '#' },
          { label: 'Terms of Service', url: '#' },
          { label: 'Cookie Policy', url: '#' }
        ]
      };
    }

    console.log('Found footer in Contentful, transforming data');
    return transformContentfulFooter(response.items[0]);
  } catch (error: any) {
    console.error('Error fetching footer content:', error);
    // Return default footer if error
    return {
      title: 'BendyKidz',
      description: 'Expert occupational therapy resources for parents to support their children\'s development through play-based activities.',
      socialLinks: [
        { platform: 'facebook', url: '#', icon: 'fab fa-facebook-f' },
        { platform: 'instagram', url: '#', icon: 'fab fa-instagram' },
        { platform: 'pinterest', url: '#', icon: 'fab fa-pinterest' },
        { platform: 'youtube', url: '#', icon: 'fab fa-youtube' }
      ],
      quickLinks: {
        title: 'Quick Links',
        links: [
          { label: 'Home', url: '/' },
          { label: 'About Us', url: '/about' },
          { label: 'Resources', url: '/articles' },
          { label: 'Articles', url: '/articles' },
          { label: 'Contact', url: '/contact' }
        ]
      },
      contactInfo: {
        title: 'Contact Us',
        address: '123 Therapy Lane\nWellness City, WC 12345',
        phone: '(555) 123-4567',
        email: 'info@bendykidz.com'
      },
      copyrightText: '© {year} BendyKidz. All rights reserved.',
      policies: [
        { label: 'Privacy Policy', url: '#' },
        { label: 'Terms of Service', url: '#' },
        { label: 'Cookie Policy', url: '#' }
      ]
    };
  }
}

// Helper functions to transform Contentful data
function transformContentfulArticle(item: any, assetResponse?: any, authorsResponse?: any): Article {
  const fields = item.fields;
  const featuredImageAssetId = fields.featuredImage?.['en-US']?.sys?.id || fields.featuredImage?.sys?.id;
  
  // Debug for author relationship
  console.log("Article author field:", JSON.stringify(fields.author, null, 2));
  
  // Get author information
  let authorId = '';
  let authorName = 'Unknown Author';
  let authorAvatarUrl = '';
  
  // First try to find the linked entry in the includes
  const authorEntryId = fields.author?.['en-US']?.sys?.id || fields.author?.sys?.id;
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
      // Access the name field correctly - it could be localized in 'en-US'
      authorName = directAuthor.fields?.name?.['en-US'] || directAuthor.fields?.name || 'Unknown Author';
      console.log(`Set author name to: ${authorName}`);
      
      // Get avatar ID - handle both localized and direct versions
      const authorAvatarId = directAuthor.fields?.avatar?.['en-US']?.sys?.id || 
                             directAuthor.fields?.avatar?.sys?.id;
      
      console.log(`Found author avatar ID: ${authorAvatarId}`);
      
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

function transformContentfulTestimonialsSection(item: any): TestimonialsSection {
  const fields = item.fields;
  
  return {
    title: fields.title?.['en-US'] || fields.title || "Every Child Can Thrive with the Right Support",
    subtitle: fields.subtitle?.['en-US'] || fields.subtitle || ""
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

function transformContentfulHeroSection(item: any): HeroSection {
  const fields = item.fields;
  
  // Extract image id, handling both localized and direct fields
  const imageId = fields.image?.sys?.id || fields.image?.['en-US']?.sys?.id;
  console.log('Hero section image ID:', imageId);
  
  // Try to find the image asset in the response includes
  const imageAsset = findLinkedAsset(item, imageId);
  console.log('Hero section image asset found:', !!imageAsset);
  
  // Log the full image asset details if found
  if (imageAsset) {
    console.log('Hero section image asset fields:', JSON.stringify(imageAsset.fields, null, 2));
  }
  
  // Extract image URL considering both direct and localized fields
  let imageUrl = '';
  if (imageAsset) {
    // First check for localized URL
    if (imageAsset.fields?.file?.['en-US']?.url) {
      imageUrl = 'https:' + imageAsset.fields.file['en-US'].url;
    } 
    // Then fall back to direct URL
    else if (imageAsset.fields?.file?.url) {
      imageUrl = 'https:' + imageAsset.fields.file.url;
    }
  }
  
  console.log('Final hero section image URL:', imageUrl);
  
  // Create the Hero section object
  const heroSection = {
    title: fields.title?.['en-US'] || fields.title || '',
    subtitle: fields.subtitle?.['en-US'] || fields.subtitle || '',
    image: imageUrl,
    imageAlt: fields.imageAlt?.['en-US'] || fields.imageAlt || '',
    primaryButtonText: fields.primaryButtonText?.['en-US'] || fields.primaryButtonText || 'Learn More',
    primaryButtonLink: fields.primaryButtonLink?.['en-US'] || fields.primaryButtonLink || '/articles',
    primaryButtonColor: fields.primaryButtonColor?.['en-US'] || fields.primaryButtonColor || '#7C3AED',
    primaryButtonTextColor: fields.primaryButtonTextColor?.['en-US'] || fields.primaryButtonTextColor || '#FFFFFF',
    secondaryButtonText: fields.secondaryButtonText?.['en-US'] || fields.secondaryButtonText || 'About Us',
    secondaryButtonLink: fields.secondaryButtonLink?.['en-US'] || fields.secondaryButtonLink || '/about',
    secondaryButtonColor: fields.secondaryButtonColor?.['en-US'] || fields.secondaryButtonColor || '#FFFFFF',
    secondaryButtonTextColor: fields.secondaryButtonTextColor?.['en-US'] || fields.secondaryButtonTextColor || '#7C3AED'
  };
  
  console.log('Transformed hero section:', heroSection);
  return heroSection;
}

function transformContentfulSiteStats(item: any): SiteStats {
  const fields = item.fields;
  
  return {
    resources: fields.resources || 0,
    specialists: fields.specialists || 0,
    activityTypes: fields.activityTypes || 0
  };
}

function transformContentfulFeaturedCollection(item: any): FeaturedCollection {
  const fields = item.fields;
  
  return {
    id: item.sys.id,
    title: fields.title?.['en-US'] || fields.title || '',
    description: fields.description?.['en-US'] || fields.description || '',
    displayOrder: fields.displayOrder?.['en-US'] || fields.displayOrder || 1,
    filterType: fields.filterType?.['en-US'] || fields.filterType || 'featured',
    filterValue: fields.filterValue?.['en-US'] || fields.filterValue || '',
    maxItems: fields.maxItems?.['en-US'] || fields.maxItems || 3,
    active: fields.active?.['en-US'] || fields.active || true
  };
}

function transformContentfulHeader(item: any): Header {
  const fields = item.fields;
  let contentType = item.sys.contentType?.sys?.id;
  console.log(`Transforming header with content type: ${contentType}`);
  
  // Handle simplified header content type
  if (contentType === 'simpleHeader') {
    const title = fields.title?.['en-US'] || fields.title || 'BendyKidz';
    const searchPlaceholder = fields.searchPlaceholder?.['en-US'] || fields.searchPlaceholder || 'Search resources and articles...';
    // Parse navigation items from JSON string
    let navigationItems = [
      { label: 'Home', url: '/', order: 1 },
      { label: 'Resources', url: '/articles', order: 2 },
      { label: 'About', url: '/about', order: 3 },
      { label: 'Contact', url: '/contact', order: 4 }
    ];
    
    try {
      const navItemsJson = fields.navItems?.['en-US'] || fields.navItems;
      if (navItemsJson) {
        if (typeof navItemsJson === 'string') {
          navigationItems = JSON.parse(navItemsJson);
        } else if (Array.isArray(navItemsJson)) {
          navigationItems = navItemsJson;
        }
      }
    } catch (error) {
      console.error('Error parsing navigation items JSON:', error);
    }
    
    return {
      title,
      logoUrl: '',
      navigationItems,
      searchPlaceholder
    };
  }
  
  // Handle regular header content type
  return {
    title: fields.title?.['en-US'] || fields.title || 'BendyKidz',
    logoUrl: fields.logoUrl?.['en-US'] || fields.logoUrl || '',
    navigationItems: fields.navigationItems?.['en-US'] || fields.navigationItems || [
      { label: 'Home', url: '/', order: 1 },
      { label: 'Resources', url: '/articles', order: 2 },
      { label: 'About', url: '/about', order: 3 },
      { label: 'Contact', url: '/contact', order: 4 }
    ],
    searchPlaceholder: fields.searchPlaceholder?.['en-US'] || fields.searchPlaceholder || 'Search resources and articles...'
  };
}

function transformContentfulFooter(item: any): Footer {
  const fields = item.fields;
  let contentType = item.sys.contentType?.sys?.id;
  console.log(`Transforming footer with content type: ${contentType}`);
  
  // Handle simplified footer content type
  if (contentType === 'simpleFooter') {
    const title = fields.title?.['en-US'] || fields.title || 'BendyKidz';
    const description = fields.description?.['en-US'] || fields.description || 'Expert occupational therapy resources for parents to support their children\'s development through play-based activities.';
    const copyrightText = fields.copyrightText?.['en-US'] || fields.copyrightText || '© {year} BendyKidz. All rights reserved.';
    
    // Default values
    let socialLinks = [
      { platform: 'facebook', url: '#', icon: 'fab fa-facebook-f' },
      { platform: 'instagram', url: '#', icon: 'fab fa-instagram' },
      { platform: 'pinterest', url: '#', icon: 'fab fa-pinterest' },
      { platform: 'youtube', url: '#', icon: 'fab fa-youtube' }
    ];
    
    let quickLinks = {
      title: 'Quick Links',
      links: [
        { label: 'Home', url: '/' },
        { label: 'About Us', url: '/about' },
        { label: 'Resources', url: '/articles' },
        { label: 'Articles', url: '/articles' },
        { label: 'Contact', url: '/contact' }
      ]
    };
    
    let contactInfo = {
      title: 'Contact Us',
      address: '123 Therapy Lane\nWellness City, WC 12345',
      phone: '(555) 123-4567',
      email: 'info@bendykidz.com'
    };
    
    let policies = [
      { label: 'Privacy Policy', url: '#' },
      { label: 'Terms of Service', url: '#' },
      { label: 'Cookie Policy', url: '#' }
    ];
    
    // Parse JSON string fields
    try {
      const socialLinksJson = fields.socialLinksJson?.['en-US'] || fields.socialLinksJson;
      if (socialLinksJson && typeof socialLinksJson === 'string') {
        socialLinks = JSON.parse(socialLinksJson);
      }
    } catch (error) {
      console.error('Error parsing socialLinksJson:', error);
    }
    
    try {
      const quickLinksJson = fields.quickLinksJson?.['en-US'] || fields.quickLinksJson;
      if (quickLinksJson && typeof quickLinksJson === 'string') {
        quickLinks = JSON.parse(quickLinksJson);
      }
    } catch (error) {
      console.error('Error parsing quickLinksJson:', error);
    }
    
    try {
      const contactInfoJson = fields.contactInfoJson?.['en-US'] || fields.contactInfoJson;
      if (contactInfoJson && typeof contactInfoJson === 'string') {
        contactInfo = JSON.parse(contactInfoJson);
      }
    } catch (error) {
      console.error('Error parsing contactInfoJson:', error);
    }
    
    try {
      const policiesJson = fields.policiesJson?.['en-US'] || fields.policiesJson;
      if (policiesJson && typeof policiesJson === 'string') {
        policies = JSON.parse(policiesJson);
      }
    } catch (error) {
      console.error('Error parsing policiesJson:', error);
    }
    
    return {
      title,
      description,
      socialLinks,
      quickLinks,
      contactInfo,
      copyrightText,
      policies
    };
  }
  
  // Handle regular footer content type
  return {
    title: fields.title?.['en-US'] || fields.title || 'BendyKidz',
    description: fields.description?.['en-US'] || fields.description || 'Expert occupational therapy resources for parents to support their children\'s development through play-based activities.',
    socialLinks: fields.socialLinks?.['en-US'] || fields.socialLinks || [
      { platform: 'facebook', url: '#', icon: 'fab fa-facebook-f' },
      { platform: 'instagram', url: '#', icon: 'fab fa-instagram' },
      { platform: 'pinterest', url: '#', icon: 'fab fa-pinterest' },
      { platform: 'youtube', url: '#', icon: 'fab fa-youtube' }
    ],
    quickLinks: fields.quickLinks?.['en-US'] || fields.quickLinks || {
      title: 'Quick Links',
      links: [
        { label: 'Home', url: '/' },
        { label: 'About Us', url: '/about' },
        { label: 'Resources', url: '/articles' },
        { label: 'Articles', url: '/articles' },
        { label: 'Contact', url: '/contact' }
      ]
    },
    contactInfo: fields.contactInfo?.['en-US'] || fields.contactInfo || {
      title: 'Contact Us',
      address: '123 Therapy Lane\nWellness City, WC 12345',
      phone: '(555) 123-4567',
      email: 'info@bendykidz.com'
    },
    copyrightText: fields.copyrightText?.['en-US'] || fields.copyrightText || '© {year} BendyKidz. All rights reserved.',
    policies: fields.policies?.['en-US'] || fields.policies || [
      { label: 'Privacy Policy', url: '#' },
      { label: 'Terms of Service', url: '#' },
      { label: 'Cookie Policy', url: '#' }
    ]
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

// Get contact page information
export async function getContactPageInfo(): Promise<ContactPageInfo | null> {
  try {
    console.log('Fetching contact page content from Contentful...');
    let contactInfo = null;
    
    const response = await fetchFromContentful('/entries', {
      content_type: 'contactInfo',
      limit: '1',
      include: '1'
    });
    
    if (response.items && response.items.length > 0) {
      console.log('Found contact info in Contentful, transforming data');
      contactInfo = transformContentfulContactInfo(response.items[0]);
      return contactInfo;
    }
    
    // Return fallback data if nothing was found
    console.log('No contact info found in Contentful, using fallback data');
    return {
      title: 'Contact Us',
      subtitle: 'Have questions about occupational therapy for your child? We\'re here to help.',
      officeLocation: '123 Therapy Lane\nWellness City, WC 12345',
      phoneNumber: '(555) 123-4567',
      email: 'info@bendykidz.com',
      officeHours: 'Monday - Friday: 9:00 AM - 5:00 PM\nSaturday: 10:00 AM - 2:00 PM',
      messageFormTitle: 'Send Us a Message',
      socialFacebook: 'https://facebook.com/bendykidz',
      socialTwitter: 'https://twitter.com/bendykidz',
      socialInstagram: 'https://instagram.com/bendykidz',
      socialPinterest: 'https://pinterest.com/bendykidz',
      mapTitle: 'Find Us',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.3059353029!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2suk!4v1619471123295!5m2!1sen!2suk'
    };
  } catch (error) {
    console.error('Error fetching contact page content:', error);
    
    // Return fallback data on error
    return {
      title: 'Contact Us',
      subtitle: 'Have questions about occupational therapy for your child? We\'re here to help.',
      officeLocation: '123 Therapy Lane\nWellness City, WC 12345',
      phoneNumber: '(555) 123-4567',
      email: 'info@bendykidz.com',
      officeHours: 'Monday - Friday: 9:00 AM - 5:00 PM\nSaturday: 10:00 AM - 2:00 PM',
      messageFormTitle: 'Send Us a Message',
      socialFacebook: 'https://facebook.com/bendykidz',
      socialTwitter: 'https://twitter.com/bendykidz',
      socialInstagram: 'https://instagram.com/bendykidz',
      socialPinterest: 'https://pinterest.com/bendykidz',
      mapTitle: 'Find Us',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.3059353029!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2suk!4v1619471123295!5m2!1sen!2suk'
    };
  }
}

// Transform Contentful contact info to our model
function transformContentfulContactInfo(item: any): ContactPageInfo {
  const fields = item.fields;
  
  return {
    title: fields.title?.['en-US'] || fields.title || 'Contact Us',
    subtitle: fields.subtitle?.['en-US'] || fields.subtitle || 'Have questions about occupational therapy for your child? We\'re here to help.',
    officeLocation: fields.officeLocation?.['en-US'] || fields.officeLocation || '123 Therapy Lane\nWellness City, WC 12345',
    phoneNumber: fields.phoneNumber?.['en-US'] || fields.phoneNumber || '(555) 123-4567',
    email: fields.email?.['en-US'] || fields.email || 'info@bendykidz.com',
    officeHours: fields.officeHours?.['en-US'] || fields.officeHours || 'Monday - Friday: 9:00 AM - 5:00 PM\nSaturday: 10:00 AM - 2:00 PM',
    messageFormTitle: fields.messageFormTitle?.['en-US'] || fields.messageFormTitle || 'Send Us a Message',
    socialFacebook: fields.socialFacebook?.['en-US'] || fields.socialFacebook || 'https://facebook.com/bendykidz',
    socialTwitter: fields.socialTwitter?.['en-US'] || fields.socialTwitter || 'https://twitter.com/bendykidz',
    socialInstagram: fields.socialInstagram?.['en-US'] || fields.socialInstagram || 'https://instagram.com/bendykidz',
    socialPinterest: fields.socialPinterest?.['en-US'] || fields.socialPinterest || 'https://pinterest.com/bendykidz',
    mapTitle: fields.mapTitle?.['en-US'] || fields.mapTitle || 'Find Us',
    mapEmbedUrl: fields.mapEmbedUrl?.['en-US'] || fields.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.3059353029!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2suk!4v1619471123295!5m2!1sen!2suk'
  };
}
