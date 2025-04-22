import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SiteStats, HeroSection as HeroSectionType } from "@shared/schema";
import { fallbackHeroSection, fallbackSiteStats } from "../lib/fallbackData";

export default function HeroSection() {
  const { data: stats, isLoading: statsLoading } = useQuery<SiteStats>({
    queryKey: ['/api/stats'],
  });
  
  const { data: heroContent, isLoading: heroLoading } = useQuery<HeroSectionType>({
    queryKey: ['/api/hero'],
  });

  // Log data for debugging
  console.log("Hero content from API:", heroContent);

  return (
    <section className="bg-gradient-to-br from-primary to-secondary text-white">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4 leading-tight">
              {heroLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                heroContent?.title || fallbackHeroSection.title
              )}
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-6">
              {heroLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                heroContent?.subtitle || fallbackHeroSection.subtitle
              )}
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link 
                href={heroContent?.primaryButtonLink || fallbackHeroSection.primaryButtonLink} 
                style={{
                  backgroundColor: heroContent?.primaryButtonColor || fallbackHeroSection.primaryButtonColor || '#7C3AED',
                  color: heroContent?.primaryButtonTextColor || fallbackHeroSection.primaryButtonTextColor || '#FFFFFF'
                }}
                className="btn hover:bg-opacity-90 font-bold py-3 px-6 rounded-full inline-block text-center"
              >
                {heroContent?.primaryButtonText || fallbackHeroSection.primaryButtonText}
              </Link>
              <Link 
                href={heroContent?.secondaryButtonLink || fallbackHeroSection.secondaryButtonLink} 
                style={{
                  backgroundColor: heroContent?.secondaryButtonColor || fallbackHeroSection.secondaryButtonColor || '#FFFFFF',
                  color: heroContent?.secondaryButtonTextColor || fallbackHeroSection.secondaryButtonTextColor || '#7C3AED'
                }}
                className="btn hover:bg-opacity-90 font-bold py-3 px-6 rounded-full inline-block text-center"
              >
                {heroContent?.secondaryButtonText || fallbackHeroSection.secondaryButtonText}
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src={heroContent?.image || fallbackHeroSection.image} 
              alt={heroContent?.imageAlt || fallbackHeroSection.imageAlt} 
              className="rounded-lg shadow-lg max-w-full h-auto" 
              width="500" 
              height="375"
              onError={(e) => {
                // Fallback to our local image if the content image fails to load
                const target = e.target as HTMLImageElement;
                console.log("Image failed to load, using fallback");
                target.src = "/images/hero-image.png";
              }}
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
                `${stats?.resources || fallbackSiteStats.resources}+`
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
                `${stats?.specialists || fallbackSiteStats.specialists}`
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
                `${stats?.activityTypes || fallbackSiteStats.activityTypes}+`
              )}
            </h3>
            <p className="opacity-90">Activity Types</p>
          </div>
        </div>
      </div>
    </section>
  );
}
