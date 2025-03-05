
import bcrypt from "bcryptjs";
import User from "../models/User.js"

import jwt from "jsonwebtoken"


// 📌 Signup Controller
export const signup = async (req, res) => {
  try {
    const { username, email, first_name, last_name, password, staff_status } = req.body;

  
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = await User.create({
      username,
      email,
      first_name,
      last_name,
      staff_status,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// 📌 Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, { httpOnly: true, secure: true });
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// 📌 Logout Controller
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
};
export const changePassword = async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user.id; // User ID from JWT token
  
      // Find user
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Check if old password is correct
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
  
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  



