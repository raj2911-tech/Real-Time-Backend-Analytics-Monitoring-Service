import User from "../models/User.js";
import Tenant from "../models/Tenant.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateApiKey } from "../utils/generateApiKey.js";


// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, companyName } = req.body;

    if (!name || !email || !password || !companyName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if tenant already exists with this email
    const existingTenant = await Tenant.findOne({ email });
    if (existingTenant) {
      return res.status(409).json({ message: "Tenant with this email already exists" });
    }

    // Create tenant
    const apiKey = generateApiKey();
    const tenant = await Tenant.create({
      _id: new Date().getTime().toString(),
      companyName,
      email,
      apiKey,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user for this tenant
    const user = await User.create({
      tenantId: tenant._id,
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, tenantId: tenant._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      apiKey,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: tenant._id,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, tenantId: user.tenantId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// @route   POST /api/auth/logout
export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful. Please discard your token." });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};