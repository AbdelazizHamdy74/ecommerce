const knex = require("../../config/db");
const { body } = require("express-validator");

const signupValidator = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("retype_password")
    .notEmpty()
    .withMessage("Retype password is required")
    .custom((value, { req }) => {
      // validate that password and retype_password match
      if (value !== req.body.password) {
        throw new Error("Password and retype password must match");
      }
      return true;
    }),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .custom(async (value) => {
      // validate that phone number is unique in the database
      const user = await knex("users").where({ phone: value }).first();
      if (user) {
        throw new Error("Phone number is already in use");
      }
      return true;
    }),
];

const signinValidator = [
  body("email").notEmpty().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = { signupValidator, signinValidator };
