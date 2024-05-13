import mongoose from "mongoose";

const temporarySchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true },
    password: { type: String },
    otp: { type:Number, required: true },
  },
  { timestamps: true }
);

export const Temporary = mongoose.model("Temporary", temporarySchema);
