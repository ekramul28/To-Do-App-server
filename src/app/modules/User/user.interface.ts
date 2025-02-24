export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  isGoogleAuth?: boolean;
  googleId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
