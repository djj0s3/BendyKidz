import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header as HeaderType } from "@shared/schema";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch header content from API
  const { data: headerData } = useQuery<HeaderType>({
    queryKey: ['/api/header'],
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Sort navigation items by order
  const navigationItems = headerData?.navigationItems 
    ? [...headerData.navigationItems].sort((a, b) => a.order - b.order) 
    : [
        { label: 'Home', url: '/', order: 1 },
        { label: 'Resources', url: '/articles', order: 2 },
        { label: 'About', url: '/about', order: 3 },
        { label: 'Contact', url: '/contact', order: 4 }
      ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {headerData?.logoUrl ? (
              <img 
                src={headerData.logoUrl} 
                alt={`${headerData.title || 'BendyKidz'} Logo`}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <div className="text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
            )}
            <span className="text-2xl font-bold text-primary font-heading">
              {headerData?.title || 'BendyKidz'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item, index) => (
              <Link 
                key={`desktop-nav-${index}`}
                href={item.url} 
                className="font-heading font-medium hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-500 focus:outline-none" 
            onClick={toggleMenu}
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden bg-white ${!isMenuOpen ? 'hidden' : ''}`}>
        <div className="container mx-auto px-4 py-3 space-y-2">
          {navigationItems.map((item, index) => (
            <Link 
              key={`mobile-nav-${index}`}
              href={item.url} 
              className="block py-2 font-heading font-medium"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}