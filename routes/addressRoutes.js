const express = require("express");
const router = express.Router();
const addressController = require("../controller/addressController");
const protect = require("../middleware/protect");
const ensureUserExists = require("../middleware/ensureUserExists");

/**
 * @route POST /api/addresses
 * @desc Create a new address
 * @access Private [he user themselves]
 */
router.post("/", protect, ensureUserExists, addressController.createAddress);
/**
 * @route GET /api/addresses/user/:userId
 * @desc Get all addresses for a specific user by user ID
 * @access Private [Admin and the user themselves]
 */
router.get(
  "/user/:userId",
  protect,
  ensureUserExists,
  addressController.getByUser
);
/**
 * @route DELETE /api/addresses/:id
 * @desc Delete an address by ID
 * @access Private [Admin and the user themselves]
 */
router.delete("/:id", protect, addressController.deleteAddress);

module.exports = router;
