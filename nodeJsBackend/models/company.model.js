import mongoose from "mongoose";

const companySchema = mongoose.Schema({
  company_name: {
    type: String,
    required: true,
    unique: true,
  },
  company_email: {
    type: String,
    required: true,
    unique: true,
  },
});

export const Company = mongoose.model("Company", companySchema);
