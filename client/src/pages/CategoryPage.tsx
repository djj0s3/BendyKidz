import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category, Article } from "@shared/schema";
import ArticleCard from "@/components/ArticleCard";
import { ArticleCardSkeleton } from "@/components/ui/loading";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function CategoryPage() {
  const [match, params] = useRoute("/category/:slug");
  const slug = params?.slug || "";

  const { data: category, isLoading: categoryLoading } = useQuery<Category>({
    queryKey: [`/api/categories/${slug}`],
    enabled: !!slug,
  });

  const { data: articles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: [`/api/categories/${slug}/articles`],
    enabled: !!slug,
  });

  const isLoading = categoryLoading || articlesLoading;

  // Get the icon based on category slug
  const getCategoryIcon = (slug: string) => {
    const iconMap: Record<string, string> = {
      'fine-motor': 'fa-hand-paper',
      'gross-motor': 'fa-running',
      'sensory': 'fa-brain',
      'social-skills': 'fa-comments',
      'daily-living': 'fa-calendar-check',
    };
    
    return iconMap[slug] || 'fa-puzzle-piece';
  };

  // Get color classes based on category slug
  const getCategoryColorClass = (slug: string) => {
    const colorMap: Record<string, { bg: string, text: string }> = {
      'fine-motor': { bg: 'bg-secondary', text: 'text-secondary' },
      'gross-motor': { bg: 'bg-primary', text: 'text-primary' },
      'sensory': { bg: 'bg-accent', text: 'text-accent' },
      'social-skills': { bg: 'bg-primary', text: 'text-primary' },
      'daily-living': { bg: 'bg-secondary', text: 'text-secondary' },
    };
    
    return colorMap[slug] || { bg: 'bg-primary', text: 'text-primary' };
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mb-16 text-center">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-full max-w-2xl mx-auto mb-8" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <i className="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="mb-6">The category you're looking for doesn't exist or has been removed.</p>
        <Link href="/articles" className="btn-primary">
          Browse All Resources
        </Link>
      </div>
    );
  }

  const colorClasses = getCategoryColorClass(category.slug);

  return (
    <>
      {/* Category Header */}
      <section className={`py-16 ${colorClasses.bg} bg-opacity-10`}>
        <div className="container mx-auto px-4 text-center">
          <div className={`w-20 h-20 ${colorClasses.bg} bg-opacity-20 ${colorClasses.text} rounded-full flex items-center justify-center mx-auto mb-6`}>
            <i className={`fas ${getCategoryIcon(category.slug)} text-3xl`}></i>
          </div>
          <h1 className="text-3xl font-bold font-heading mb-4">{category.name}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">{category.description}</p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold font-heading mb-8">
            {articles && articles.length > 0 
              ? `${articles.length} Resources in ${category.name}`
              : `Resources in ${category.name}`
            }
          </h2>
          
          {articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-neutral-light rounded-lg">
              <i className={`fas ${getCategoryIcon(category.slug)} text-5xl ${colorClasses.text} opacity-30 mb-4`}></i>
              <h3 className="text-xl font-bold mb-2">No Resources Yet</h3>
              <p className="text-gray-600 mb-6">We're working on adding resources to this category.</p>
              <Link href="/articles" className="btn-primary">
                Browse All Resources
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
