import { useQuery } from "@tanstack/react-query";
import { AboutContent, TeamMember, CoreValue } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function AboutPage() {
  const { data: aboutContent, isLoading: aboutLoading } = useQuery<AboutContent>({
    queryKey: ['/api/about'],
  });

  const { data: teamMembers, isLoading: teamLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/team'],
  });
  
  const { data: coreValues, isLoading: valuesLoading } = useQuery<CoreValue[]>({
    queryKey: ['/api/core-values'],
  });

  return (
    <>
      {/* About Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-6">
              {aboutLoading ? (
                <Skeleton className="h-12 w-3/4 mx-auto bg-white bg-opacity-20" />
              ) : (
                aboutContent?.title || "About BendyKidz Occupational Therapy"
              )}
            </h1>
            <p className="text-xl opacity-90">
              {aboutLoading ? (
                <>
                  <Skeleton className="h-6 w-full mb-2 mx-auto bg-white bg-opacity-20" />
                  <Skeleton className="h-6 w-5/6 mx-auto bg-white bg-opacity-20" />
                </>
              ) : (
                aboutContent?.subtitle || "Empowering children through play-based therapy and parent education since 2015"
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
              <div className="md:w-1/2">
                {aboutLoading ? (
                  <Skeleton className="w-full aspect-[4/3] rounded-lg" />
                ) : (
                  <img 
                    src={aboutContent?.image || "https://images.unsplash.com/photo-1516627145497-ae6968895b24?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
                    alt={aboutContent?.imageAlt || "Occupational therapist working with child"}
                    className="rounded-lg shadow-lg w-full"
                  />
                )}
              </div>
              <div className="md:w-1/2">
                <h2 className="text-2xl font-bold font-heading mb-4 text-primary">Our Story</h2>
                {aboutLoading ? (
                  <>
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-5 w-3/4 mb-4" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-5 w-5/6" />
                  </>
                ) : (
                  <div className="prose" dangerouslySetInnerHTML={{ 
                    __html: aboutContent?.description || `
                      <p>BendyKidz was founded by a team of passionate pediatric occupational therapists who saw a need for more accessible resources for parents.</p>
                      <p>We believe that therapy doesn't only happen in a clinical setting, but continues at home through play and daily activities. Our mission is to empower parents with the knowledge and tools to support their children's development.</p>
                    `
                  }} />
                )}
              </div>
            </div>

            <div className="mb-16">
              <h2 className="text-2xl font-bold font-heading mb-4 text-primary text-center">Our Mission & Values</h2>
              {aboutLoading ? (
                <>
                  <Skeleton className="h-5 w-full mb-2 mx-auto" />
                  <Skeleton className="h-5 w-full mb-2 mx-auto" />
                  <Skeleton className="h-5 w-5/6 mb-6 mx-auto" />
                </>
              ) : (
                <div className="prose max-w-full text-center mx-auto" dangerouslySetInnerHTML={{ 
                  __html: aboutContent?.mission || `
                    <p>At BendyKidz, we're committed to making a meaningful difference in children's lives through evidence-based practices, play-based learning, and family-centered care.</p>
                  `
                }} />
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {valuesLoading ? (
                  <>
                    <div className="bg-neutral-light p-6 rounded-lg text-center">
                      <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                      <Skeleton className="h-6 w-32 mx-auto mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-5/6 mx-auto" />
                    </div>
                    <div className="bg-neutral-light p-6 rounded-lg text-center">
                      <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                      <Skeleton className="h-6 w-32 mx-auto mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-5/6 mx-auto" />
                    </div>
                    <div className="bg-neutral-light p-6 rounded-lg text-center">
                      <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                      <Skeleton className="h-6 w-32 mx-auto mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-5/6 mx-auto" />
                    </div>
                  </>
                ) : coreValues && coreValues.length > 0 ? (
                  // Sort values by display order and map them to components
                  coreValues
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((value) => (
                      <div key={value.id} className="bg-neutral-light p-6 rounded-lg text-center">
                        <div className={`w-16 h-16 bg-${value.iconColor || 'primary'} bg-opacity-10 text-${value.iconColor || 'primary'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                          <i className={`${value.icon || 'fas fa-star'} text-xl`}></i>
                        </div>
                        <h3 className="font-bold font-heading mb-2">{value.title}</h3>
                        <p className="text-gray-600">{value.description}</p>
                      </div>
                    ))
                ) : (
                  // Fallback values if none are available from the API
                  <>
                    <div className="bg-neutral-light p-6 rounded-lg text-center">
                      <div className="w-16 h-16 bg-primary bg-opacity-10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-star text-xl"></i>
                      </div>
                      <h3 className="font-bold font-heading mb-2">Excellence</h3>
                      <p className="text-gray-600">Providing the highest quality evidence-based resources and information.</p>
                    </div>
                    <div className="bg-neutral-light p-6 rounded-lg text-center">
                      <div className="w-16 h-16 bg-secondary bg-opacity-10 text-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-heart text-xl"></i>
                      </div>
                      <h3 className="font-bold font-heading mb-2">Compassion</h3>
                      <p className="text-gray-600">Understanding each child's unique journey and supporting families with empathy.</p>
                    </div>
                    <div className="bg-neutral-light p-6 rounded-lg text-center">
                      <div className="w-16 h-16 bg-accent bg-opacity-10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-lightbulb text-xl"></i>
                      </div>
                      <h3 className="font-bold font-heading mb-2">Innovation</h3>
                      <p className="text-gray-600">Constantly evolving our approach to create effective, engaging interventions.</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Team Section */}
            <div>
              <h2 className="text-2xl font-bold font-heading mb-12 text-primary text-center">Meet Your Therapist</h2>
              
              {teamLoading ? (
                <div className="max-w-2xl mx-auto">
                  <div className="text-center">
                    <Skeleton className="w-48 h-48 rounded-full mx-auto mb-6" />
                    <Skeleton className="h-8 w-64 mx-auto mb-2" />
                    <Skeleton className="h-6 w-80 mx-auto mb-6" />
                    <div className="space-y-4 text-left">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-5/6 mb-1" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-4/5 mb-1" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>
              ) : teamMembers && teamMembers.length > 0 ? (
                <div className="max-w-2xl mx-auto">
                  {/* Just show the first team member if there are multiple */}
                  <div className="text-center">
                    <img 
                      src={teamMembers[0].avatar} 
                      alt={teamMembers[0].name} 
                      className="w-48 h-48 rounded-full mx-auto mb-6 object-cover shadow-lg border-4 border-white"
                    />
                    <h3 className="text-2xl font-bold font-heading mb-2">{teamMembers[0].name}</h3>
                    <p className="text-primary text-lg mb-6">{teamMembers[0].role}</p>
                    <div className="text-gray-600 space-y-4 text-left">
                      <p>{teamMembers[0].bio}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto">
                  <div className="text-center">
                    <img 
                      src="https://randomuser.me/api/portraits/women/65.jpg" 
                      alt="Emma Wilson" 
                      className="w-48 h-48 rounded-full mx-auto mb-6 object-cover shadow-lg border-4 border-white"
                    />
                    <h3 className="text-2xl font-bold font-heading mb-2">Emma Wilson</h3>
                    <p className="text-primary text-lg mb-6">Founder & Lead Occupational Therapist</p>
                    <div className="text-gray-600 space-y-4 text-left">
                      <p>Emma has over 15 years of experience working with children with diverse needs and abilities. She founded BendyKidz to make occupational therapy resources more accessible to families everywhere.</p>
                      
                      <p>With a Master's degree in Occupational Therapy and specialized certifications in Sensory Integration and Pediatric Development, Emma brings a wealth of knowledge and practical experience to help children thrive.</p>
                      
                      <p>Her approach combines evidence-based practices with a playful, family-centered philosophy that empowers parents to support their children's development at home.</p>
                      
                      <p>When not creating resources or working with clients, Emma enjoys hiking, gardening, and volunteering at local community centers.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <NewsletterSignup />
    </>
  );
}
