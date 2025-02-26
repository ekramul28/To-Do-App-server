import jwt, { SignOptions, Secret, JwtPayload } from "jsonwebtoken";

export const createToken = (
  jwtPayload: { userId: string; role: string },
  secret: Secret, // Ensure secret is correctly typed
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  } as SignOptions);
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const generateMailCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
