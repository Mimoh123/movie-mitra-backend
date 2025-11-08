
import { Request, Response } from "express";
import { UserInsert } from "../../db/schema/User";
import AuthService from "../../service/AuthService";
import ResponseHandler from "../../handler/ResponseHandler";
import EmailService from "../../service/EmailService";

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
  catch (error: unknown) {
   if (error instanceof Error) {
    ResponseHandler.error(res, error, 500);
    return;
   }
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
   if (error instanceof Error) {
    ResponseHandler.error(res, error, 500);
    return;
   }
   ResponseHandler.error(res, new Error("Failed to login user"), 500);
  }
 }

 public static async forgotPassword(req: Request, res: Response) {
  try {
   const { email } = req.body as { email: string };
   if (!email) {
    ResponseHandler.error(res, new Error("Email is required"), 400);
    return;
   }
   const result = await AuthService.forgotPassword(email);
   ResponseHandler.success(res, result.message, null, 200);
  } catch (error) {
   if (error instanceof Error) {
    ResponseHandler.error(res, error, 500);
    return;
   }
   ResponseHandler.error(res, new Error("Failed to process password reset request"), 500);
  }
 }

 public static async resetPassword(req: Request, res: Response) {
  try {
   const { token, password } = req.body as { token: string; password: string };
   if (!token || !password) {
    ResponseHandler.error(res, new Error("Token and password are required"), 400);
    return;
   }
   if (password.length < 6) {
    ResponseHandler.error(res, new Error("Password must be at least 6 characters long"), 400);
    return;
   }
   const result = await AuthService.resetPassword(token, password);
   ResponseHandler.success(res, result.message, null, 200);
  } catch (error) {
   if (error instanceof Error) {
    ResponseHandler.error(res, error, 400);
    return;
   }
   ResponseHandler.error(res, new Error("Failed to reset password"), 500);
  }
 }

 public static async testEmailConnection(req: Request, res: Response) {
  try {
   const isConnected = await EmailService.verifyConnection();
   if (isConnected) {
    ResponseHandler.success(res, "Email service connection successful", null, 200);
   } else {
    ResponseHandler.error(res, new Error("Email service connection failed"), 500);
   }
  } catch (error) {
   if (error instanceof Error) {
    ResponseHandler.error(res, error, 500);
    return;
   }
   ResponseHandler.error(res, new Error("Failed to test email connection"), 500);
  }
 }

 public static async changePassword(req: Request, res: Response) {
  try {
   const userId = req.body.userId;
   const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };

   if (!userId) {
    ResponseHandler.error(res, new Error("User ID is required"), 400);
    return;
   }

   if (!currentPassword || !newPassword) {
    ResponseHandler.error(res, new Error("Current password and new password are required"), 400);
    return;
   }

   if (newPassword.length < 6) {
    ResponseHandler.error(res, new Error("New password must be at least 6 characters long"), 400);
    return;
   }

   const result = await AuthService.changePassword(userId, currentPassword, newPassword);
   ResponseHandler.success(res, result.message, null, 200);
  } catch (error) {
   if (error instanceof Error) {
    ResponseHandler.error(res, error, 400);
    return;
   }
   ResponseHandler.error(res, new Error("Failed to change password"), 500);
  }
 }
}