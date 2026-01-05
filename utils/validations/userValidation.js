const Joi = require("joi");

const userValidationSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .required(),
  password: Joi.string().min(6).required(),
  retype_password: Joi.string().valid(Joi.ref("password")).required(),
  birth_date: Joi.date().optional(),
  gender: Joi.string().valid("Male", "Female", "Other").optional(),
  profile_picture: Joi.string().uri().optional(),
  role: Joi.string()
    .valid("Admin", "Customer", "Supplier", "Delivery")
    .required(),
  country: Joi.string().required(),
});

module.exports = userValidationSchema;
