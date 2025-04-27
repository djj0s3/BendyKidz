import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ContactPageInfo } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  
  // Fetch contact page content from Contentful
  const { data: contactInfo, isLoading } = useQuery<ContactPageInfo>({
    queryKey: ['/api/contact-info'],
  });
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const contactMutation = useMutation({
    mutationFn: (data: ContactFormData) => 
      apiRequest('POST', '/api/contact', data),
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
        variant: "default",
      });
      reset();
      setSubmitted(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  return (
    <>
      {/* Contact Hero */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            {isLoading ? <Skeleton className="h-10 w-48 mx-auto bg-white/20" /> : contactInfo?.title || "Contact Us"}
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            {isLoading ? <Skeleton className="h-6 w-full max-w-2xl mx-auto bg-white/20" /> : contactInfo?.subtitle || "Have questions about occupational therapy for your child? We're here to help."}
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/5">
              <h2 className="text-2xl font-bold font-heading mb-6 text-primary">Get In Touch</h2>
              <p className="text-gray-600 mb-8">
                Our team of pediatric occupational therapists is ready to answer your questions and provide guidance for your child's development journey.
              </p>
              
              <div className="space-y-6">
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
                        {contactInfo?.officeLocation || "123 Therapy Lane\nWellness City, WC 12345"}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-phone text-primary"></i>
                  </div>
                  <div>
                    <h3 className="font-bold font-heading mb-1">Phone Number</h3>
                    {isLoading ? (
                      <Skeleton className="h-5 w-32" />
                    ) : (
                      <p className="text-gray-600">{contactInfo?.phoneNumber || "(555) 123-4567"}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-envelope text-primary"></i>
                  </div>
                  <div>
                    <h3 className="font-bold font-heading mb-1">Email Address</h3>
                    {isLoading ? (
                      <Skeleton className="h-5 w-40" />
                    ) : (
                      <p className="text-gray-600">{contactInfo?.email || "info@bendykidz.com"}</p>
                    )}
                  </div>
                </div>
                
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
                        {contactInfo?.officeHours || "Monday - Friday: 9:00 AM - 5:00 PM\nSaturday: 10:00 AM - 2:00 PM"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
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
                    (contactInfo?.socialLinks || [
                      { platform: 'Facebook', url: 'https://facebook.com', icon: 'facebook' },
                      { platform: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
                      { platform: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
                      { platform: 'Pinterest', url: 'https://pinterest.com', icon: 'pinterest' }
                    ]).map((social, index) => (
                      <a 
                        key={index}
                        href={social.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`w-10 h-10 rounded-full text-white flex items-center justify-center hover:opacity-90 transition-opacity ${
                          social.platform.toLowerCase() === 'facebook' ? 'bg-[#3b5998]' :
                          social.platform.toLowerCase() === 'twitter' ? 'bg-[#1da1f2]' : 
                          social.platform.toLowerCase() === 'instagram' ? 'bg-[#c32aa3]' : 
                          social.platform.toLowerCase() === 'pinterest' ? 'bg-[#bd081c]' : 'bg-primary'
                        }`}
                      >
                        <i className={`fab fa-${social.platform.toLowerCase()}`}></i>
                      </a>
                    ))
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:w-3/5">
              <div className="bg-neutral-light p-8 rounded-lg">
                <h2 className="text-2xl font-bold font-heading mb-6">
                  {isLoading ? (
                    <Skeleton className="h-8 w-48" />
                  ) : (
                    contactInfo?.messageFormTitle || "Send Us a Message"
                  )}
                </h2>
                
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-check-circle text-3xl"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Message Sent Successfully!</h3>
                    <p className="text-gray-600 mb-6">Thank you for contacting us. One of our team members will get back to you soon.</p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="btn-primary"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                        <input 
                          type="text" 
                          id="name"
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="John Smith"
                          {...register('name')}
                          disabled={contactMutation.isPending}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                        <input 
                          type="email" 
                          id="email"
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="your@email.com"
                          {...register('email')}
                          disabled={contactMutation.isPending}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                      <input 
                        type="text" 
                        id="subject"
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="How can we help you?"
                        {...register('subject')}
                        disabled={contactMutation.isPending}
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                      <textarea 
                        id="message"
                        rows={5}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Please describe how we can help..."
                        {...register('message')}
                        disabled={contactMutation.isPending}
                      ></textarea>
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                      )}
                    </div>
                    
                    <button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                      disabled={contactMutation.isPending}
                    >
                      {contactMutation.isPending ? (
                        <span className="flex items-center justify-center">
                          <i className="fas fa-spinner fa-spin mr-2"></i> Sending...
                        </span>
                      ) : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold font-heading mb-8 text-center">
              {isLoading ? <Skeleton className="h-8 w-32 mx-auto" /> : contactInfo?.mapTitle || "Find Us"}
            </h2>
            <div className="bg-white p-2 rounded-lg shadow-md">
              <div className="aspect-[16/9] w-full rounded-lg overflow-hidden">
                {isLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  <iframe 
                    src={contactInfo?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.3059353029!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2suk!4v1619471123295!5m2!1sen!2suk"}
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
    </>
  );
}
