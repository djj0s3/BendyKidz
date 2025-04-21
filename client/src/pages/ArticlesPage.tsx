import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Article } from "@shared/schema";
import ArticleCard from "@/components/ArticleCard";
import CategoryFilter from "@/components/CategoryFilter";
import { ArticleCardSkeleton } from "@/components/ui/loading";

export default function ArticlesPage() {
  const [, params] = useLocation();
  const searchParams = new URLSearchParams(params);
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'all';
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
  });
  
  // Update search term when URL search parameter changes
  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);
  
  // Handle category filter change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  // Filter articles based on selected category and search term
  const filteredArticles = articles?.filter((article) => {
    const matchesCategory = selectedCategory === 'all' || article.category.slug === selectedCategory;
    const matchesSearch = !searchTerm || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading mb-2">
            {searchTerm 
              ? `Search Results for "${searchTerm}"` 
              : selectedCategory !== 'all' 
                ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace('-', ' ')} Resources` 
                : 'All Occupational Therapy Resources'
            }
          </h1>
          <p className="text-gray-600">
            {searchTerm 
              ? `Found ${filteredArticles?.length || 0} resources matching your search` 
              : 'Browse our collection of expert-created resources for parents'
            }
          </p>
        </div>
        
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredArticles && filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-bold mb-2">No Results Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? 'We couldn\'t find any resources matching your search term.' 
              : 'No resources available in this category yet.'
            }
          </p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="btn-primary"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
}
