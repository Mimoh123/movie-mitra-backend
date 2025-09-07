import UserRepo from "../db/repository/UserRepo";
import { User, UserInsert } from "../db/schema/User";
import { Password } from "../utils/utils";
import JWTService from "./JWTService";



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
   return Array.isArray(newUser) ? newUser[0] : newUser
  }
  catch (err) {
   if (err instanceof Error) throw err
   else throw new Error("Failed to register user")
  }
 }
 public static async login(email: string, passcode: string) {
  try {
   if (email || passcode) {
    throw new Error("Email and password are required")
   }
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
}