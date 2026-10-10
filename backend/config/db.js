import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    if (!process.env.VERCEL) process.exit(1);
    throw error;
  }
};

export default connectDB;