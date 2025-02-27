import bcrypt from "bcrypt";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import AppError from "../../errors/AppError";
import { sendEmail } from "../../utils/sendEmail";
import { User } from "../User/user.model";
import { TLoginUser } from "./auth.interface";
import { createToken, generateMailCode, verifyToken } from "./auth.utils";
import { redisClient } from "../../utils/redisClient";
import { verifyTOTP } from "../../utils/totpUtils";

// Step 1: Send Email OTP
const sendEmailOTP = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This account is deleted!");
  }

  if (user.userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This account is blocked!");
  }

  if (
    !user.password ||
    !(await bcrypt.compare(payload.password, user.password))
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect email or password.");
  }

  // Generate OTP and store it in Redis
  const mailCode = generateMailCode(); // 6-digit OTP
  await redisClient.setEx(`mailCode:${user.email}`, 120, mailCode); // Expires in 2 minutes
  await sendEmail(user.email, mailCode); // Send OTP to email

  return {
    message: "A 6-digit code has been sent to your email. Please verify.",
    step: "mail_verification",
    redirectUrL: `/mail?email=${user.email}`,
  };
};

// Step 2: Verify Email OTP
const verifyEmailOTP = async (email: string, code: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }
  const storedCode = await redisClient.get(`mailCode:${email}`);

  if (!storedCode || storedCode !== code) {
    throw new AppError(httpStatus.FORBIDDEN, "Invalid or expired OTP.");
  }

  // Delete OTP after verification
  await redisClient.del(`mailCode:${email}`);

  // Generate JWT tokens
  const jwtPayload = {
    userId: user.email,
    name: user.name,
    picture: user.profileImg,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    message: "Login successful!",
  };
};

const authLogin = async (req: any, res: any) => {
  if (!req.user) {
    return res.redirect("http://localhost:3000/login");
  }

  // Add role to user
  const userWithRole = { ...req.user, role: "user" };

  // Generate access token
  const accessToken = createToken(
    userWithRole,
    process.env.JWT_ACCESS_SECRET as string,
    process.env.JWT_ACCESS_EXPIRES_IN as string
  );

  console.log(userWithRole);

  res.redirect(`http://localhost:5173/dashboard?token=${accessToken}`);
};

// Step 3: Verify Google Authenticator Code and Generate Tokens
// const verifyGoogleAuth = async (email: string, googleCode: string) => {
//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, "User not found.");
//   }

//   if (!user.googleSecret) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "Google Authenticator not set up."
//     );
//   }

//   // Verify Google Authenticator Code
//   if (!verifyTOTP(googleCode, user.googleSecret)) {
//     throw new AppError(
//       httpStatus.FORBIDDEN,
//       "Invalid Google Authenticator code."
//     );
//   }

//   // Generate JWT tokens
//   const jwtPayload = {
//     userId: user._id.toString(),
//     role: user.role,
//   };

//   const accessToken = createToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     config.jwt_access_expires_in as string
//   );
//   const refreshToken = createToken(
//     jwtPayload,
//     config.jwt_refresh_secret as string,
//     config.jwt_refresh_expires_in as string
//   );

//   return {
//     accessToken,
//     refreshToken,
//     message: "Login successful!",
//   };
// };

// Export all authentication services
export const AuthServices = {
  sendEmailOTP,
  verifyEmailOTP,
  authLogin,
  // verifyGoogleAuth,
};
