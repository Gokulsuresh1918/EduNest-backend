import mongoose, { Schema } from "mongoose";

import { User } from "./users";

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    dueDate: { type: Date, required: true },
    classCode: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "inProgress", "completed"],
      default: "pending",
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", TaskSchema);
