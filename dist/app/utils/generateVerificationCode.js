"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Generate and send email verification code
const crypto_1 = __importDefault(require("crypto"));
const generateVerificationCode = (email) => {
    const code = crypto_1.default.randomInt(100000, 999999).toString();
    const expirationTime = Date.now() + 2 * 60 * 1000; // 2-minute expiration
    verificationCodes[email] = { code, expirationTime };
    sendVerificationCode(email, code);
};
