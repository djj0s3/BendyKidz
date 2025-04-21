import { Article, Category, Testimonial, AboutContent, TeamMember, SiteStats, RelatedArticle } from '@shared/schema';

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID || import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN || import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;

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
    const response = await fetch(`${API_BASE_URL}${endpoint}?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Contentful API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching from Contentful:', error);
    throw error;
  }
}

// Get all articles
export async function getArticles(): Promise<Article[]> {
  const response = await fetchFromContentful('/entries', {
    content_type: 'article',
    include: 2, // Include 2 levels of linked entries (for authors and categories)
    order: '-sys.createdAt' // Sort by newest first
  });
  
  // Transform Contentful response to our Article model
  return response.items.map(transformContentfulArticle);
}

// Get featured articles
export async function getFeaturedArticles(): Promise<Article[]> {
  const response = await fetchFromContentful('/entries', {
    content_type: 'article',
    'fields.featured': 'true',
    include: 2,
    order: '-sys.createdAt'
  });
  
  return response.items.map(transformContentfulArticle);
}

// Get a single article by slug
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const response = await fetchFromContentful('/entries', {
    content_type: 'article',
    'fields.slug': slug,
    include: 2
  });
  
  if (response.items.length === 0) {
    return null;
  }
  
  return transformContentfulArticle(response.items[0]);
}

// Get related articles
export async function getRelatedArticles(articleId: string, categoryId: string): Promise<RelatedArticle[]> {
  const response = await fetchFromContentful('/entries', {
    content_type: 'article',
    'fields.category.sys.id': categoryId,
    include: 1,
    limit: 3
  });
  
  // Filter out the current article and transform
  return response.items
    .filter((item: any) => item.sys.id !== articleId)
    .map(transformContentfulRelatedArticle);
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  const response = await fetchFromContentful('/entries', {
    content_type: 'category',
    order: 'fields.name'
  });
  
  return response.items.map(transformContentfulCategory);
}

// Get a single category by slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const response = await fetchFromContentful('/entries', {
    content_type: 'category',
    'fields.slug': slug
  });
  
  if (response.items.length === 0) {
    return null;
  }
  
  return transformContentfulCategory(response.items[0]);
}

// Get articles by category
export async function getArticlesByCategory(categoryId: string): Promise<Article[]> {
  const response = await fetchFromContentful('/entries', {
    content_type: 'article',
    'fields.category.sys.id': categoryId,
    include: 2,
    order: '-sys.createdAt'
  });
  
  return response.items.map(transformContentfulArticle);
}

// Get testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  const response = await fetchFromContentful('/entries', {
    content_type: 'testimonial',
    order: '-sys.createdAt'
  });
  
  return response.items.map(transformContentfulTestimonial);
}

// Get about page content
export async function getAboutContent(): Promise<AboutContent | null> {
  const response = await fetchFromContentful('/entries', {
    content_type: 'aboutPage',
    include: 1
  });
  
  if (response.items.length === 0) {
    return null;
  }
  
  return transformContentfulAboutContent(response.items[0]);
}

// Get team members
export async function getTeamMembers(): Promise<TeamMember[]> {
  const response = await fetchFromContentful('/entries', {
    content_type: 'teamMember',
    order: 'fields.order'
  });
  
  return response.items.map(transformContentfulTeamMember);
}

// Get site statistics
export async function getSiteStats(): Promise<SiteStats | null> {
  const response = await fetchFromContentful('/entries', {
    content_type: 'siteStats'
  });
  
  if (response.items.length === 0) {
    return null;
  }
  
  return transformContentfulSiteStats(response.items[0]);
}

// Helper functions to transform Contentful data
function transformContentfulArticle(item: any): Article {
  const fields = item.fields;
  const authorEntry = findLinkedEntry(item, fields.author?.sys?.id);
  const categoryEntry = findLinkedEntry(item, fields.category?.sys?.id);
  const featuredImageAsset = findLinkedAsset(item, fields.featuredImage?.sys?.id);
  
  return {
    id: item.sys.id,
    title: fields.title || '',
    slug: fields.slug || '',
    excerpt: fields.excerpt || '',
    content: fields.content || '',
    featuredImage: featuredImageAsset?.fields?.file?.url || '',
    publishedDate: fields.publishedDate || item.sys.createdAt,
    readingTime: fields.readingTime || 5,
    author: {
      id: authorEntry?.sys?.id || '',
      name: authorEntry?.fields?.name || 'Unknown Author',
      avatar: findLinkedAsset(item, authorEntry?.fields?.avatar?.sys?.id)?.fields?.file?.url || ''
    },
    category: {
      id: categoryEntry?.sys?.id || '',
      name: categoryEntry?.fields?.name || 'Uncategorized',
      slug: categoryEntry?.fields?.slug || 'uncategorized'
    },
    tags: fields.tags || []
  };
}

function transformContentfulRelatedArticle(item: any): RelatedArticle {
  const fields = item.fields;
  const featuredImageAsset = findLinkedAsset(item, fields.featuredImage?.sys?.id);
  
  return {
    id: item.sys.id,
    title: fields.title || '',
    slug: fields.slug || '',
    excerpt: fields.excerpt || '',
    featuredImage: featuredImageAsset?.fields?.file?.url || ''
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
    avatar: findLinkedAsset(item, fields.avatar?.sys?.id)?.fields?.file?.url || ''
  };
}

function transformContentfulAboutContent(item: any): AboutContent {
  const fields = item.fields;
  
  return {
    title: fields.title || '',
    subtitle: fields.subtitle || '',
    description: fields.description || '',
    mission: fields.mission || '',
    image: findLinkedAsset(item, fields.image?.sys?.id)?.fields?.file?.url || '',
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
    avatar: findLinkedAsset(item, fields.avatar?.sys?.id)?.fields?.file?.url || ''
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
  if (!assetId || !response.includes || !response.includes.Asset) {
    return null;
  }
  
  return response.includes.Asset.find((asset: any) => asset.sys.id === assetId);
}
