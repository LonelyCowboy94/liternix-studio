import { pgTable, unique, uuid, text, boolean, timestamp, jsonb, serial, varchar, integer, foreignKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const messageStatus = pgEnum("message_status", ['unread', 'read', 'replied'])
export const role = pgEnum("role", ['USER', 'ADMIN'])


export const news = pgTable("news", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	subtitle: text(),
	excerpt: text(),
	content: text().notNull(),
	featured: boolean().default(false),
	author: text(),
	imageUrl: text("image_url"),
	slug: text().notNull(),
	status: text().default('draft'),
	publishedAt: timestamp("published_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	metaTitle: text("meta_title"),
	metaDescription: text("meta_description"),
}, (table) => [
	unique("news_slug_unique").on(table.slug),
]);

export const services = pgTable("services", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	subtitle: jsonb(),
	description: jsonb(),
	content: jsonb(),
	slug: text().notNull(),
	status: text().default('draft'),
	images: jsonb().default([]),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("services_slug_unique").on(table.slug),
]);

export const user = pgTable("user", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text(),
	email: text().notNull(),
	password: text(),
	role: role().default('USER'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const portfolioWork = pgTable("portfolio_work", {
	id: serial().primaryKey().notNull(),
	url: text().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	type: integer().default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	sortOrder: integer("sort_order").default(0),
});

export const messages = pgTable("messages", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text().notNull(),
	status: messageStatus().default('unread'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const messageItems = pgTable("message_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	messageId: uuid("message_id"),
	sender: text().notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.messageId],
			foreignColumns: [messages.id],
			name: "message_items_message_id_messages_id_fk"
		}).onDelete("cascade"),
]);
