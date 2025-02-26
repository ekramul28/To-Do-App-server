"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo = void 0;
const mongoose_1 = require("mongoose");
const todoSchema = new mongoose_1.Schema({
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
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    googleEventId: { type: String },
}, { timestamps: true });
exports.Todo = (0, mongoose_1.model)("Todo", todoSchema);
