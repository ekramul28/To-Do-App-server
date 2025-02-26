"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTodoSchema = exports.createTodoSchema = void 0;
const zod_1 = require("zod");
exports.createTodoSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Title must be at least 3 characters long"),
    description: zod_1.z.string().optional(),
    dueDate: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
    status: zod_1.z.enum(["Pending", "Completed"]),
    priority: zod_1.z.enum(["High", "Medium", "Low"]),
});
exports.updateTodoSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(3, "Title must be at least 3 characters long")
        .optional(),
    description: zod_1.z.string().optional(),
    dueDate: zod_1.z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    })
        .optional(),
    status: zod_1.z.enum(["Pending", "Completed"]).optional(),
    priority: zod_1.z.enum(["High", "Medium", "Low"]).optional(),
});
