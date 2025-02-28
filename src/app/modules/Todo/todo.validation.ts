import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional(),
  dueDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .optional(),
  status: z.enum(["Pending", "inProgress", "Completed"]),
  priority: z.enum(["High", "Medium", "Low"]),
});

export const updateTodoSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .optional(),
  description: z.string().optional(),
  dueDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .optional(),
  status: z.enum(["Pending", "inProgress", "Completed"]).optional(),
  priority: z.enum(["High", "Medium", "Low"]).optional(),
});
