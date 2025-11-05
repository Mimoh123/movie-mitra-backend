import { Response } from "express";
interface IResponse {
 success: boolean;
 message: string;
 data?: any;
}

export default class ResponseHandler {
 public static success(res: Response, message: string, data: any, status: number = 200) {
  const response: IResponse = {
   success: true,
   message,
   data,
  }
  if (data !== null) {
   response.data = data;
  }
  return res.status(status).json(response);
 }
 public static error(res: Response, error: Error, status: number = 500) {
  return res.status(status).json({
   success: false,
   message: error.message,
  });

 }
}