const express = require("express");
const router = express.Router();
const addressController = require("../controller/addressController");
const protect = require("../middleware/protect");
const ensureUserExists = require("../middleware/ensureUserExists");

router.post("/", protect, ensureUserExists, addressController.createAddress);
router.get(
  "/user/:userId",
  protect,
  ensureUserExists,
  addressController.getByUser
);
router.delete("/:id", protect, addressController.deleteAddress);

module.exports = router;
