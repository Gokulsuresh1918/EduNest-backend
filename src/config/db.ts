import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();
const url = process.env.MONGODB_URL;
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(url);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;