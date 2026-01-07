const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const Payment = require("../models/paymentMethodModel");

exports.createPaymentMethod = asyncHandler(async (req, res) => {
  const requester = req.user;
  const bodyUserId = req.body.user_id;
  const userId = bodyUserId || (requester && requester.id);

  if (!userId) return res.status(400).json({ message: "user_id required" });
  if (requester && requester.role !== "Admin" && requester.id !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const pm = {
    id: uuidv4(),
    user_id: userId,
    type: req.body.type || "card",
    provider: req.body.provider || null,
    last4: req.body.last4 || null,
    expiry_month: req.body.expiry_month || null,
    expiry_year: req.body.expiry_year || null,
    token: req.body.token || null,
    is_default: req.body.is_default ? true : false,
    metadata: req.body.metadata || null,
  };

  await Payment.createPaymentMethod(pm);
  res.status(201).json({ message: "Payment method created", id: pm.id });
});

exports.getByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const requester = req.user;
  if (requester && requester.role !== "Admin" && requester.id !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const methods = await Payment.getPaymentMethodsByUser(userId);
  res.status(200).json(methods);
});

exports.deletePaymentMethod = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const requester = req.user;

  const paymentMethod = await Payment.getPaymentMethodById(id);
  if (!paymentMethod) {
    return res.status(404).json({ message: "Payment method not found" });
  }

  if (
    requester &&
    requester.role !== "Admin" &&
    requester.id !== paymentMethod.user_id
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await Payment.deletePaymentMethod(id);
  res.status(200).json({ message: "Payment method deleted" });
});
