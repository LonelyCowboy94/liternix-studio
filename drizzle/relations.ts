import { relations } from "drizzle-orm/relations";
import { messages, messageItems } from "./schema";

export const messageItemsRelations = relations(messageItems, ({one}) => ({
	message: one(messages, {
		fields: [messageItems.messageId],
		references: [messages.id]
	}),
}));

export const messagesRelations = relations(messages, ({many}) => ({
	messageItems: many(messageItems),
}));