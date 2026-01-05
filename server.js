const express = require("express");

const app = express();

app.use(express.json());

// Import Routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const addressRoutes = require("./routes/addressRoutes");
const paymentRoutes = require("./routes/paymentMethodRoutes");

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/payment-methods", paymentRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
