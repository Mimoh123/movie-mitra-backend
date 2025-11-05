import { Request, Response, NextFunction } from "express";
import JWTService from "../service/JWTService";
import ResponseHandler from "../handler/ResponseHandler";
import UserRepo from "../db/repository/UserRepo";





export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
 const token = req.headers.authorization?.split(" ")[1];
 if (!token) {
  ResponseHandler.error(res, new Error("Unauthorized"), 401);
  return;
 }
 try {

  const decoded = JWTService.verifyToken(token);
  if (!decoded.id) {
   ResponseHandler.error(res, new Error("Unauthorized"), 401);
  }
  const user = await UserRepo.getUserById(decoded.id)
  if (!user) {
   ResponseHandler.error(res, new Error("Unauthorized user"), 401);
   return;
  }
  req.body.userId = decoded.id
  next();
 } catch (error) {

  try {
   if (JWTService.isTokenExpiredMoreThanDays(token, 3)) {
    ResponseHandler.error(res, new Error("Token expired too long ago"), 401);
    return;
   }

   const expiredTokenPayload = JWTService.getPayloadFromExpiredToken(token);
   if (!expiredTokenPayload.id) {
    ResponseHandler.error(res, new Error("Unauthorized"), 401);
    return;
   }

   const user = await UserRepo.getUserById(expiredTokenPayload.id)
   if (!user) {
    ResponseHandler.error(res, new Error("User not found"), 401);
    return;
   }

   const refreshToken = user[0].refresh_token;
   if (!refreshToken) {
    ResponseHandler.error(res, new Error("No refresh token found"), 401);
    return;
   }

   const decodedRefreshToken = JWTService.verifyToken(refreshToken);
   if (!decodedRefreshToken.id || decodedRefreshToken.id !== expiredTokenPayload.id) {
    ResponseHandler.error(res, new Error("Invalid refresh token"), 401);
    return;
   }

   const newAccessToken = JWTService.generateAccessToken({ id: decodedRefreshToken.id, email: decodedRefreshToken.email })
   req.body.userId = decodedRefreshToken.id
   res.setHeader("Authorization", `Bearer ${newAccessToken}`);
   next();
  }
  catch (refreshError) {
   ResponseHandler.error(res, new Error("Please log in again,Unauthorized user"), 401);
  }
 }
}

