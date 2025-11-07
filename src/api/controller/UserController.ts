import { User } from "../../db/schema/User"
import ResponseHandler from "../../handler/ResponseHandler"
import UserService from "../../service/UserService"
import { Request, Response } from "express"


export default class UserController {
 public static async getUserById(req: Request, res: Response) {
  try {
   const userId = req.body.userId
   if (!userId) {
    ResponseHandler.error(res, new Error("User ID is required"), 400)
    return
   }
   const user = await UserService.getUserById(userId)
   ResponseHandler.success(res, "User fetched successfully", user, 200)
  } catch (error) {
   if (error instanceof Error) ResponseHandler.error(res, error, 500)
   else ResponseHandler.error(res, new Error("Failed to get user by id"), 500)
  }
 }

 public static async getUserByEmail(req: Request, res: Response) {
  try {
   const email = req.body.email
   if (!email) {
    ResponseHandler.error(res, new Error("Email is required"), 400)
    return
   }
   const user = await UserService.getUserByEmail(email)
   ResponseHandler.success(res, "User fetched successfully", user, 200)
  } catch (error) {
   if (error instanceof Error) ResponseHandler.error(res, error, 500)
   else ResponseHandler.error(res, new Error("Failed to get user by email"), 500)
  }
 }

 public static async updateUser(req: Request, res: Response) {
  try {
   const userId = req.body.userId
   if (!userId) {
    ResponseHandler.error(res, new Error("User ID is required"), 400)
    return
   }
   const userData = req.body as Partial<User>
   const user = await UserService.updateUser(userId, userData)
   ResponseHandler.success(res, "User updated successfully", user, 200)
  } catch (error) {
   if (error instanceof Error) ResponseHandler.error(res, error, 500)
   else ResponseHandler.error(res, new Error("Failed to update user"), 500)
  }
 }

 public static async deleteUser(req: Request, res: Response) {
  try {
   const userId = req.params.id
   if (!userId) {
    ResponseHandler.error(res, new Error("User ID is required"), 400)
    return
   }
   const user = await UserService.deleteUser(userId)
   ResponseHandler.success(res, "User deleted successfully", user, 200)
  } catch (error) {
   if (error instanceof Error) ResponseHandler.error(res, error, 500)
   else ResponseHandler.error(res, new Error("Failed to delete user"), 500)
  }
 }
}