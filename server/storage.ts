import { 
  users, type User, type InsertUser,
  subscribers, type Subscriber, type InsertSubscriber,
  contacts, type Contact, type InsertContact
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Subscriber methods
  getSubscriber(id: number): Promise<Subscriber | undefined>;
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  updateSubscriber(id: number, updates: Partial<Subscriber>): Promise<Subscriber>;
  
  // Contact methods
  getContact(id: number): Promise<Contact | undefined>;
  getContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: number, updates: Partial<Contact>): Promise<Contact>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private subscribers: Map<number, Subscriber>;
  private contacts: Map<number, Contact>;
  private userCurrentId: number;
  private subscriberCurrentId: number;
  private contactCurrentId: number;

  constructor() {
    this.users = new Map();
    this.subscribers = new Map();
    this.contacts = new Map();
    this.userCurrentId = 1;
    this.subscriberCurrentId = 1;
    this.contactCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Subscriber methods
  async getSubscriber(id: number): Promise<Subscriber | undefined> {
    return this.subscribers.get(id);
  }
  
  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    return Array.from(this.subscribers.values()).find(
      (subscriber) => subscriber.email === email
    );
  }
  
  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const id = this.subscriberCurrentId++;
    const subscriber: Subscriber = { 
      ...insertSubscriber, 
      id, 
      subscribedAt: new Date(), 
      active: true 
    };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }
  
  async updateSubscriber(id: number, updates: Partial<Subscriber>): Promise<Subscriber> {
    const subscriber = await this.getSubscriber(id);
    if (!subscriber) {
      throw new Error(`Subscriber with id ${id} not found`);
    }
    
    const updatedSubscriber = { ...subscriber, ...updates };
    this.subscribers.set(id, updatedSubscriber);
    return updatedSubscriber;
  }
  
  // Contact methods
  async getContact(id: number): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }
  
  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }
  
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.contactCurrentId++;
    const contact: Contact = { 
      ...insertContact, 
      id, 
      submittedAt: new Date(), 
      read: false 
    };
    this.contacts.set(id, contact);
    return contact;
  }
  
  async updateContact(id: number, updates: Partial<Contact>): Promise<Contact> {
    const contact = await this.getContact(id);
    if (!contact) {
      throw new Error(`Contact with id ${id} not found`);
    }
    
    const updatedContact = { ...contact, ...updates };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }
}

export const storage = new MemStorage();
