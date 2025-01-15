import mongoose from "mongoose";
import envConfig from "./envConfig";

const dbConnect = async () => {
  try {
    await mongoose.connect(envConfig.mongo_uri as string);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default dbConnect;
