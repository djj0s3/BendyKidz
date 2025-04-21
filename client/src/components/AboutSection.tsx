import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AboutContent } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function AboutSection() {
  const { data: aboutContent, isLoading } = useQuery<AboutContent>({
    queryKey: ['/api/about'],
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

  return (
    <section className="py-16 bg-primary bg-opacity-10">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <img 
              src={aboutContent?.image || "https://images.unsplash.com/photo-1516627145497-ae6968895b24?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
              alt={aboutContent?.imageAlt || "Occupational therapist working with child"} 
              className="rounded-lg shadow-lg" 
              width="500" 
              height="375"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4 text-primary">
              {aboutContent?.title || "About BendyKidz"}
            </h2>
            <div className="text-gray-700 mb-6" dangerouslySetInnerHTML={{ 
              __html: aboutContent?.description || `
                <p className="mb-6">
                  BendyKidz was founded by experienced pediatric occupational therapists who noticed parents needed more accessible, practical resources to support their children's development at home.
                </p>
                <p className="mb-6">
                  Our mission is to empower parents with professional guidance, creative activities, and supportive strategies that make a real difference in children's lives.
                </p>
              `
            }} />
            <div className="flex flex-wrap gap-4">
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
