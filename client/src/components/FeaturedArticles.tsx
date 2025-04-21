import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Article } from "@shared/schema";
import ArticleCard from "./ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedArticles() {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles/featured'],
  });

  const totalSlides = Math.ceil((articles?.length || 0) / 3);
  
  const handleSlideChange = (index: number) => {
    setActiveSlide(index);
  };

  const renderArticles = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
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
          <p className="text-gray-500">No featured articles available yet.</p>
        </div>
      );
    }

    const startIndex = activeSlide * 3;
    const displayedArticles = articles.slice(startIndex, startIndex + 3);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold font-heading">Featured This Month</h2>
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
        
        <div className="flex justify-center mt-10">
          <Link href="/articles" className="btn border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-2 px-6 rounded-full inline-block transition-colors">
            View All Resources
          </Link>
        </div>
      </div>
    </section>
  );
}
