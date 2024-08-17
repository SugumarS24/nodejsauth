import mongoose from "mongoose";
import { ENV_VARS } from "./enVars.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV_VARS.MONGO_URI);
    console.log(conn.connection.host);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
