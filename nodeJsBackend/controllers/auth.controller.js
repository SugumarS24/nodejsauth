import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export async function signup(req, res) {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
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
    const findDublUser = await User.findOne({ username: username });

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

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const findUser = await User.findOne({ email: email });

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
