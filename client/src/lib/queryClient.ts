import { QueryClient, QueryFunction, QueryKey } from "@tanstack/react-query";
import {
  fallbackArticles,
  fallbackCategories,
  fallbackFeaturedArticles,
  fallbackTestimonials,
  fallbackAboutContent,
  fallbackTeamMembers,
  fallbackSiteStats,
  getRelatedArticlesFallback,
  getArticleBySlugFallback,
  getCategoryBySlugFallback,
  getArticlesByCategoryFallback
} from './fallbackData';

const API_FALLBACK_MAP: Record<string, any> = {
  '/api/articles': fallbackArticles,
  '/api/articles/featured': fallbackFeaturedArticles,
  '/api/categories': fallbackCategories,
  '/api/testimonials': fallbackTestimonials,
  '/api/about': fallbackAboutContent,
  '/api/team': fallbackTeamMembers,
  '/api/stats': fallbackSiteStats
};

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error(`Error making ${method} request to ${url}:`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    
    try {
      const res = await fetch(url, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      if (!res.ok) {
        // Handle the error by using fallback data
        return getFallbackData(url, [...queryKey]);
      }

      return await res.json();
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      // Use fallback data if fetch fails
      return getFallbackData(url, [...queryKey]);
    }
  };

function getFallbackData(url: string, queryKey: any[]) {
  console.log(`Using fallback data for ${url}`);
  
  // Check for direct URL matches
  if (API_FALLBACK_MAP[url]) {
    return API_FALLBACK_MAP[url];
  }
  
  // Handle articles by slug
  if (url.match(/^\/api\/articles\/[^/]+$/)) {
    const slug = url.split('/').pop();
    if (slug) {
      return getArticleBySlugFallback(slug);
    }
  }
  
  // Handle related articles
  if (url.match(/^\/api\/articles\/[^/]+\/related$/)) {
    const slug = url.split('/')[3];
    
    if (slug) {
      const article = getArticleBySlugFallback(slug);
      if (article) {
        return getRelatedArticlesFallback(article.id, article.category.id);
      }
    }
  }
  
  // Handle categories by slug
  if (url.match(/^\/api\/categories\/[^/]+$/)) {
    const slug = url.split('/').pop();
    if (slug) {
      return getCategoryBySlugFallback(slug);
    }
  }
  
  // Handle articles by category
  if (url.match(/^\/api\/categories\/[^/]+\/articles$/)) {
    const slug = url.split('/')[3];
    if (slug) {
      const category = getCategoryBySlugFallback(slug);
      if (category) {
        return getArticlesByCategoryFallback(category.id);
      }
    }
  }
  
  // Return an empty array or object as fallback
  return Array.isArray(API_FALLBACK_MAP['/api/articles']) ? [] : {};
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
