import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const mongoURI = process.env.MONGO_URI as string;
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default dbConnect;
