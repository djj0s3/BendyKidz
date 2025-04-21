import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Handle changing the selected category
  const handleCategoryClick = (categorySlug: string) => {
    onCategoryChange(categorySlug);
  };

  if (isLoading) {
    return (
      <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
        <div className="px-4 py-2 rounded-full bg-primary text-white font-medium text-sm">All</div>
        <div className="px-4 py-2 rounded-full bg-neutral-light text-gray-600 font-medium text-sm animate-pulse w-24"></div>
        <div className="px-4 py-2 rounded-full bg-neutral-light text-gray-600 font-medium text-sm animate-pulse w-20"></div>
        <div className="px-4 py-2 rounded-full bg-neutral-light text-gray-600 font-medium text-sm animate-pulse w-28"></div>
      </div>
    );
  }

  return (
    <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
      <button 
        className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
          selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-neutral-light text-gray-600 hover:bg-gray-200'
        }`}
        onClick={() => handleCategoryClick('all')}
      >
        All
      </button>
      {categories?.map((category) => (
        <button
          key={category.id}
          className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
            selectedCategory === category.slug ? 'bg-primary text-white' : 'bg-neutral-light text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => handleCategoryClick(category.slug)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
