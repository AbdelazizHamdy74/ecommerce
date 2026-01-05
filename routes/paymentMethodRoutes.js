const express = require("express");
const router = express.Router();
const paymentController = require("../controller/paymentMethodController");
const protect = require("../middleware/protect");
const ensureUserExists = require("../middleware/ensureUserExists");

router.post(
  "/",
  protect,
  ensureUserExists,
  paymentController.createPaymentMethod
);
router.get(
  "/user/:userId",
  protect,
  ensureUserExists,
  paymentController.getByUser
);
router.delete("/:id", protect, paymentController.deletePaymentMethod);

module.exports = router;
