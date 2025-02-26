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

import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
dotenv.config();
// Parsers
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error(
    "SESSION_SECRET is not defined in the environment variables."
  );
}
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Google Authentication Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {
    // Redirect user to frontend with token
    res.redirect(`http://localhost:3000/dashboard?token=${req.user}`);
  }
);

// Logout Route
app.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send("Error logging out");
    res.redirect("http://localhost:3000");
  });
});

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
