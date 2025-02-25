import { Schema } from "mongoose";

export interface ITodo {
  title: string;
  description: string;
  dueDate: Date;
  status: "Pending" | "Completed";
  priority: "High" | "Medium" | "Low";
  user: Schema.Types.ObjectId;
  googleEventId?: string;
}
