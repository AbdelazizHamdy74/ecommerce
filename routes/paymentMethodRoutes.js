const express = require("express");
const router = express.Router();
const paymentController = require("../controller/paymentMethodController");
const protect = require("../middleware/protect");
const ensureUserExists = require("../middleware/ensureUserExists");

/**
 * @route POST /api/payment-methods
 * @desc Create a new payment method
 * @access Private [the user themselves]
 */
router.post(
  "/",
  protect,
  ensureUserExists,
  paymentController.createPaymentMethod
);
/**
 * @route GET /api/payment-methods/user/:userId
 * @desc Get all payment methods for a specific user by user ID
 * @access Private [Admin and the user themselves]
 */
router.get(
  "/user/:userId",
  protect,
  ensureUserExists,
  paymentController.getByUser
);
/**
 * @route DELETE /api/payment-methods/:id
 * @desc Delete a payment method by ID
 * @access Private [Admin and the user themselves]
 */
router.delete("/:id", protect, paymentController.deletePaymentMethod);

module.exports = router;
