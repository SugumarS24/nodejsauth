import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  company_id: {
    type: String,
    required: true,
    unique: true,
    ref: "Company",
  },
});

export const User = mongoose.model("User", userSchema);
