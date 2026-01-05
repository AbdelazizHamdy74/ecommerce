const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("payment_methods").del();
  await knex("addresses").del();
  await knex("users").del();

  const adminId = uuidv4();
  const customerId = uuidv4();

  const adminPassword = bcrypt.hashSync("AdminPass123", 12);
  const customerPassword = bcrypt.hashSync("Customer123", 12);

  await knex("users").insert([
    {
      id: adminId,
      username: "admin",
      email: "admin@example.com",
      password_hash: adminPassword,
      first_name: "Admin",
      last_name: "User",
      role: "Admin",
      phone: "1000000000",
      country: "Egypt",
      is_active: true,
    },
    {
      id: customerId,
      username: "jdoe",
      email: "jdoe@example.com",
      password_hash: customerPassword,
      first_name: "John",
      last_name: "Doe",
      role: "Customer",
      phone: "1000000001",
      country: "Egypt",
      is_active: true,
    },
  ]);

  await knex("addresses").insert([
    {
      id: uuidv4(),
      user_id: customerId,
      label: "Home",
      recipient_name: "John Doe",
      phone: "1000000001",
      country: "Egypt",
      state: "Cairo",
      city: "Cairo",
      postal_code: "11511",
      street: "123 Example St",
      is_default: true,
    },
  ]);

  await knex("payment_methods").insert([
    {
      id: uuidv4(),
      user_id: customerId,
      type: "card",
      provider: "visa",
      last4: "4242",
      expiry_month: 12,
      expiry_year: 2026,
      token: "tok_test_visa",
      is_default: true,
    },
  ]);
};
