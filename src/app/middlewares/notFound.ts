import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

// Updated notFound middleware with explicit return type
const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API Not Found !!",
    error: "",
  });
};

export default notFound;
