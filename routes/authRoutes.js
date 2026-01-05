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

router.post("/signup", signupValidator, signup);

router.post("/signin", signinValidator, signin);

router.post("/logout", protect, logout);

router.post("/forgotPassword", forgotPassword);

router.post("/verifyPasswordResetCode", verifyPasswordResetCode);

router.put("/resetPassword", resetPassword);

module.exports = router;
