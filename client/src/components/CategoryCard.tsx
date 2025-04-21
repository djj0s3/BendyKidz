import { Link } from "wouter";
import { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  // Icon mapping
  const getIcon = (slug: string) => {
    const iconMap: Record<string, string> = {
      'fine-motor': 'fa-hand-paper',
      'gross-motor': 'fa-running',
      'sensory': 'fa-brain',
      'social-skills': 'fa-comments',
      'daily-living': 'fa-calendar-check',
      'emotional-regulation': 'fa-heart',
    };
    
    return iconMap[slug] || 'fa-puzzle-piece'; // Default icon
  };
  
  // Color mapping
  const getColorClass = (slug: string) => {
    const colorMap: Record<string, string> = {
      'fine-motor': 'text-primary group-hover:bg-primary',
      'gross-motor': 'text-secondary group-hover:bg-secondary',
      'sensory': 'text-accent group-hover:bg-accent',
      'social-skills': 'text-primary group-hover:bg-primary',
      'daily-living': 'text-secondary group-hover:bg-secondary',
      'emotional-regulation': 'text-accent group-hover:bg-accent',
    };
    
    return colorMap[slug] || 'text-primary group-hover:bg-primary'; // Default color
  };

  return (
    <Link href={`/category/${category.slug}`} className="group">
      <div className="bg-neutral-light rounded-lg p-6 h-full shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
        <div className={`w-14 h-14 bg-opacity-10 rounded-full flex items-center justify-center mb-4 ${getColorClass(category.slug)} bg-current group-hover:text-white transition-colors`}>
          <i className={`fas ${getIcon(category.slug)} text-2xl`}></i>
        </div>
        <h3 className="text-lg font-bold font-heading mb-2">{category.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{category.description}</p>
        <div className="text-primary font-bold text-sm flex items-center">
          Browse Resources
          <i className="fas fa-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
        </div>
      </div>
    </Link>
  );
}
