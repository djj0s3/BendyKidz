import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubscriberSchema, insertContactSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import {
  getArticles,
  getFeaturedArticles,
  getArticleBySlug,
  getRelatedArticles,
  getCategories,
  getCategoryBySlug,
  getArticlesByCategory,
  getTestimonials,
  getTestimonialsSection,
  getAboutContent,
  getTeamMembers,
  getSiteStats,
  getHeroSection,
  getFeaturedCollections
} from "./contentful";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for Contentful content
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await getArticles();
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/featured", async (req, res) => {
    try {
      const featuredArticles = await getFeaturedArticles();
      res.json(featuredArticles);
    } catch (error) {
      console.error("Error fetching featured articles:", error);
      res.status(500).json({ message: "Failed to fetch featured articles" });
    }
  });

  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const article = await getArticleBySlug(req.params.slug);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      console.error(`Error fetching article ${req.params.slug}:`, error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.get("/api/articles/:slug/related", async (req, res) => {
    try {
      const article = await getArticleBySlug(req.params.slug);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      const relatedArticles = await getRelatedArticles(article.id, article.category.id);
      res.json(relatedArticles);
    } catch (error) {
      console.error(`Error fetching related articles for ${req.params.slug}:`, error);
      res.status(500).json({ message: "Failed to fetch related articles" });
    }
  });

  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await getCategoryBySlug(req.params.slug);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      console.error(`Error fetching category ${req.params.slug}:`, error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.get("/api/categories/:slug/articles", async (req, res) => {
    try {
      const category = await getCategoryBySlug(req.params.slug);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      const articles = await getArticlesByCategory(category.id);
      res.json(articles);
    } catch (error) {
      console.error(`Error fetching articles for category ${req.params.slug}:`, error);
      res.status(500).json({ message: "Failed to fetch category articles" });
    }
  });

  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });
  
  app.get("/api/testimonials-section", async (req, res) => {
    try {
      const testimonialSection = await getTestimonialsSection();
      res.json(testimonialSection);
    } catch (error) {
      console.error("Error fetching testimonials section:", error);
      res.status(500).json({ message: "Failed to fetch testimonials section" });
    }
  });

  app.get("/api/about", async (req, res) => {
    try {
      const aboutContent = await getAboutContent();
      res.json(aboutContent);
    } catch (error) {
      console.error("Error fetching about content:", error);
      res.status(500).json({ message: "Failed to fetch about content" });
    }
  });

  app.get("/api/team", async (req, res) => {
    try {
      const teamMembers = await getTeamMembers();
      res.json(teamMembers);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.get("/api/hero", async (req, res) => {
    try {
      const heroSection = await getHeroSection();
      res.json(heroSection);
    } catch (error) {
      console.error("Error fetching hero section:", error);
      res.status(500).json({ message: "Failed to fetch hero section" });
    }
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await getSiteStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching site stats:", error);
      res.status(500).json({ message: "Failed to fetch site stats" });
    }
  });
  
  app.get("/api/featured-collections", async (req, res) => {
    try {
      const collections = await getFeaturedCollections();
      res.json(collections);
    } catch (error) {
      console.error("Error fetching featured collections:", error);
      res.status(500).json({ message: "Failed to fetch featured collections" });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      // Validate request body
      const data = insertSubscriberSchema.parse(req.body);
      
      // Check if the email is already subscribed
      const existingSubscriber = await storage.getSubscriberByEmail(data.email);
      
      if (existingSubscriber) {
        if (existingSubscriber.active) {
          return res.status(409).json({ message: "Email already subscribed" });
        } else {
          // Reactivate the subscription
          await storage.updateSubscriber(existingSubscriber.id, { active: true });
          return res.status(200).json({ message: "Subscription reactivated" });
        }
      }
      
      // Add new subscriber
      const subscriber = await storage.createSubscriber(data);
      res.status(201).json({ message: "Successfully subscribed", subscriber });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: fromZodError(error).message
        });
      }
      
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });
  
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate request body
      const data = insertContactSchema.parse(req.body);
      
      // Save contact submission
      const contact = await storage.createContact(data);
      res.status(201).json({ message: "Contact form submitted successfully" });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: fromZodError(error).message 
        });
      }
      
      console.error("Error submitting contact form:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
