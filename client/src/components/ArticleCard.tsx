import { Link } from "wouter";
import { Article } from "@shared/schema";
import { format } from "date-fns";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://via.placeholder.com/400x200/7C3AED/FFFFFF?text=Article+Image';
  };

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://via.placeholder.com/24x24/7C3AED/FFFFFF?text=A';
  };

  return (
    <div className="bg-neutral-light rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link href={`/article/${article.slug}`}>
        <img 
          src={article.featuredImage} 
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
                src={article.author.avatar} 
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
