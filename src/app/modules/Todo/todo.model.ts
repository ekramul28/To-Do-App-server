import { Schema, model } from "mongoose";
import { ITodo } from "./todo.interface";

const todoSchema = new Schema<ITodo>(
  {
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ["Pending", "inProgress", "Completed"],
      default: "Pending",
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    userEmail: { type: String },
    googleEventId: { type: String },
    isCompleted: { type: String, default: false },
  },
  { timestamps: true }
);

export const Todo = model<ITodo>("Todo", todoSchema);
