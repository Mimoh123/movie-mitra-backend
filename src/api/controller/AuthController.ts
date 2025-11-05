
import { Request, Response } from "express";
import { UserInsert } from "../../db/schema/User";
import AuthService from "../../service/AuthService";
import ResponseHandler from "../../handler/ResponseHandler";

export default class AuthController {
 public static async register(req: Request, res: Response) {
  try {
   const userData = req.body as UserInsert
   if (!userData.name || !userData.email || !userData.password) {
    ResponseHandler.error(res, new Error("All fields are required"), 400);
    return;
   }
   const user = await AuthService.register(userData);
   ResponseHandler.success(res, "User registered successfully", user, 201);
  }
  catch (error) {
   ResponseHandler.error(res, new Error("Failed to register user"), 500);
  }
 }

 public static async login(req: Request, res: Response) {
  try {
   const { email, password } = req.body as { email: string, password: string }
   if (!email || !password) {
    ResponseHandler.error(res, new Error("All fields are required"), 400);
    return;
   }
   const token = await AuthService.login(email, password);
   ResponseHandler.success(res, "Login successful", { token: token }, 200);
  }
  catch (error) {
   ResponseHandler.error(res, new Error("Failed to login user"), 500);
  }
 }
}