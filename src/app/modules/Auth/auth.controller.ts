import { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

// Step 1: Send Email OTP
const sendEmailOTP = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.sendEmailOTP(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "A verification code has been sent to your email.",
    data: result,
  });
});

// Step 2: Verify Email OTP
const verifyEmailOTP = catchAsync(async (req: Request, res: Response) => {
  const { email, code } = req.body;

  if (!email || !code) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Email and OTP code are required."
    );
  }

  const result = await AuthServices.verifyEmailOTP(email, code);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Email OTP verified successfully.",
    data: result,
  });
});

const authLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.authLogin(req, res);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "login successful",
    data: result,
  });
});

// Step 3: Verify Google Authenticator & Issue Tokens
// const verifyGoogleAuth = catchAsync(async (req: Request, res: Response) => {
//   const { email, googleCode } = req.body;

//   if (!email || !googleCode) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "Email and Google Authenticator code are required."
//     );
//   }

//   const { accessToken, refreshToken } = await AuthServices.verifyGoogleAuth(
//     email,
//     googleCode
//   );

//   // Set Refresh Token in HTTP-only cookie
//   res.cookie("refreshToken", refreshToken, {
//     secure: config.NODE_ENV === "production",
//     httpOnly: true,
//     sameSite: "none",
//     maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
//   });

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Login successful!",
//     data: { accessToken },
//   });
// });

// Export Controllers
export const AuthControllers = {
  sendEmailOTP,
  verifyEmailOTP,
  authLogin,
  // verifyGoogleAuth,
};
