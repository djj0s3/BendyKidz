import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Article, FeaturedCollection } from "@shared/schema";
import ArticleCard from "./ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getQueryFn } from "@/lib/queryClient";

interface FeaturedSectionProps {
  collection: FeaturedCollection;
  articles: Article[];
  isLoading: boolean;
}

const FeaturedSection = ({ collection, articles, isLoading }: FeaturedSectionProps) => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Calculate max items for pagination
  const itemsPerPage = Math.min(collection.maxItems, 3);
  const totalSlides = Math.ceil((articles?.length || 0) / itemsPerPage);
  
  const handleSlideChange = (index: number) => {
    setActiveSlide(index);
  };

  const renderArticles = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(itemsPerPage)].map((_, i) => (
            <div key={i} className="bg-neutral-light rounded-lg overflow-hidden shadow-md">
              <Skeleton className="w-full h-48" />
              <div className="p-6">
                <Skeleton className="h-6 w-24 mb-3" />
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <div className="flex items-center">
                  <Skeleton className="h-6 w-6 rounded-full mr-2" />
                  <Skeleton className="h-4 w-20 mr-4" />
                  <Skeleton className="h-4 w-24 mr-4" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!articles || articles.length === 0) {
      return (
        <div className="text-center p-8">
          <p className="text-gray-500">No articles available in this collection yet.</p>
        </div>
      );
    }

    const startIndex = activeSlide * itemsPerPage;
    const displayedArticles = articles.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    );
  };

  return (
    <div className="mb-16 last:mb-0">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-heading">{collection.title}</h2>
          {collection.description && (
            <p className="text-gray-600 mt-1">{collection.description}</p>
          )}
        </div>
        {totalSlides > 1 && (
          <div className="space-x-1">
            {[...Array(totalSlides)].map((_, index) => (
              <button 
                key={index}
                className={`w-3 h-3 rounded-full ${index === activeSlide ? 'bg-primary' : 'bg-gray-300'} focus:outline-none`}
                onClick={() => handleSlideChange(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      
      {renderArticles()}
    </div>
  );
};

export default function FeaturedArticles() {
  // Fetch the featured collections
  const { data: collections, isLoading: collectionsLoading } = useQuery<FeaturedCollection[]>({
    queryKey: ['/api/featured-collections'],
  });
  
  // Fetch all articles for filtering
  const { data: allArticles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
  });

  // Fallback to original featured articles if no collections
  const { data: featuredArticles, isLoading: featuredLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles/featured'],
  });

  // Final loading state
  const isLoading = collectionsLoading || articlesLoading;

  // Filter articles based on collection settings
  const getFilteredArticles = (collection: FeaturedCollection): Article[] => {
    if (!allArticles) return [];
    
    let filteredArticles: Article[] = [];
    
    switch (collection.filterType) {
      case 'featured':
        // If we're using the featured filter, just use the articles from the featured endpoint
        // as fallback if no article has the 'featured' tag
        filteredArticles = featuredArticles || allArticles;
        break;
      case 'category':
        // Filter by category ID
        filteredArticles = allArticles.filter(article => article.category.id === collection.filterValue);
        break;
      case 'tag':
        // Filter by tag
        filteredArticles = allArticles.filter(article => article.tags.includes(collection.filterValue));
        break;
      default:
        // Use all articles as fallback
        filteredArticles = allArticles;
    }
    
    // Return limited number of articles
    return filteredArticles.slice(0, collection.maxItems);
  };

  // Get active collections
  const activeCollections = collections?.filter(c => c.active) || [];
  
  // Sort by display order
  const sortedCollections = [...activeCollections].sort((a, b) => a.displayOrder - b.displayOrder);

  // Determine which view to render
  const shouldUseFallback = isLoading || !collections || collections.length === 0;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {shouldUseFallback ? (
          <FeaturedSection 
            collection={{
              id: 'default',
              title: 'Featured This Month',
              description: '',
              displayOrder: 1,
              filterType: 'featured',
              filterValue: '',
              maxItems: 3,
              active: true
            }}
            articles={featuredArticles || []}
            isLoading={featuredLoading}
          />
        ) : (
          sortedCollections.map(collection => (
            <FeaturedSection 
              key={collection.id}
              collection={collection}
              articles={getFilteredArticles(collection)}
              isLoading={isLoading}
            />
          ))
        )}
        
        <div className="flex justify-center mt-10">
          <Link href="/articles" className="btn border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-2 px-6 rounded-full inline-block transition-colors">
            View All Resources
          </Link>
        </div>
      </div>
    </section>
  );
}
