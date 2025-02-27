import { z } from "zod";

// Login Validation Schema
const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required." })
      .email({ message: "Invalid email format." }),
    password: z
      .string({ required_error: "Password is required." })
      .min(6, { message: "Password must be at least 6 characters long." }),
  }),
});

// Email Verification Schema (for OTP)
const verifyEmailSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required." })
      .email({ message: "Invalid email format." }),
    code: z
      .string({ required_error: "OTP code is required." })
      .length(6, { message: "OTP code must be exactly 6 digits." }),
  }),
});

// Google Authenticator Verification Schema
const verifyGoogleAuthSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required." })
      .email({ message: "Invalid email format." }),
    googleCode: z
      .string({ required_error: "Google Authenticator code is required." })
      .length(6, {
        message: "Google Authenticator code must be exactly 6 digits.",
      }),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  verifyEmailSchema,
  verifyGoogleAuthSchema,
};
