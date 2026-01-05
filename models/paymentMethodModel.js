const knex = require("../config/db");

exports.createPaymentMethod = async (data) => {
  return knex("payment_methods").insert(data);
};

exports.getPaymentMethodsByUser = async (userId) => {
  return knex("payment_methods")
    .where({ user_id: userId })
    .orderBy("is_default", "desc");
};

exports.getPaymentMethodById = async (id) => {
  return knex("payment_methods").where({ id }).first();
};

exports.deletePaymentMethod = async (id) => {
  return knex("payment_methods").where({ id }).del();
};
