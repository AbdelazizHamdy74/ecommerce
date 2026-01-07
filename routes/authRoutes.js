const express = require("express");
const router = express.Router();

const {
  signup,
  signin,
  logout,
  forgotPassword,
  verifyPasswordResetCode,
  resetPassword,
} = require("../controller/authController");
const {
  signupValidator,
  signinValidator,
} = require("../utils/validations/authValidator");

const protect = require("../middleware/protect");

/**
 * @route POST /api/auth/signup
 * @desc Signup a new user
 * @access Public
 */
router.post("/signup", signupValidator, signup);

/**
 * @route POST /api/auth/signin
 * @desc Signin a user
 * @access Public
 */
router.post("/signin", signinValidator, signin);

/**
 * @route POST /api/auth/logout
 * @desc Logout a user
 * @access Private
 */
router.post("/logout", protect, logout);

/**
 * @route POST /api/auth/forgotPassword
 * @desc Send forgot password email
 * @access Public
 */
router.post("/forgotPassword", forgotPassword);

/**
 * @route POST /api/auth/verifyPasswordResetCode
 * @desc Verify password reset code
 * @access Public
 */
router.post("/verifyPasswordResetCode", verifyPasswordResetCode);

/**
 * @route PUT /api/auth/resetPassword
 * @desc Reset password
 * @access Public
 */
router.put("/resetPassword", resetPassword);

module.exports = router;
