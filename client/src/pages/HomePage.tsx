import HeroSection from "@/components/HeroSection";
import FeaturedArticles from "@/components/FeaturedArticles";
import TestimonialSlider from "@/components/TestimonialSlider";
import AboutSection from "@/components/AboutSection";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Category } from "@shared/schema";
import CategoryCard from "@/components/CategoryCard";
import { CategoryGridSkeleton } from "@/components/ui/loading";

export default function HomePage() {
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  return (
    <>
      <HeroSection />
      <FeaturedArticles />
      <TestimonialSlider />
      
      {/* Resource Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">Browse by Category</h2>
          <p className="text-gray-600 mb-10">Find specific resources tailored to your child's needs</p>
          
          {categoriesLoading ? (
            <CategoryGridSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories?.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      <AboutSection />
    </>
  );
}
