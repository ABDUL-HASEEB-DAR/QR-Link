import bcrypt from "bcryptjs";
import { User } from "../models/mergeModels.js";

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("All fields are required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }
    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send("All fields are required");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send("User already exists");
    }
    const encPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: encPassword,
    });
    await newUser.save();
    res.status(201).json({
      message: "User created successfully",
      user: { username, email },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  console.log("deleteUser function called", req.body);
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).send("User ID is required");
    }
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }
    res.status(200).json({
      message: "User deleted successfully",
      user: { name: deletedUser.username, id: deletedUser._id },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  console.log("updateUser function called", req.body);
  try {
    const { userId, username, email, password } = req.body;
    if (!userId) {
      return res.status(400).send("User ID is required");
    }
    if (!username && !email && !password) {
      return res.status(400).send("All fields are required");
    }
    const user = await User.findByIdAndUpdate(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const updateUser = {};
    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message });
  }
};

export { createUser, deleteUser, updateUser, userLogin };
