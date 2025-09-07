import jwt, { Secret, SignOptions } from "jsonwebtoken";

export interface JWTPayload {
 id: string;
 email: string;
}

const JWT_SECRET: Secret =
 process.env.JWT_SECRET ??
 (() => {
  throw new Error("JWT_SECRET is not defined in environment variables");
 })();

const REFRESH_TOKEN_EXPIRE: SignOptions["expiresIn"] =
 (process.env.REFRESH_TOKEN_EXPIRE as SignOptions["expiresIn"]) ?? "7d";

const ACCESS_TOKEN_EXPIRE: SignOptions["expiresIn"] =
 (process.env.ACCESS_TOKEN_EXPIRE as SignOptions["expiresIn"]) ?? "1h";

export default class JWTService {
 public static generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
   expiresIn: ACCESS_TOKEN_EXPIRE,
  });
 }

 public static generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
   expiresIn: REFRESH_TOKEN_EXPIRE,
  });
 }

 public static verifyToken<T extends object>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T;
 }
}
