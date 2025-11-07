import { WatchListInsert } from "../../db/schema/WatchList"
import ResponseHandler from "../../handler/ResponseHandler"
import WatchListService from "../../service/WatchListService"
import { Request, Response } from "express"



export default class WatchListController {
 public static async createWatchList(req: Request, res: Response) {
  try {
   const userId = req.body.userId
   if (!userId) {
    ResponseHandler.error(res, new Error("User ID is required"), 400)
    return
   }
   const id = req.body.id
   if (typeof id !== 'number') {
    ResponseHandler.error(res, new Error("Movie ID must be a number"), 400)
    return
   }
   const watchListData = req.body as WatchListInsert

   if (!id || !watchListData.title || !watchListData.overview || !watchListData.poster_path || !watchListData.backdrop_path) {
    ResponseHandler.error(res, new Error("All fields are required"), 400)
    return
   }

   const { id: _, ...watchListWithoutId } = watchListData
   const watchList = { ...watchListWithoutId, user_id: userId, movie_id: id }
   const newWatchList = await WatchListService.createWatchList(watchList)
   ResponseHandler.success(res, "Watch list created successfully", newWatchList, 201)
  }
  catch (error) {
   if (error instanceof Error) ResponseHandler.error(res, error, 500)
   else ResponseHandler.error(res, new Error("Failed to create watch list"), 500)
  }
 }



 public static async getWatchLists(req: Request, res: Response) {
  try {
   const watchLists = await WatchListService.getWatchLists()
   ResponseHandler.success(res, "Watch lists fetched successfully", watchLists, 200)
  }
  catch (error) {
   if (error instanceof Error) ResponseHandler.error(res, error, 500)
   else ResponseHandler.error(res, new Error("Failed to get watch lists"), 500)
  }
 }



 public static async getWatchListById(req: Request, res: Response) {
  try {
   const watchList = await WatchListService.getWatchListById(req.params.id)
   ResponseHandler.success(res, "Watch list fetched successfully", watchList)
  }
  catch (error) {
   if (error instanceof Error) ResponseHandler.error(res, error, 500)
   else ResponseHandler.error(res, new Error("Failed to get watch list"), 500)
  }
 }



 public static async getWatchListsByUserId(req: Request, res: Response) {
  try {
   console.log("insdie ")
   const userId = req.body.userId
   console.log("this is the userId", userId);
   if (!userId) {
    ResponseHandler.error(res, new Error("User ID is required"), 500)
   }
   const watchLists = await WatchListService.getWatchListsByUserId(userId)
   ResponseHandler.success(res, "Watch lists fetched successfully", watchLists)
  }
  catch (error) {
   if (error instanceof Error) ResponseHandler.error(res, error, 500)
   else ResponseHandler.error(res, new Error("Failed to get watch lists"), 500)
  }
 }



 public static async updateWatchList(req: Request, res: Response) {
  try {
   const watchList = await WatchListService.updateWatchList(req.params.id, req.body)
   ResponseHandler.success(res, "Watch list updated successfully", watchList)
  }
  catch (error) {
   if (error instanceof Error) ResponseHandler.error(res, error, 500)
   else ResponseHandler.error(res, new Error("Failed to update watch list"), 500)
  }
 }



 public static async deleteWatchList(req: Request, res: Response) {
  try {
   const watchList = await WatchListService.deleteWatchList(req.params.id)
   ResponseHandler.success(res, "Watch list deleted successfully", watchList)
  }
  catch (error) {
   if (error instanceof Error) ResponseHandler.error(res, error, 500)
   else ResponseHandler.error(res, new Error("Failed to delete watch list"), 500)
  }
 }
}