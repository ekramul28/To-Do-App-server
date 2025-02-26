"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const sendEmail_1 = require("../../utils/sendEmail");
const user_model_1 = require("../User/user.model");
const auth_utils_1 = require("./auth.utils");
// import { verifyTOTP } from "../utils/totp";
// import { redisClient } from "../config/redis";
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Checking if the user exists
    const user = yield user_model_1.User.isUserExistsById(payload.id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user is not found!");
    }
    // Checking if the user is deleted
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is deleted!");
    }
    // Checking if the user is blocked
    if (user.userStatus === "blocked") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is blocked!");
    }
    // Checking if the password is correct
    if (!(yield user_model_1.User.isPasswordMatched(payload.password, user.password))) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Password does not match!");
    }
    // Step 1: Generate Mail Code and store it
    const mailCode = (0, auth_utils_1.generateMailCode)(); // Generates a 6-digit code
    yield redisClient.setEx(`mailCode:${user.email}`, 120, mailCode); // Store in Redis for 2 minutes
    yield (0, sendEmail_1.sendEmail)(user.email, mailCode); // Send the mail code
    return {
        message: "A 6-digit code has been sent to your email. Please verify.",
        step: "mail_verification",
    };
});
// Function to verify Mail Code
const verifyMailCode = (email, code) => __awaiter(void 0, void 0, void 0, function* () {
    const storedCode = yield redisClient.get(`mailCode:${email}`);
    if (!storedCode || storedCode !== code) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Invalid or expired mail code.");
    }
    // Step 2: Ask for Google Authenticator Code
    return {
        message: "Please enter your Google Authenticator 6-digit code.",
        step: "google_auth_verification",
    };
});
// Function to verify Google Authenticator Code and complete login
const verifyGoogleAuth = (email, googleCode) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    // // Verify Google Authenticator Code
    // if (!verifyTOTP(googleCode, user.googleSecret)) {
    //   throw new AppError(
    //     httpStatus.FORBIDDEN,
    //     "Invalid Google Authenticator code."
    //   );
    // }
    // Generate JWT tokens after all verifications
    const jwtPayload = {
        userId: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        message: "Login successful!",
    };
});
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExistsById(userData.userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user is not found !");
    }
    // checking if the user is already deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is deleted !");
    }
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.userStatus;
    if (userStatus === "blocked") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is blocked ! !");
    }
    //checking if the password is correct
    if (!(yield user_model_1.User.isPasswordMatched(payload.oldPassword, user === null || user === void 0 ? void 0 : user.password)))
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Password do not matched");
    //hash new password
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    yield user_model_1.User.findOneAndUpdate({
        id: userData.userId,
        role: userData.role,
    }, {
        password: newHashedPassword,
        passwordChangedAt: new Date(),
    });
    return null;
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the given token is valid
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    const { userId, iat } = decoded;
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExistsById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user is not found !");
    }
    // checking if the user is already deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is deleted !");
    }
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.userStatus;
    if (userStatus === "blocked") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is blocked ! !");
    }
    const jwtPayload = {
        userId: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
});
const forgetPassword = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExistsById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user is not found !");
    }
    // checking if the user is already deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is deleted !");
    }
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.userStatus;
    if (userStatus === "blocked") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is blocked ! !");
    }
    const jwtPayload = {
        userId: user.email,
        role: user.role,
    };
    const resetToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, "10m");
    const resetUILink = `${config_1.default.reset_pass_ui_link}?id=${user.email}&token=${resetToken} `;
    (0, sendEmail_1.sendEmail)(user.email, resetUILink);
    console.log(resetUILink);
});
const resetPassword = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExistsById(payload === null || payload === void 0 ? void 0 : payload.id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user is not found !");
    }
    // checking if the user is already deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is deleted !");
    }
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.userStatus;
    if (userStatus === "blocked") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is blocked ! !");
    }
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    //localhost:3000?id=A-0001&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDI4NTA2MTcsImV4cCI6MTcwMjg1MTIxN30.-T90nRaz8-KouKki1DkCSMAbsHyb9yDi0djZU3D6QO4
    if (payload.id !== decoded.userId) {
        console.log(payload.id, decoded.userId);
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are forbidden!");
    }
    //hash new password
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    yield user_model_1.User.findOneAndUpdate({
        id: decoded.userId,
        role: decoded.role,
    }, {
        password: newHashedPassword,
        passwordChangedAt: new Date(),
    });
});
exports.AuthServices = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
};
