import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";

export default function TestimonialSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const { data: testimonials, isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  // Auto-rotate testimonials
  useEffect(() => {
    if (!testimonials || testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [testimonials]);

  // Handle manual testimonial change
  const handleTestimonialChange = (index: number) => {
    setActiveIndex(index);
  };

  // Default testimonial if data is not available
  const defaultTestimonial = {
    id: 0,
    quote: "The strategies from BendyKidz transformed our daily routines. My son who struggled with transitions now uses the visual schedule cards, and his confidence has grown tremendously with the sensory-friendly activities.",
    name: "Rebecca Taylor",
    role: "Parent of Alex, age 6",
    avatar: "https://randomuser.me/api/portraits/women/54.jpg"
  };

  const displayTestimonial = testimonials && testimonials.length > 0 
    ? testimonials[activeIndex] 
    : defaultTestimonial;

  return (
    <section className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-10">
            Every Child Can Thrive with the Right Support
          </h2>
          
          {isLoading ? (
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-24 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-6xl text-primary opacity-20">
                <i className="fas fa-quote-left"></i>
              </div>
              
              <blockquote className="text-lg md:text-xl mb-6 relative z-10">
                "{displayTestimonial.quote}"
              </blockquote>
              
              <div className="flex items-center justify-center">
                <img 
                  src={displayTestimonial.avatar} 
                  alt={displayTestimonial.name} 
                  className="w-12 h-12 rounded-full mr-4" 
                />
                <div className="text-left">
                  <p className="font-bold font-heading">{displayTestimonial.name}</p>
                  <p className="text-sm text-gray-600">{displayTestimonial.role}</p>
                </div>
              </div>
              
              {testimonials && testimonials.length > 1 && (
                <div className="mt-8 flex justify-center space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleTestimonialChange(index)}
                      className={`w-${activeIndex === index ? '3' : '2'} h-${activeIndex === index ? '3' : '2'} rounded-full ${
                        activeIndex === index ? 'bg-primary' : 'bg-gray-300'
                      } focus:outline-none`}
                      aria-label={`View testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
