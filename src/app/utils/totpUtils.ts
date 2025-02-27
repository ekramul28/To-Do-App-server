import speakeasy from "speakeasy";

/**
 * Verifies a TOTP code generated by Google Authenticator
 * @param {string} userToken - The token submitted by the user
 * @param {string} secret - The user's secret key (stored when setting up 2FA)
 * @returns {boolean} - Returns true if the token is valid, false otherwise
 */
export const verifyTOTP = (userToken: string, secret: string): boolean => {
  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: userToken,
  });
  return verified;
};

/**
 * Generates a new secret for the user (e.g., during 2FA setup)
 * @returns {string} - Returns a new base32-encoded secret
 */
export const generateSecret = (): string => {
  const secret = speakeasy.generateSecret({ length: 20 });
  return secret.base32; // Base32 is the format used by Google Authenticator
};
