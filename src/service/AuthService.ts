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
   const { name, id, email } = newUser[0]

   const refreshToken = JWTService.generateRefreshToken({ id: newUser[0].id, email: newUser[0].email })
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