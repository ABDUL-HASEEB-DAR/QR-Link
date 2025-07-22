import bcrypt from "bcryptjs";
import { Admin } from "../models/mergeModels.js";

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send("All fields are required i.e email and password");
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).send("Admin not found");
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }
    res.status(200).json({
      message: "Login successful",
      admin: { id: admin._id, username: admin.username, email: admin.email },
    });
  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).json({ error: error.message });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .send("All fields are required i.e username, email and password");
    }
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).send("Admin already exists");
    }
    const encPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({
      username,
      email,
      password: encPassword,
    });
    await admin.save();
    res.status(201).json({
      message: "Admin created successfully",
      admin: { username, email, id: admin._id },
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { adminId } = req.body;
    if (!adminId) {
      return res.status(400).send("Admin ID is required");
    }
    const deletedAdmin = await Admin.findByIdAndDelete(adminId);
    if (!deletedAdmin) {
      return res.status(404).send("Admin not found");
    }
    res.status(200).json({
      message: "Admin deleted successfully",
      admin: { name: deletedAdmin.username, id: deletedAdmin._id },
    });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { adminId, username, email, password } = req.body;
    if (!adminId) {
      return res.status(400).send("Admin ID is required");
    }
    if (!username && !email && !password) {
      return res.status(400).send("All fields are required");
    }
    const admin = await Admin.findByIdAndUpdate(adminId);
    if (!admin) {
      return res.status(404).send("Admin not found");
    }
    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);
    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updates, {
      new: true,
    });
    if (!updatedAdmin) {
      return res.status(404).send("Admin not found");
    }
    res.status(200).json({
      message: "Admin updated successfully",
      admin: {
        id: updatedAdmin._id,
        username: updatedAdmin.username,
        email: updatedAdmin.email,
      },
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ error: error.message });
  }
};

export { adminLogin, createAdmin, deleteAdmin, updateAdmin };
