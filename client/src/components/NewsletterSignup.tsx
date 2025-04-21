import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address")
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export default function NewsletterSignup() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema)
  });

  const newsletterMutation = useMutation({
    mutationFn: (data: NewsletterFormData) => 
      apiRequest('POST', '/api/newsletter/subscribe', data),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
        variant: "default",
      });
      reset();
      setSubmitted(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: NewsletterFormData) => {
    newsletterMutation.mutate(data);
  };

  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-3">Get Weekly OT Tips and Resources</h2>
          <p className="text-lg opacity-90 mb-8">Join our community of parents and receive practical tips, new activities, and helpful resources directly in your inbox.</p>
          
          {submitted ? (
            <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg p-6 mb-8">
              <i className="fas fa-check-circle text-3xl mb-3"></i>
              <h3 className="text-xl font-bold mb-2">Thank You for Subscribing!</h3>
              <p>You'll start receiving our newsletter with helpful resources soon.</p>
            </div>
          ) : (
            <form 
              className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex-grow">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className={`w-full px-4 py-3 rounded-lg focus:outline-none text-neutral-dark ${errors.email ? 'border-2 border-red-500' : ''}`}
                  {...register('email')}
                  disabled={newsletterMutation.isPending}
                  required
                />
                {errors.email && (
                  <p className="text-white text-opacity-90 text-sm mt-1 text-left">{errors.email.message}</p>
                )}
              </div>
              <button 
                type="submit" 
                className="bg-accent hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                disabled={newsletterMutation.isPending}
              >
                {newsletterMutation.isPending ? (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-spinner fa-spin mr-2"></i> Subscribing...
                  </span>
                ) : 'Subscribe'}
              </button>
            </form>
          )}
          
          <p className="text-sm mt-4 opacity-75">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  );
}
