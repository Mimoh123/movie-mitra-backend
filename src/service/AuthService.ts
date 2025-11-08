import UserRepo from "../db/repository/UserRepo";
import { User, UserInsert } from "../db/schema/User";
import { Password } from "../utils/utils";
import JWTService from "./JWTService";
import EmailService from "./EmailService";
import crypto from "crypto";



export default class AuthService {
 public static async register(data: UserInsert) {

  try {
   const existingUser = await UserRepo.getUserByEmail(data.email)
   if (existingUser) {
    throw new Error("User already exists")
   }
   const hashedPassword = Password.hash(data.password)
   const newUserData: UserInsert = { ...data, password: hashedPassword }
   const newUser = await UserRepo.createUser(newUserData)
   const { name, id, email } = newUser[0]

   const refreshToken = JWTService.generateRefreshToken({ id: newUser[0].id, email: newUser[0].email })
   console.log("this is the refresh token", refreshToken);
   const userWithAccessToken = await UserRepo.updateUser(newUser[0].id, { refresh_token: refreshToken })
   return { name, id, email }
  }
  catch (err) {
   if (err instanceof Error) throw err
   else throw new Error("Failed to register user")
  }
 }
 public static async login(email: string, passcode: string) {
  try {

   const existingUser = await UserRepo.getUserByEmail(email)

   if (!existingUser) {
    throw new Error("User doesnot exist")
   }
   if (!Password.comparePassword(passcode, existingUser.password)) {
    throw new Error("Invalid email or password")
   }
   const token = JWTService.generateAccessToken({ id: existingUser.id, email: existingUser.email })
   return token

  }
  catch (err) {
   if (err instanceof Error) throw err
   else throw new Error("Failed to login")
  }
 }

 public static async forgotPassword(email: string) {
  try {
   const user = await UserRepo.getUserByEmail(email)

   if (!user) {
    // Don't reveal if user exists or not for security
    return { message: "If the email exists, a password reset link has been sent." }
   }

   // Generate reset token
   const resetToken = crypto.randomBytes(32).toString("hex")
   const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

   // Save reset token to database
   await UserRepo.updateUser(user.id, {
    reset_token: resetToken,
    reset_token_expiry: resetTokenExpiry,
   })

   // Send password reset email
   await EmailService.sendPasswordResetEmail(email, resetToken, user.name || undefined)

   return { message: "If the email exists, a password reset link has been sent." }
  } catch (err) {
   if (err instanceof Error) throw err
   else throw new Error("Failed to process password reset request")
  }
 }

 public static async resetPassword(token: string, newPassword: string) {
  try {
   // Find user by reset token
   const user = await UserRepo.getUserByResetToken(token)

   if (!user) {
    throw new Error("Invalid or expired reset token")
   }

   // Check if token has expired
   if (!user.reset_token_expiry || new Date(user.reset_token_expiry) < new Date()) {
    throw new Error("Reset token has expired. Please request a new one.")
   }

   // Hash new password
   const hashedPassword = Password.hash(newPassword)

   // Update password and clear reset token
   await UserRepo.updateUser(user.id, {
    password: hashedPassword,
    reset_token: null,
    reset_token_expiry: null,
   })

   return { message: "Password has been reset successfully" }
  } catch (err) {
   if (err instanceof Error) throw err
   else throw new Error("Failed to reset password")
  }
 }

 public static async changePassword(userId: string, currentPassword: string, newPassword: string) {
  try {
   // Get user by ID
   const users = await UserRepo.getUserById(userId)
   const user = users[0]

   if (!user) {
    throw new Error("User not found")
   }

   // Verify current password
   if (!Password.comparePassword(currentPassword, user.password)) {
    throw new Error("Current password is incorrect")
   }

   // Validate new password length
   if (newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters long")
   }

   // Hash new password
   const hashedPassword = Password.hash(newPassword)

   // Update password
   await UserRepo.updateUser(userId, {
    password: hashedPassword,
   })

   return { message: "Password has been changed successfully" }
  } catch (err) {
   if (err instanceof Error) throw err
   else throw new Error("Failed to change password")
  }
 }
}