import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export async function registerCompany(req, res) {
  try {
    const { company_name, company_email } = req.body;
    if (!company_name || !company_email) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const findDublEmail = await Company.findOne({
      company_email: company_email,
    });

    if (findDublEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const findDublUser = await Company.findOne({ company_name: company_name });

    if (findDublUser) {
      return res.status(400).json({
        success: false,
        message: "Company name already exists",
      });
    }

    const company = new Company({
      company_name: company_name,
      company_email: company_email,
    });
    await company.save();

    res.status(200).json({
      success: true,
      message: "Company registered successfully",
      company: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getAllCompanies(req, res) {
  try {
    const companies = await Company.find();

    res.status(200).json({
      success: true,
      message: "Get companies list successfully",
      companies: companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password, company_name } = req.body;

    if (!email || !password || !company_name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const company = await Company.findOne({
      company_name: company_name,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const findUser = await User.findOne({
      email: email,
      company_id: company._id,
    });

    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "User not found in this company",
      });
    }

    const isPasswordCorrect = await bcryptjs.compare(
      password,
      findUser.password
    );

    if (!isPasswordCorrect || !findUser) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = await generateToken(findUser._id, res);

    res.status(200).json({
      success: true,
      message: "User loggedin successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function addUser(req, res) {
  try {
    const { email, password, username, company_id } = req.body;
    if (!email || !password || !username || !company_id) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be atleast 6 characters",
      });
    }

    const findDublEmail = await User.findOne({ email: email });

    if (findDublEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const findDublUser = await User.findOne({
      username: username,
      company_id: company_id,
    });

    if (findDublUser) {
      return res.status(400).json({
        success: false,
        message: "Name already exists",
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      email: email,
      username: username,
      password: hashedPassword,
      company_id: company_id,
    });

    await newUser.save();

    const user = newUser.toObject();
    delete user.password; // Remove the password field

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getAllUsers(req, res) {
  try {
    const { company_id } = req.user;
    const users = await User.find({ company_id }).populate("company_id");

    res.status(200).json({
      success: true,
      message: "Get companies list successfully",
      users: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("user-token");
    res.status(200).json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function currentUser(req, res) {
  try {
    const user = req.user.toObject();
    delete user.password; // Remove the password field

    res.status(201).json({
      success: true,
      message: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
