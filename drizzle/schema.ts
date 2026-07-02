import { date, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const weapons = mysqlTable("weapons", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // Pistola, Revólver, Rifle, Espingarda
  caliber: varchar("caliber", { length: 50 }).notNull(),
  manufacturer: varchar("manufacturer", { length: 255 }),
  description: text("description"),
  specifications: text("specifications"), // JSON com specs técnicas
  imageUrl: text("imageUrl"),
  inStock: int("inStock").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Weapon = typeof weapons.$inferSelect;
export type InsertWeapon = typeof weapons.$inferInsert;

export const ammunition = mysqlTable("ammunition", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  caliber: varchar("caliber", { length: 50 }).notNull(),
  manufacturer: varchar("manufacturer", { length: 255 }),
  description: text("description"),
  specifications: text("specifications"), // JSON com specs técnicas
  imageUrl: text("imageUrl"),
  unitsPerBox: int("unitsPerBox"),
  inStock: int("inStock").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Ammunition = typeof ammunition.$inferSelect;
export type InsertAmmunition = typeof ammunition.$inferInsert;

export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  duration: int("duration").notNull(), // em horas
  prerequisites: text("prerequisites"),
  instructor: varchar("instructor", { length: 255 }),
  maxParticipants: int("maxParticipants"),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

export const scheduleRequests = mysqlTable("schedule_requests", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  documentType: mysqlEnum("documentType", ["CAC", "RG"]).notNull(),
  documentNumber: varchar("documentNumber", { length: 50 }).notNull(),
  requestedDate: date("requestedDate").notNull(),
  requestedTime: varchar("requestedTime", { length: 5 }).notNull(), // HH:MM
  numberOfPeople: int("numberOfPeople").default(1),
  experience: mysqlEnum("experience", ["beginner", "intermediate", "advanced"]),
  observations: text("observations"),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "completed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ScheduleRequest = typeof scheduleRequests.$inferSelect;
export type InsertScheduleRequest = typeof scheduleRequests.$inferInsert;