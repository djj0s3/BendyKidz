import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SiteStats, HeroSection as HeroSectionType } from "@shared/schema";

export default function HeroSection() {
  const { data: stats, isLoading: statsLoading } = useQuery<SiteStats>({
    queryKey: ['/api/stats'],
  });
  
  const { data: heroContent, isLoading: heroLoading } = useQuery<HeroSectionType>({
    queryKey: ['/api/hero'],
  });

  // Fallback hero data if Contentful doesn't provide it
  const fallbackHeroData: HeroSectionType = {
    title: "Fun Occupational Therapy for Kids that Makes a Difference",
    subtitle: "Expert resources to help your child develop skills, confidence, and independence through play-based therapy.",
    image: "https://images.unsplash.com/photo-1574436323527-85696ca0ac2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    imageAlt: "Child engaging in therapy activities",
    primaryButtonText: "Start Exploring",
    primaryButtonLink: "/articles",
    secondaryButtonText: "Meet the Therapist",
    secondaryButtonLink: "/about"
  };
  
  // Log data and use local image
  console.log("Hero content from API:", heroContent);
  // Use a local image path that's guaranteed to work
  const heroImageUrl = "/images/hero-image.png";

  return (
    <section className="bg-gradient-to-br from-primary to-secondary text-white">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4 leading-tight">
              {heroLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                heroContent?.title || fallbackHeroData.title
              )}
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-6">
              {heroLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                heroContent?.subtitle || fallbackHeroData.subtitle
              )}
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link 
                href={heroContent?.primaryButtonLink || fallbackHeroData.primaryButtonLink} 
                className="btn bg-accent hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-full inline-block text-center"
              >
                {heroContent?.primaryButtonText || fallbackHeroData.primaryButtonText}
              </Link>
              <Link 
                href={heroContent?.secondaryButtonLink || fallbackHeroData.secondaryButtonLink} 
                className="btn bg-white hover:bg-opacity-90 text-primary font-bold py-3 px-6 rounded-full inline-block text-center"
              >
                {heroContent?.secondaryButtonText || fallbackHeroData.secondaryButtonText}
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              // Directly use the image URL for now to guarantee it loads
              src={heroImageUrl} 
              alt="Child engaging in therapy activities" 
              className="rounded-lg shadow-lg max-w-full h-auto" 
              width="500" 
              height="375"
            />
          </div>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg p-6">
            <div className="inline-block p-3 bg-white rounded-full text-primary mb-4">
              <i className="fas fa-book text-xl"></i>
            </div>
            <h3 className="text-xl font-bold font-heading mb-2">
              {statsLoading ? (
                <span className="animate-pulse bg-white bg-opacity-30 rounded px-3">---</span>
              ) : (
                `${stats?.resources || '200'}+`
              )}
            </h3>
            <p className="opacity-90">Resources</p>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg p-6">
            <div className="inline-block p-3 bg-white rounded-full text-primary mb-4">
              <i className="fas fa-user-friends text-xl"></i>
            </div>
            <h3 className="text-xl font-bold font-heading mb-2">
              {statsLoading ? (
                <span className="animate-pulse bg-white bg-opacity-30 rounded px-3">---</span>
              ) : (
                `${stats?.specialists || '1'}`
              )}
            </h3>
            <p className="opacity-90">Specialist</p>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg p-6">
            <div className="inline-block p-3 bg-white rounded-full text-primary mb-4">
              <i className="fas fa-certificate text-xl"></i>
            </div>
            <h3 className="text-xl font-bold font-heading mb-2">
              {statsLoading ? (
                <span className="animate-pulse bg-white bg-opacity-30 rounded px-3">---</span>
              ) : (
                `${stats?.activityTypes || '15'}+`
              )}
            </h3>
            <p className="opacity-90">Activity Types</p>
          </div>
        </div>
      </div>
    </section>
  );
}
