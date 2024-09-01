import mongoose from "mongoose";
import { ENV_VARS } from "./enVars.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV_VARS.MONGO_URI);
  } catch (error) {
    process.exit(1);
  }
};
