import { Schema } from "mongoose";

export interface ITodo {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: "Pending" | "Completed" | "inProgress";
  priority: "High" | "Medium" | "Low";
  user: Schema.Types.ObjectId;
  googleEventId?: string;
  isCompleted: Boolean;
  userEmail: string;
}
