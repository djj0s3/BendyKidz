import { Link } from "wouter";
import { Article } from "@shared/schema";
import { format } from "date-fns";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  // Create reliable fallback images with proper URLs
  const defaultArticleImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjN0MzQUVEIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4Ij5BcnRpY2xlIEltYWdlPC90ZXh0Pgo8L3N2Zz4=';
  const defaultAvatarImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiM3QzNBRUQiLz4KPHR5eHQgeD0iMTIiIHk9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIj5BPC90ZXh0Pgo8L3N2Zz4=';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = defaultArticleImage;
  };

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = defaultAvatarImage;
  };

  // Use fallback image if no valid URL is provided
  const articleImage = article.featuredImage && article.featuredImage.trim() !== '' ? article.featuredImage : defaultArticleImage;
  const avatarImage = article.author.avatar && article.author.avatar.trim() !== '' ? article.author.avatar : defaultAvatarImage;

  return (
    <div className="bg-neutral-light rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link href={`/article/${article.slug}`}>
        <img 
          src={articleImage} 
          alt={article.title} 
          className="w-full h-48 object-cover"
          onError={handleImageError}
        />
        <div className="p-6">
          <div className="flex items-center mb-3">
            <span 
              className={`text-xs font-semibold px-3 py-1 rounded-full
                ${article.category.slug === 'fine-motor' ? 'bg-secondary bg-opacity-20 text-secondary' : 
                article.category.slug === 'gross-motor' ? 'bg-primary bg-opacity-20 text-primary' : 
                article.category.slug === 'sensory' ? 'bg-accent bg-opacity-20 text-accent' : 
                'bg-primary bg-opacity-20 text-primary'}`}
            >
              {article.category.name}
            </span>
          </div>
          <h3 className="text-xl font-bold font-heading mb-2 hover:text-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {article.excerpt}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <div className="flex items-center mr-4">
              <img 
                src={avatarImage} 
                alt={article.author.name} 
                className="w-6 h-6 rounded-full mr-2"
                onError={handleAvatarError}
              />
              <span>{article.author.name}</span>
            </div>
            <div className="flex items-center mr-4">
              <i className="far fa-calendar mr-1"></i>
              <span>{format(new Date(article.publishedDate), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center">
              <i className="far fa-clock mr-1"></i>
              <span>{article.readingTime} min</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
