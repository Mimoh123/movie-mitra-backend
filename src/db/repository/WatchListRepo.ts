import { and, eq } from "drizzle-orm";
import { db } from "../drizzle"
import { WatchListInsert, watchListTable } from "../schema/WatchList"



export default class WatchListRepo {
 public static async createWatchList(watchList: WatchListInsert) {
  return db.insert(watchListTable).values(watchList).returning().execute()
 }
 public static async getWatchLists() {
  return db.select().from(watchListTable).execute()
 }
 public static async getWatchListById(id: string) {
  return db.select().from(watchListTable).where(eq(watchListTable.id, id)).execute()
 }
 public static async getWatchListsByUserId(userId: string) {
  return db.select().from(watchListTable).where(eq(watchListTable.user_id, userId)).execute()
 }
 public static async updateWatchList(id: string, watchList: Partial<WatchListInsert>) {
  return db.update(watchListTable).set(watchList).where(eq(watchListTable.id, id)).returning().execute()
 }
 public static async deleteWatchList(id: string) {
  return db.delete(watchListTable).where(eq(watchListTable.id, id)).execute()
 }

 public static async deleteWatchListByUserAndMovieId(userId: string, movieId: number) {
  return db.delete(watchListTable).where(and(eq(watchListTable.user_id, userId), eq(watchListTable.movie_id, movieId))).returning().execute()
 }

 public static async getWatchListByUserAndMovieId(userId: string, movieId: number) {
  return db.select().from(watchListTable).where(and(eq(watchListTable.user_id, userId), eq(watchListTable.movie_id, movieId))).execute()
 }
}