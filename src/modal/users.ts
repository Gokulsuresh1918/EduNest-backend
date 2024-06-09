import mongoose, { Schema } from "mongoose";
import { Classroom } from "../modal/classroom";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true },
    password: { type: String },
    otp: { type: Number, required: false },
    status: { type: Boolean, default: true },
    createdClassrooms: [{ type: Schema.Types.ObjectId, ref: "Classroom" }],
    joinedClassrooms: [{ type: Schema.Types.ObjectId, ref: "Classroom" }],
    role: { type: String, enum: ["user", "admin"], default: "user" },
    googleId: { type: String },
    refreshToken: { type: String },
  },
  { timestamps: true }
);
export const User = mongoose.model("User", UserSchema);
