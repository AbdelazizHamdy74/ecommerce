const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const protect = require("../middleware/protect");

/**
 * @route GET /api/users/display
 * @desc Get all users
 * @access Private [Admin]
 */
router.get("/display", userController.getAllUsers);

/**
 * @route GET /api/users/:id
 * @desc Get user by ID
 * @access Private [Admin and the user themselves]
 */
router.get("/:id", userController.getUserById);

/**
 * @route PUT /api/users/:id
 * @desc Update user by ID
 * @access Private [Admin and the user themselves]
 */
router.put("/:id", userController.updateUser);

/**
 * @route DELETE /api/users/:id
 * @desc Delete user by ID
 * @access Private [Admin and the user themselves]
 */
router.delete("/:id", userController.deleteUser);

/**
 * @route PATCH /api/users/:id/restore
 * @desc Restore user by ID
 * @access Private [Admin]
 */
router.patch("/:id/restore", protect, userController.restoreUser);

/**
 * @route POST /api/users/create
 * @desc Create a new user
 * @access Private [Admin]
 */
router.post("/create", protect, userController.createUser);

module.exports = router;
