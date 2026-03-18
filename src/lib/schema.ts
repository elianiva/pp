import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const Paste = sqliteTable("Paste", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  language: text("language").notNull(),
  createdAt: integer("createdAt").notNull(),
});

export type PasteType = typeof Paste.$inferSelect;
