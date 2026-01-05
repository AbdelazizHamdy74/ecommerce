const knex = require("../config/db");

exports.createAddress = async (data) => {
  return knex("addresses").insert(data);
};

exports.getAddressesByUser = async (userId) => {
  return knex("addresses")
    .where({ user_id: userId })
    .orderBy("is_default", "desc");
};

exports.getAddressById = async (id) => {
  return knex("addresses").where({ id }).first();
};

exports.deleteAddress = async (id) => {
  return knex("addresses").where({ id }).del();
};
