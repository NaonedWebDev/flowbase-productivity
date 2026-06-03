import { date, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  name: text("name"),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const calendarItems = pgTable("calendar_items", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  kind: text("kind").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull().default("draft"),
  scheduledDate: date("scheduled_date"),
  reminderTime: text("reminder_time"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type CalendarItem = typeof calendarItems.$inferSelect;
export type NewCalendarItem = typeof calendarItems.$inferInsert;
