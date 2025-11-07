import UserRepo from "../db/repository/UserRepo"
import { User } from "../db/schema/User"


export default class UserService {
 public static async getUserById(id: string) {
  try {
   const user = await UserRepo.getUserById(id)
   const { password, refresh_token, ...userData } = user[0]
   return userData
  } catch (error) {
   if (error instanceof Error) throw error
   else throw new Error("Failed to get user by id")
  }
 }
 public static async getUserByEmail(email: string) {
  try {
   const user = await UserRepo.getUserByEmail(email)
   return user
  } catch (error) {
   if (error instanceof Error) throw error
   else throw new Error("Failed to get user by email")
  }
 }
 public static async updateUser(id: string, data: Partial<User>) {
  try {
   const user = await UserRepo.updateUser(id, data)
   return user
  } catch (error) {
   if (error instanceof Error) throw error
   else throw new Error("Failed to update user")
  }
 }
 public static async deleteUser(id: string) {
  try {
   const existingUser = await UserRepo.getUserById(id)
   if (!existingUser) throw new Error("User not found")
   const user = await UserRepo.deleteUser(id)
   return user
  } catch (error) {
   if (error instanceof Error) throw error
   else throw new Error("Failed to delete user")
  }
 }
}