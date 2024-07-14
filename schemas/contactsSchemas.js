import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name should be a type of text",
    "any.required": "Name is a required field",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email",
    "any.required": "Email is a required field",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .length(9)
    .required()
    .messages({
      "string.pattern.base": "Phone must contain only numbers",
      "string.length": "Phone must be exactly 9 digits",
    }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().optional().messages({
    "string.base": "Name should be a type of text",
  }),
  email: Joi.string().email().optional().messages({
    "string.email": "Email must be a valid email",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .length(9)
    .optional()
    .messages({
      "string.pattern.base": "Phone must contain only numbers",
    }),
})
  .or("name", "email", "phone")
  .messages({
    "object.missing": "Body must have at least one field",
  });
