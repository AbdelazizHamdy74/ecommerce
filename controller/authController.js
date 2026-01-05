const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const sendEmail = require("../utils/sendEmail");
const { createToken } = require("../utils/createToken");

exports.signup = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    username,
    email,
    password,
    first_name,
    last_name,
    second_name,
    birth_date,
    gender,
    role,
    phone,
    country,
    profile_picture,
  } = req.body;

  const existingUser = await User.getUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: "Email is already taken" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = uuidv4();

  await User.createUser({
    id: userId,
    username,
    email,
    password_hash: hashedPassword,
    first_name,
    last_name: last_name || second_name,
    birth_date: birth_date || null,
    gender,
    role,
    phone,
    country,
    profile_picture: profile_picture || null,
  });

  res.status(201).json({ message: "User registered successfully", userId });
});

exports.signin = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await User.getUserByEmail(email);
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({ message: "User logged in successfully", token });
});

exports.logout = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "User logged out successfully" });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.getUserByEmail(email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  await User.updatePasswordReset(user.id, {
    password_reset_code: hashedToken,
    password_reset_expires: new Date(Date.now() + 10 * 60 * 1000),
    password_reset_verified: false,
  });

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Password",
      message: `Hello ${user.first_name} \n Your reset code is: ${token}`,
    });
  } catch (error) {
    await User.updatePasswordReset(user.id, {
      password_reset_code: null,
      password_reset_expires: null,
      password_reset_verified: null,
    });
    return res.status(500).json({ message: "Failed to send email" });
  }
  res.status(200).json({ message: "Reset code sent successfully" });
});

exports.verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
  const hashResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findUserByPasswordResetCode(hashResetCode);

  if (!user) {
    return res.status(400).json({ message: "Password reset code is invalid" });
    // return next(
    //   new ApiError("Password reset code is invalid or has expired", 400)
    // );
  }

  await User.updatePasswordResetVerified(user.id);

  res.status(200).json({
    status: "success",
    message: "Password reset code has been verified",
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      status: "fail",
      message: "Password and confirm password do not match",
    });
  }

  const user = await User.getUserByEmail(email);

  if (!user) {
    return res.status(404).json({ message: "User for this email not found" });
  }

  if (!user.password_reset_verified) {
    return res.status(400).json({
      message: "Password reset code is not verified",
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await User.updatePasswordAndResetFields(user.id, hashedPassword);

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({
    status: "success",
    message: "Password has been changed",
    token,
  });
});
