const knex = require("../config/db");

exports.createUser = async (userData) => {
  return knex("users").insert(userData);
};

exports.getUserByEmail = async (email) => {
  return knex("users").where({ email }).first();
};

exports.getUserByUsername = async (username) => {
  return knex("users").where({ username }).first();
};

exports.getUserByPhone = async (phone) => {
  return knex("users").where({ phone }).first();
};

exports.updatePasswordReset = async (userId, data) => {
  return knex("users")
    .where({ id: userId })
    .update({
      password_reset_code: data.passwordResetCode || data.password_reset_code,
      password_reset_expires:
        data.passwordResetExpires || data.password_reset_expires,
      password_reset_verified:
        data.passwordResetVerified ?? data.password_reset_verified,
    });
};
exports.saveOTP = async (userId, otp) => {
  // set otp_code and expiry 10 minutes from now
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  return knex("users")
    .where({ id: userId })
    .update({ otp_code: otp, otp_expires_at: expiresAt });
};

exports.validateOTP = async (userId, otp) => {
  const user = await knex("users").where({ id: userId }).first();

  if (!user || user.otp_code != otp) {
    return false;
  }

  const otpExpiry = user.otp_expires_at ? new Date(user.otp_expires_at) : null;
  if (!otpExpiry || otpExpiry < new Date()) {
    return false;
  }

  return true;
};

exports.updatePassword = async (userId, hashedPassword) => {
  return knex("users")
    .where({ id: userId })
    .update({ password_hash: hashedPassword });
};

exports.getAllUsers = async () => {
  return knex("users").whereNull("deleted_at");
};

exports.getUserById = async (id) => {
  return knex("users").where({ id }).whereNull("deleted_at").first();
};

exports.updateUser = async (id, data) => {
  const userExists = await knex("users")
    .where({ id })
    .whereNull("deleted_at")
    .first();
  if (!userExists) {
    throw new Error("User not found");
  }
  return knex("users").where({ id }).update(data);
};

exports.softDeleteUser = async (id) => {
  return knex("users").where({ id }).update({ deleted_at: knex.fn.now() });
};

exports.restoreUser = async (id) => {
  return knex("users").where({ id }).update({ deleted_at: null });
};

///
exports.findUserByPasswordResetCode = async (hashResetCode) => {
  return knex("users")
    .where({
      password_reset_code: hashResetCode,
      password_reset_verified: false,
    })
    .andWhere("password_reset_expires", ">", knex.fn.now())
    .first();
};

exports.updatePasswordResetVerified = async (userId) => {
  return knex("users")
    .where({ id: userId })
    .update({ password_reset_verified: true });
};

exports.updatePasswordAndResetFields = async (userId, hashedPassword) => {
  return knex("users").where({ id: userId }).update({
    password_hash: hashedPassword,
    password_reset_code: null,
    password_reset_expires: null,
    password_reset_verified: null,
  });
};
