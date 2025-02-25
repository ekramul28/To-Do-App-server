/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response, NextFunction } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import router from "./app/routes";

const app: Application = express();

// Parsers
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

// Application routes
app.use("/api/v1", router);

// Test route
app.get("/", (req: Request, res: Response) => {
  res.send("Hi Next Level Developer !");
});

// Global error handler middleware
app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Api Not Found",
    error: {
      path: req.originalUrl,
      message: `${req.originalUrl} This Path is not valid`,
    },
  });
});
export default app;
