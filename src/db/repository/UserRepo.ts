import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { User, UserInsert, userTable } from "../schema/User";


export default class UserRepo {
 public static async createUser(user: UserInsert) {
  return db.insert(userTable).values(user).returning().execute()
 }
 public static async getUsers() {
  return db.select().from(userTable).execute()
 }
 public static async getUserById(id: string) {
  return db.select().from(userTable).where(eq(userTable.id, id)).execute()
 }
 public static async getUserByEmail(email: string) {
  const user = await db.select().from(userTable).where(eq(userTable.email, email)).execute()
  return Array.isArray(user) ? user[0] : user
 }
 public static async getUserByResetToken(resetToken: string) {
  const user = await db.select().from(userTable).where(eq(userTable.reset_token, resetToken)).execute()
  return Array.isArray(user) ? user[0] : user
 }
 public static async updateUser(id: string, data: Partial<User>) {
  return db.update(userTable).set(data).where(eq(userTable.id, id)).returning().execute()
 }
 public static async deleteUser(id: string) {
  return db.delete(userTable).where(eq(userTable.id, id)).execute()
 }
}