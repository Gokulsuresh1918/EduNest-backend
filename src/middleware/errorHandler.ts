import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.log(err);
  
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
};