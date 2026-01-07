const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const Address = require("../models/addressModel");

exports.createAddress = asyncHandler(async (req, res) => {
  const requester = req.user;
  const bodyUserId = req.body.user_id;
  const userId = bodyUserId || (requester && requester.id);

  if (!userId) return res.status(400).json({ message: "user_id required" });
  // allow admin to create for any user, otherwise only for self
  if (requester && requester.role !== "Admin" && requester.id !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const address = {
    id: uuidv4(),
    user_id: userId,
    label: req.body.label || null,
    recipient_name: req.body.recipient_name || null,
    phone: req.body.phone || null,
    country: req.body.country || null,
    state: req.body.state || null,
    city: req.body.city || null,
    postal_code: req.body.postal_code || null,
    street: req.body.street || null,
    is_default: req.body.is_default ? true : false,
    metadata: req.body.metadata || null,
  };

  await Address.createAddress(address);
  res.status(201).json({ message: "Address created", id: address.id });
});

exports.getByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const requester = req.user;
  if (requester && requester.role !== "Admin" && requester.id !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const addresses = await Address.getAddressesByUser(userId);
  res.status(200).json(addresses);
});

exports.deleteAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const requester = req.user;

  const address = await Address.getAddressById(id);
  if (!address) {
    return res.status(404).json({ message: "Address not found" });
  }

  if (
    requester &&
    requester.role !== "Admin" &&
    requester.id !== address.user_id
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await Address.deleteAddress(id);
  res.status(200).json({ message: "Address deleted" });
});
