import jwt, { Secret, SignOptions } from "jsonwebtoken";

export interface JWTPayload {
 id: string;
 email: string;
}

const JWT_SECRET: Secret =
 process.env.JWT_SECRET ?? "secret";


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

 public static verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
 }

 public static getTokenExpirationTime(token: string): number | null {
  try {
   const decoded = jwt.decode(token) as any;
   return decoded?.exp ? decoded.exp * 1000 : null;
  } catch (error) {
   return null;
  }
 }

 public static isTokenExpiredMoreThanDays(token: string, days: number): boolean {
  const expirationTime = this.getTokenExpirationTime(token);
  if (!expirationTime) return true;

  const daysSinceExpiration = (Date.now() - expirationTime) / (1000 * 60 * 60 * 24);
  return daysSinceExpiration > days;
 }


 public static getPayloadFromExpiredToken(token: string) {
  try {
   return jwt.decode(token) as JWTPayload;
  } catch (error) {
   throw new Error("Invalid token format");
  }
 }
}
