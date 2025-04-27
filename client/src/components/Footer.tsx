import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category, Footer as FooterType } from "@shared/schema";

export default function Footer() {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Fetch footer content from API
  const { data: footerData, isLoading, error } = useQuery<FooterType>({
    queryKey: ['/api/footer'],
  });

  return (
    <footer className="bg-neutral-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <span className="text-2xl font-bold font-heading">{footerData?.title || 'BendyKidz'}</span>
            </Link>
            <p className="text-gray-400 mb-6">
              {footerData?.description || 'Expert occupational therapy resources for parents to support their children\'s development through play-based activities.'}
            </p>
            <div className="flex space-x-4">
              {footerData?.socialLinks && footerData.socialLinks.length > 0 ? (
                footerData.socialLinks.map((social, index) => (
                  <a 
                    key={`social-${index}`}
                    href={social.url} 
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social.platform}
                  >
                    <i className={social.icon}></i>
                  </a>
                ))
              ) : (
                <>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <i className="fab fa-pinterest"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <i className="fab fa-youtube"></i>
                  </a>
                </>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold font-heading mb-4">
              {footerData?.quickLinks?.title || 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              {footerData?.quickLinks?.links && footerData.quickLinks.links.length > 0 ? (
                footerData.quickLinks.links.map((link, index) => (
                  <li key={`quick-link-${index}`}>
                    <Link 
                      href={link.url} 
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                  <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                  <li><Link href="/articles" className="text-gray-400 hover:text-white transition-colors">Resources</Link></li>
                  <li><Link href="/articles" className="text-gray-400 hover:text-white transition-colors">Articles</Link></li>
                  <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold font-heading mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories ? (
                categories.map((category) => (
                  <li key={category.id}>
                    <Link 
                      href={`/category/${category.slug}`} 
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Fine Motor Skills</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Gross Motor Skills</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Sensory Processing</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Social Skills</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Daily Living Skills</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold font-heading mb-4">
              {footerData?.contactInfo?.title || 'Contact Us'}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-secondary"></i>
                <span className="text-gray-400">
                  {footerData?.contactInfo?.address.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < footerData.contactInfo.address.split('\n').length - 1 && <br />}
                    </span>
                  )) || '123 Therapy Lane\nWellness City, WC 12345'}
                </span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone mr-3 text-secondary"></i>
                <span className="text-gray-400">
                  {footerData?.contactInfo?.phone || '(555) 123-4567'}
                </span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-secondary"></i>
                <span className="text-gray-400">
                  {footerData?.contactInfo?.email || 'info@bendykidz.com'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            {footerData?.copyrightText 
              ? footerData.copyrightText.replace('{year}', new Date().getFullYear().toString()) 
              : `© ${new Date().getFullYear()} BendyKidz. All rights reserved.`}
          </p>
          <div className="flex space-x-4 text-sm text-gray-400">
            {footerData?.policies && footerData.policies.length > 0 ? (
              footerData.policies.map((policy, index) => (
                <a 
                  key={`policy-${index}`}
                  href={policy.url} 
                  className="hover:text-white transition-colors"
                >
                  {policy.label}
                </a>
              ))
            ) : (
              <>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
