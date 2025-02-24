import speakeasy from "speakeasy";
import qrcode from "qrcode";

// Generate secret for Google Authenticator
export const generateGoogleAuthSecret = (userId: string) => {
  const secret = speakeasy.generateSecret({ name: `ToDoApp-${userId}` });
  return secret;
};

// Generate QR code
export const generateQRCode = async (secret: string) => {
  try {
    const qrCode = await qrcode.toDataURL(secret.otpauth_url);
    return qrCode;
  } catch (error) {
    throw new Error("Error generating QR code");
  }
};

// Verify Google Authenticator code
export const verifyGoogleAuthCode = (secret: any, code: any) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: code,
  });
};
