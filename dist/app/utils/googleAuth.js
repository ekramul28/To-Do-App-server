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
exports.verifyGoogleAuthCode = exports.generateQRCode = exports.generateGoogleAuthSecret = void 0;
const speakeasy_1 = __importDefault(require("speakeasy"));
const qrcode_1 = __importDefault(require("qrcode"));
// Generate secret for Google Authenticator
const generateGoogleAuthSecret = (userId) => {
    const secret = speakeasy_1.default.generateSecret({ name: `ToDoApp-${userId}` });
    return secret;
};
exports.generateGoogleAuthSecret = generateGoogleAuthSecret;
// Generate QR code
const generateQRCode = (secret) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const qrCode = yield qrcode_1.default.toDataURL(secret.otpauth_url);
        return qrCode;
    }
    catch (error) {
        throw new Error("Error generating QR code");
    }
});
exports.generateQRCode = generateQRCode;
// Verify Google Authenticator code
const verifyGoogleAuthCode = (secret, code) => {
    return speakeasy_1.default.totp.verify({
        secret: secret,
        encoding: "base32",
        token: code,
    });
};
exports.verifyGoogleAuthCode = verifyGoogleAuthCode;
