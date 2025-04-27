import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { Header as HeaderType } from "@shared/schema";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [, setLocation] = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Fetch header content from API
  const { data: headerData, isLoading, error } = useQuery<HeaderType>({
    queryKey: ['/api/header'],
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close search when menu opens
    if (!isMenuOpen) {
      setIsSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    // Close menu when search opens
    if (!isSearchOpen) {
      setIsMenuOpen(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search") as string;
    if (searchQuery.trim()) {
      setLocation(`/articles?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
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
            <div className="text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-primary font-heading">
              {headerData?.title || 'BendyKidz'}
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block relative w-1/3">
            <form onSubmit={handleSearchSubmit}>
              <input 
                type="text" 
                name="search"
                placeholder={headerData?.searchPlaceholder || "Search resources and articles..."} 
                className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <i className="fas fa-search"></i>
              </div>
            </form>
          </div>

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
            <div className="relative flex items-center">
              <input type="checkbox" id="darkMode" className="sr-only" />
              <label htmlFor="darkMode" className="flex items-center cursor-pointer">
                <div className="relative w-10 h-5 bg-gray-200 rounded-full shadow-inner">
                  <div className="dot absolute w-4 h-4 bg-white rounded-full shadow -left-1 -top-0.5 transition"></div>
                </div>
              </label>
            </div>
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

      {/* Mobile Search */}
      <div className={`md:hidden px-4 pb-3 ${!isSearchOpen ? 'hidden' : ''}`}>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input 
            type="text" 
            name="search"
            placeholder={headerData?.searchPlaceholder || "Search resources and articles..."} 
            className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <i className="fas fa-search"></i>
          </div>
        </form>
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
          <button 
            className="block py-2 font-heading font-medium text-left w-full"
            onClick={toggleSearch}
          >
            <i className="fas fa-search mr-2"></i> Search
          </button>
        </div>
      </div>
    </header>
  );
}
