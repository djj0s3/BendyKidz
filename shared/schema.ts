import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users (for admin access)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Newsletter subscribers
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  active: boolean("active").default(true).notNull()
});

export const insertSubscriberSchema = createInsertSchema(subscribers).pick({
  email: true,
});

export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;

// Contact form submissions
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  read: boolean("read").default(false).notNull()
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

// Types for Contentful data models
export interface Author {
  id: string;
  name: string;
  avatar: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  publishedDate: string;
  readingTime: number;
  author: Author;
  category: Category;
  tags: string[];
}

export interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
}

export interface TestimonialsSection {
  title: string;
  subtitle?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export interface AboutContent {
  title: string;
  subtitle: string;
  description: string;
  mission: string;
  image: string;
  imageAlt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

export interface HeroSection {
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  primaryButtonColor?: string;
  primaryButtonTextColor?: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  secondaryButtonColor?: string;
  secondaryButtonTextColor?: string;
}

export interface SiteStats {
  resources: number;
  specialists: number;
  activityTypes: number;
}

export interface FeaturedCollection {
  id: string;
  title: string;
  description: string;
  displayOrder: number;
  filterType: 'category' | 'tag' | 'featured';
  filterValue: string;
  maxItems: number;
  active: boolean;
}

export interface NavigationItem {
  label: string;
  url: string;
  order: number;
}

export interface Header {
  title: string;
  logoUrl?: string;
  navigationItems: NavigationItem[];
  searchPlaceholder: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface QuickLink {
  label: string;
  url: string;
}

export interface FooterSection {
  title: string;
  links: QuickLink[];
}

export interface ContactInfo {
  title: string;
  address: string;
  phone: string;
  email: string;
}

export interface PolicyLink {
  label: string;
  url: string;
}

export interface Footer {
  title: string;
  description: string;
  socialLinks: SocialLink[];
  quickLinks: FooterSection;
  contactInfo: ContactInfo;
  copyrightText: string;
  policies: PolicyLink[];
}

export interface ContactPageInfo {
  title: string;
  subtitle: string;
  officeLocation: string;
  phoneNumber: string;
  email: string;
  officeHours: string;
  messageFormTitle: string;
  socialFacebook: string;
  socialTwitter: string;
  socialInstagram: string;
  socialPinterest: string;
  mapTitle: string;
  mapEmbedUrl: string;
}
