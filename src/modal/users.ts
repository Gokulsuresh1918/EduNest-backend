import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true },
    password: { type: String },
    otp: { type:Number, required: false },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
