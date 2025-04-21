import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Article, RelatedArticle } from "@shared/schema";
import { format } from "date-fns";
import NewsletterSignup from "@/components/NewsletterSignup";
import { ArticleDetailSkeleton, ArticleCardSkeleton } from "@/components/ui/loading";

export default function ArticleDetailPage() {
  const [match, params] = useRoute("/article/:slug");
  const slug = params?.slug || "";

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: [`/api/articles/${slug}`],
    enabled: !!slug,
  });

  const { data: relatedArticles, isLoading: relatedLoading } = useQuery<RelatedArticle[]>({
    queryKey: [`/api/articles/${slug}/related`],
    enabled: !!slug,
  });

  if (isLoading) {
    return <ArticleDetailSkeleton />;
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <i className="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
        <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
        <p className="mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <Link href="/articles" className="btn-primary">
          Browse All Articles
        </Link>
      </div>
    );
  }

  return (
    <>
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Category Badge */}
          <div className="mb-4">
            <Link 
              href={`/category/${article.category.slug}`}
              className={`inline-block text-sm font-semibold px-3 py-1 rounded-full
                ${article.category.slug === 'fine-motor' ? 'bg-secondary bg-opacity-20 text-secondary' : 
                article.category.slug === 'gross-motor' ? 'bg-primary bg-opacity-20 text-primary' : 
                article.category.slug === 'sensory' ? 'bg-accent bg-opacity-20 text-accent' : 
                'bg-primary bg-opacity-20 text-primary'}`}
            >
              {article.category.name}
            </Link>
          </div>
          
          {/* Article Title */}
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-6">{article.title}</h1>
          
          {/* Author and Publication Info */}
          <div className="flex items-center mb-8">
            <img 
              src={article.author.avatar} 
              alt={article.author.name} 
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <p className="font-bold font-heading">{article.author.name}</p>
              <div className="text-sm text-gray-500 flex flex-wrap gap-x-4">
                <span>{format(new Date(article.publishedDate), 'MMMM d, yyyy')}</span>
                <span>{article.readingTime} min read</span>
              </div>
            </div>
          </div>
          
          {/* Featured Image */}
          <div className="mb-8">
            <img 
              src={article.featuredImage} 
              alt={article.title} 
              className="w-full h-auto rounded-lg"
            />
          </div>
          
          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
      
      {/* Share Buttons */}
      <div className="bg-gray-50 py-6 border-t border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between">
            <p className="font-bold font-heading mb-3 sm:mb-0">Share this article:</p>
            <div className="flex space-x-4">
              <button className="w-10 h-10 flex items-center justify-center bg-[#3b5998] text-white rounded-full hover:opacity-90 transition-opacity">
                <i className="fab fa-facebook-f"></i>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-[#1da1f2] text-white rounded-full hover:opacity-90 transition-opacity">
                <i className="fab fa-twitter"></i>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-[#0077b5] text-white rounded-full hover:opacity-90 transition-opacity">
                <i className="fab fa-linkedin-in"></i>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-[#25D366] text-white rounded-full hover:opacity-90 transition-opacity">
                <i className="fab fa-whatsapp"></i>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors">
                <i className="fas fa-envelope"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Articles */}
      {relatedArticles && relatedArticles.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold font-heading mb-8 text-center">Related Articles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedLoading ? (
                [1, 2, 3].map((i) => <ArticleCardSkeleton key={i} />)
              ) : (
                relatedArticles.map((article) => (
                  <div key={article.id} className="bg-neutral-light rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                    <Link href={`/article/${article.slug}`}>
                      <img 
                        src={article.featuredImage} 
                        alt={article.title} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <h3 className="text-xl font-bold font-heading mb-3 hover:text-primary transition-colors">{article.title}</h3>
                        <p className="text-sm text-gray-600">{article.excerpt}</p>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}
      
      <NewsletterSignup />
    </>
  );
}
