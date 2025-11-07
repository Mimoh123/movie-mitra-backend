import WatchListRepo from "../db/repository/WatchListRepo";
import { WatchListInsert } from "../db/schema/WatchList";


export default class WatchListService {

 public static async createWatchList(watchList: WatchListInsert) {
  try {
   console.log("this is the watch list", watchList);
   const existingWatchList = await WatchListRepo.getWatchListByUserAndMovieId(watchList.user_id, watchList.movie_id)
   if (existingWatchList.length > 0) throw new Error("Watch list already exists")
   const newWatchList = await WatchListRepo.createWatchList(watchList)
   if (newWatchList.length === 0) throw new Error("Failed to create watch list")
   return newWatchList[0]
  }
  catch (err) {
   if (err instanceof Error) throw err
   else throw new Error("Failed to create watch list")
  }
 }

 public static async getWatchLists() {
  try {
   const watchLists = await WatchListRepo.getWatchLists()
   if (watchLists.length === 0) throw new Error("No watch lists found")
   return watchLists
  }
  catch (err) {
   if (err instanceof Error) throw err
   else throw new Error("Failed to get watch lists")
  }
 }
 public static async getWatchListById(id: string) {
  try {
   const watchList = await WatchListRepo.getWatchListById(id)
   if (watchList.length === 0) throw new Error("Watch list not found")
   return watchList[0]
  }
  catch (err) {
   if (err instanceof Error) throw err
   else throw new Error("Failed to get watch list")
  }
 }

 public static async getWatchListsByUserId(userId: string) {
  try {
   const watchLists = await WatchListRepo.getWatchListsByUserId(userId)
   if (watchLists.length === 0) throw new Error("No watch lists found")
   return watchLists
  }
  catch (err) {
   if (err instanceof Error) throw err
   else throw new Error("Failed to get watch lists")
  }
 }

 public static async updateWatchList(id: string, watchList: Partial<WatchListInsert>) {
  try {
   const updatedWatchList = await WatchListRepo.updateWatchList(id, watchList)
   if (updatedWatchList.length === 0) throw new Error("Failed to update watch list")
   return updatedWatchList[0]
  }
  catch (err) {
   if (err instanceof Error) throw err
   else throw new Error("Failed to update watch list")
  }
 }

 public static async deleteWatchList(id: string) {
  try {
   const existingWatchList = await WatchListRepo.getWatchListById(id)
   if (existingWatchList.length === 0) throw new Error("Watch list not found")
   await WatchListRepo.deleteWatchList(id)
   return { message: "Watch list deleted successfully" }
  }
  catch (error) {
   if (error instanceof Error) throw error
   else throw new Error("Failed to delete watch list")
  }
 }
}