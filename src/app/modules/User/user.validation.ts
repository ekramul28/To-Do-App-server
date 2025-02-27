import { z } from "zod";

const userRegisterSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string(),
    profileImg: z.string().optional(),
  }),
});

export const UserValidation = {
  userRegisterSchema,
};
