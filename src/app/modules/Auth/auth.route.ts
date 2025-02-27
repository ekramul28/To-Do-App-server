import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthControllers } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

// Step 1: Send Email OTP
router.post(
  "/sendmail",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.sendEmailOTP
);

// Step 2: Verify Email OTP
router.post(
  "/verify-email",
  validateRequest(AuthValidation.verifyEmailSchema),
  AuthControllers.verifyEmailOTP
);

// Step 3: Verify Google Authenticator & Issue Tokens
router.post(
  "/verify-google-auth",
  validateRequest(AuthValidation.verifyGoogleAuthSchema),
  AuthControllers.verifyGoogleAuth
);

// Logout (Clears refresh token cookie)
// router.post("/logout", AuthControllers.logout);

export const AuthRoutes = router;
