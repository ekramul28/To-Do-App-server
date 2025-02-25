import { Schema, model } from "mongoose";
import { ITodo } from "./todo.interface";

const todoSchema = new Schema<ITodo>(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    googleEventId: { type: String },
  },
  { timestamps: true }
);

export const Todo = model<ITodo>("Todo", todoSchema);
