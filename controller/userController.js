const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const UserModel = require("../models/userModel");
const userValidationSchema = require("../utils/validations/userValidation");
const asyncHandler = require("express-async-handler");

// Get all users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.getAllUsers();
  res.status(200).json(users);
});

// Get user by ID
exports.getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.getUserById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
});

// Update user
exports.updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userData = req.body;
  await UserModel.updateUser(id, userData);
  res.status(200).json({ message: "User updated successfully" });
});

// Soft delete user
exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await UserModel.softDeleteUser(id);
  res.status(200).json({ message: "User deleted successfully" });
});

// restore user
exports.restoreUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.restoreUser(id);
  if (!user) {
    return res
      .status(404)
      .json({ message: "User not found or already restored" });
  }
  res.status(200).json({ message: "User restored successfully" });
});

// Admin: create a new user
exports.createUser = asyncHandler(async (req, res) => {
  // only admin can create
  const requester = req.user;
  if (!requester || requester.role !== "Admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const id = uuidv4();
  const { password, retype_password, last_name, second_name } = req.body;
  if (password !== retype_password) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const hashed = await bcrypt.hash(password, 12);

  // only include fields that exist in the users table
  const userData = {
    id,
    username: req.body.username,
    email: req.body.email,
    password_hash: hashed,
    first_name: req.body.first_name,
    last_name: last_name || second_name,
    birth_date: req.body.birth_date || null,
    gender: req.body.gender || null,
    role: req.body.role || "Customer",
    phone: req.body.phone || null,
    country: req.body.country || null,
    profile_picture: req.body.profile_picture || null,
  };

  await UserModel.createUser(userData);
  res.status(201).json({ message: "User created successfully", id });
});
