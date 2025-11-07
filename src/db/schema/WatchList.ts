import { boolean, date, integer, pgTable, real, text, uuid, varchar } from "drizzle-orm/pg-core";
import { userTable } from "./User";



export const watchListTable = pgTable("watch_list", {
 id: uuid("id").defaultRandom().notNull().primaryKey(),
 user_id: uuid("user_id").references(() => userTable.id, { onDelete: "cascade" }).notNull(),
 adult: boolean("adult").notNull(),
 backdrop_path: varchar("backdrop_path", { length: 1024 }).notNull(),
 genre_ids: integer("genre_ids").array().notNull(),
 movie_id: integer("movie_id").notNull(),
 original_language: varchar("original_language", { length: 20 }).notNull(),
 original_title: varchar("original_title", { length: 255 }).notNull(),
 overview: text("overview").notNull(),
 popularity: real("popularity").notNull(),
 poster_path: varchar("poster_path", { length: 1024 }).notNull(),
 release_date: date("release_date").notNull(),
 title: varchar("title", { length: 255 }).notNull(),
 video: boolean("video").notNull(),
 vote_average: real("vote_average").notNull(),
 vote_count: integer("vote_count").notNull(),
 created_at: date("created_at").defaultNow(),
 updated_at: date("updated_at").defaultNow(),
})

export type WatchList = typeof watchListTable.$inferSelect
export type WatchListInsert = typeof watchListTable.$inferInsert