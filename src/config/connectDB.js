import mongoose from "mongoose";
import { MONGO_URL } from "./environment.config.js";

export const connectDB = async () => {
  try {
    if (!MONGO_URL) {
      console.error("MONGO_URL environment variable is not defined");
    }
    await mongoose.connect(MONGO_URL);
    console.log("Mongodb Connected!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
