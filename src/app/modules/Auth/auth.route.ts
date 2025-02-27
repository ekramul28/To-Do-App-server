import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthControllers } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import passport from "../../utils/passport";
import config from "../../config";
import { createToken } from "./auth.utils";

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

// Google Authentication Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  AuthControllers.authLogin
);

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "http://localhost:3000/login",
//   }),
//   (req, res) => {
//     if (!req.user) {
//       return res.redirect("http://localhost:3000/login");
//     }

//     // Add role to user
//     const userWithRole = { ...req.user, role: "user" };

//     // Generate access token with updated user object
//     const accessToken = createToken(
//       userWithRole as any,
//       config.jwt_access_secret as string,
//       config.jwt_access_expires_in as string
//     );

//     console.log(userWithRole);
//     res.redirect(`http://localhost:5173/dashboard?token=${accessToken}`);
//   }
// );

// Logout Route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send("Error logging out");
    res.redirect("http://localhost:3000");
  });
});

// Step 3: Verify Google Authenticator & Issue Tokens
// router.post(
//   "/verify-google-auth",
//   validateRequest(AuthValidation.verifyGoogleAuthSchema),
//   AuthControllers.verifyGoogleAuth
// );

// Logout (Clears refresh token cookie)
// router.post("/logout", AuthControllers.logout);

export const AuthRoutes = router;
