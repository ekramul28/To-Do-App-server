// Generate and send email verification code
import crypto from "crypto";

const generateVerificationCode = (email: string) => {
  const code = crypto.randomInt(100000, 999999).toString();
  const expirationTime = Date.now() + 2 * 60 * 1000; // 2-minute expiration

  verificationCodes[email] = { code, expirationTime };
  sendVerificationCode(email, code);
};
