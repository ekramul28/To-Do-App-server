import { z } from "zod";

const userRegisterSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["user", "admin"]),
  profileImg: z.string().optional(),
});

export const UserValidation = {
  userRegisterSchema,
};
