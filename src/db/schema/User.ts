import { date, pgTable, uuid, varchar } from "drizzle-orm/pg-core";


export const userTable = pgTable("users", {
 id: uuid("id").defaultRandom().notNull().primaryKey(),
 name: varchar({ length: 255 }).default("User"),
 email: varchar({ length: 255 }).notNull().unique(),
 password: varchar({ length: 255 }).notNull(),
 refresh_token: varchar({ length: 1024 }),
 created_at: date("created_at").defaultNow(),
 updated_at: date("updated_at").defaultNow(),
})

export type User = typeof userTable.$inferSelect
export type UserInsert = typeof userTable.$inferInsert