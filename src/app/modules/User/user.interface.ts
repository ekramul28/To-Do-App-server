import { Model } from "mongoose";

export type UserStatus = "in-progress" | "blocked"; // Define userStatus type

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  isGoogleAuth?: boolean;
  isDeleted: boolean;
  userStatus: UserStatus; // Assign correct type
  googleId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserModel extends Model<IUser> {
  // Instance method for checking if the user exists
  isUserExistsById(id: string): Promise<IUser | null>; // Fixed return type

  // Instance method for checking if passwords match
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}
