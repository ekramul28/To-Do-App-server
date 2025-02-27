import { Schema, model } from "mongoose";
import { IUser, UserModel } from "./user.interface";
import bcrypt from "bcrypt";

const userSchema = new Schema<IUser, UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isGoogleAuth: { type: Boolean, default: false },
    profileImg: { type: String },
    id: { type: String },
    isDeleted: { type: Boolean, default: false },
    userStatus: {
      type: String,
      enum: ["blocked", "in-progress"],
      default: "in-progress",
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Remove password after saving user
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

// Check if user exists by ID
userSchema.statics.isUserExistsById = async function (email: string) {
  return await this.findOne({ email: email }).select("+password");
};

// Compare passwords
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<IUser, UserModel>("User", userSchema);
