import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AboutContent } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function AboutSection() {
  const { data: aboutContent, isLoading, isError } = useQuery<AboutContent>({
    queryKey: ['/api/about']
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-primary bg-opacity-10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <Skeleton className="w-full aspect-[4/3] rounded-lg" />
            </div>
            <div className="md:w-1/2">
              <Skeleton className="h-10 w-48 mb-4" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-3/4 mb-6" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-1/2 mb-6" />
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-10 w-36" />
                <Skeleton className="h-10 w-36" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  // Continue with fallback content if there's an error or no content from API
  const defaultImage = "https://images.unsplash.com/photo-1516627145497-ae6968895b24?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
  const defaultTitle = "About BendyKidz Occupational Therapy";
  const defaultDescription = `
    <p>BendyKidz Occupational Therapy was founded by Emma Wilson, a pediatric occupational therapist with over 15 years of experience working with children of all abilities.</p>
    <p>After years of clinical practice, Emma recognized that families needed more accessible resources to continue supporting their children's development at home. This website was created to bridge that gap – providing evidence-based information and practical strategies in an easy-to-implement format.</p>
    <p>Our mission is to make a meaningful difference in children's lives through evidence-based practices, play-based learning, and family-centered care.</p>
  `;

  return (
    <section className="py-16 bg-primary bg-opacity-80">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <img 
              src={aboutContent?.image || defaultImage} 
              alt={aboutContent?.imageAlt || "Occupational therapist working with child"} 
              className="rounded-lg shadow-lg w-full" 
              width="500" 
              height="375"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4 text-white">
              {aboutContent?.title || defaultTitle}
            </h2>
            <div className="text-white mb-6" dangerouslySetInnerHTML={{ 
              __html: aboutContent?.description || defaultDescription
            }} />
            <div className="flex flex-row space-x-4">
              <Link href="/about" className="btn bg-primary hover:bg-opacity-90 text-white font-bold py-2.5 px-6 rounded-lg inline-block">
                Learn More About Us
              </Link>
              <Link href="/contact" className="btn bg-white border border-primary text-primary hover:bg-primary hover:text-white font-bold py-2.5 px-6 rounded-lg inline-block transition-colors">
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
