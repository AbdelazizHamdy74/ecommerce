const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const protect = require("../middleware/protect");

// Routes
router.get("/display", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.patch("/:id/restore", protect, userController.restoreUser);
// Admin create user
router.post("/create", protect, userController.createUser);

module.exports = router;
