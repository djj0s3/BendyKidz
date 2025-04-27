import { useQuery } from "@tanstack/react-query";
import { ContactPageInfo } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContactPage() {
  // Fetch contact page content from Contentful
  const { data: contactInfo, isLoading } = useQuery<ContactPageInfo>({
    queryKey: ['/api/contact-info'],
  });

  return (
    <>
      {/* Contact Hero - Only show if we have title or subtitle */}
      {(isLoading || contactInfo?.title || contactInfo?.subtitle) && (
        <section className="bg-gradient-to-br from-primary to-secondary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            {(isLoading || contactInfo?.title) && (
              <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
                {isLoading ? <Skeleton className="h-10 w-48 mx-auto bg-white/20" /> : contactInfo?.title}
              </h1>
            )}
            {(isLoading || contactInfo?.subtitle) && (
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                {isLoading ? <Skeleton className="h-6 w-full max-w-2xl mx-auto bg-white/20" /> : contactInfo?.subtitle}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Contact Form & Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-neutral-light p-8 rounded-lg">
              <h2 className="text-2xl font-bold font-heading mb-6 text-primary">Get In Touch</h2>
              <p className="text-gray-600 mb-8">
                Our team of pediatric occupational therapists is ready to answer your questions and provide guidance for your child's development journey.
              </p>
              
              <div className="space-y-6">
                {(isLoading || contactInfo?.officeLocation) && (
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="fas fa-map-marker-alt text-primary"></i>
                    </div>
                    <div>
                      <h3 className="font-bold font-heading mb-1">Office Location</h3>
                      {isLoading ? (
                        <Skeleton className="h-10 w-full" />
                      ) : (
                        <p className="text-gray-600" style={{ whiteSpace: 'pre-line' }}>
                          {contactInfo?.officeLocation}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {(isLoading || contactInfo?.phoneNumber) && (
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="fas fa-phone text-primary"></i>
                    </div>
                    <div>
                      <h3 className="font-bold font-heading mb-1">Phone Number</h3>
                      {isLoading ? (
                        <Skeleton className="h-5 w-32" />
                      ) : (
                        <p className="text-gray-600">{contactInfo?.phoneNumber}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {(isLoading || contactInfo?.email) && (
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="fas fa-envelope text-primary"></i>
                    </div>
                    <div>
                      <h3 className="font-bold font-heading mb-1">Email Address</h3>
                      {isLoading ? (
                        <Skeleton className="h-5 w-40" />
                      ) : (
                        <p className="text-gray-600">{contactInfo?.email}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {(isLoading || contactInfo?.officeHours) && (
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="fas fa-clock text-primary"></i>
                    </div>
                    <div>
                      <h3 className="font-bold font-heading mb-1">Office Hours</h3>
                      {isLoading ? (
                        <Skeleton className="h-10 w-full" />
                      ) : (
                        <p className="text-gray-600" style={{ whiteSpace: 'pre-line' }}>
                          {contactInfo?.officeHours}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Only show social media section if any social links exist or we're loading */}
              {(isLoading || contactInfo?.socialFacebook || contactInfo?.socialTwitter || contactInfo?.socialInstagram || contactInfo?.socialPinterest) && (
                <div className="mt-8">
                  <h3 className="font-bold font-heading mb-4">Connect With Us</h3>
                  <div className="flex space-x-4">
                    {isLoading ? (
                      <>
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <Skeleton className="w-10 h-10 rounded-full" />
                      </>
                    ) : (
                      <>
                        {contactInfo?.socialFacebook && (
                          <a 
                            href={contactInfo.socialFacebook} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-10 h-10 rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                          >
                            <i className="fab fa-facebook-f"></i>
                          </a>
                        )}
                        {contactInfo?.socialTwitter && (
                          <a 
                            href={contactInfo.socialTwitter} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-10 h-10 rounded-full bg-[#1da1f2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                          >
                            <i className="fab fa-twitter"></i>
                          </a>
                        )}
                        {contactInfo?.socialInstagram && (
                          <a 
                            href={contactInfo.socialInstagram} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-10 h-10 rounded-full bg-[#c32aa3] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                          >
                            <i className="fab fa-instagram"></i>
                          </a>
                        )}
                        {contactInfo?.socialPinterest && (
                          <a 
                            href={contactInfo.socialPinterest} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-10 h-10 rounded-full bg-[#bd081c] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                          >
                            <i className="fab fa-pinterest"></i>
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section - Only show if there's a map URL */}
      {(isLoading || contactInfo?.mapEmbedUrl) && (
        <section className="py-16 bg-neutral-light">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {(isLoading || contactInfo?.mapTitle) && (
                <h2 className="text-2xl font-bold font-heading mb-8 text-center">
                  {isLoading ? <Skeleton className="h-8 w-32 mx-auto" /> : contactInfo?.mapTitle}
                </h2>
              )}
              <div className="bg-white p-2 rounded-lg shadow-md">
                <div className="aspect-[16/9] w-full rounded-lg overflow-hidden">
                  {isLoading ? (
                    <Skeleton className="w-full h-full" />
                  ) : (
                    <iframe 
                      src={contactInfo?.mapEmbedUrl}
                      width="100%" 
                      height="100%" 
                      style={{border: 0}} 
                      allowFullScreen={true} 
                      loading="lazy"
                      title="Google Maps"
                    ></iframe>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
