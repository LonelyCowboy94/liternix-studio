import {
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
  boolean,
  jsonb,
  varchar,
  serial,
  integer,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);

export const users = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  password: text("password"),
  role: roleEnum("role").default("USER"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const news = pgTable("news", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featured: boolean("featured").default(false),
  author: text("author"),
  image_url: text("image_url"),
  slug: text("slug").notNull().unique(),
  status: text("status").default("draft"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
});

export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  subtitle: jsonb("subtitle").$type<{ text: string; highlight?: boolean }[]>(),
  description: jsonb("description").$type<{ text: string; highlight?: boolean }[]>(),
  content: jsonb("content").$type<{ text: string; highlight?: boolean }[]>(),
  slug: text("slug").notNull().unique(),
  status: text("status").default("draft"),
  images: jsonb("images").$type<{ url: string; alt?: string }[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messageStatusEnum = pgEnum("message_status", ["unread", "read", "replied"]);

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message").notNull(),
  status: messageStatusEnum("status").default("unread"),
  replyContent: text("reply_content"),
  repliedAt: timestamp("replied_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const portfolioWork = pgTable("portfolio_work", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: integer("type").default(0), // 1 = Featured, 0 = Normal
  sortOrder: integer("sort_order").default(0), // DODAJ OVO ZA REDOSLED
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PortfolioWork = typeof portfolioWork.$inferSelect;
export type NewPortfolioWork = typeof portfolioWork.$inferInsert;