
import mongoose from "mongoose";
const url = process.env.MONGODB_URL;


if (!url) {
 console.log('here issue is in mongodb connnection');
 
}

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(url,{
      dbName:""
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  } 
};