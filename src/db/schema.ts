import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),

  title: text("title").notNull(),

  slug: text("slug").notNull().unique(),

  description: text("description"),

  coverImage: text("cover_image"),

  featured: boolean("featured").default(false).notNull(),

  published: boolean("published").default(false).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
